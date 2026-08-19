import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  BursaPriceService,
  BursaHourlyPrice,
  BursaConfig,
  BursaMonthDay,
  BursaCorrectionLog,
  RefetchPreview,
  BursaSource
} from '../../services/bursaPriceService/bursa-price.service';
import { BursaFeeService, BursaFee } from '../../services/bursaFeeService/bursa-fee.service';
import { ExchangeRateService } from '../../services/exchangeRateService/exchange-rate.service';

interface CalendarCell {
  date: string;
  day: number;
  inMonth: boolean;
  info?: BursaMonthDay;
}

@Component({
  selector: 'app-bursa-prices',
  templateUrl: './bursa-prices.component.html'
})
export class BursaPricesComponent implements OnInit {

  // Roles / access
  userRole: string = '';
  canRefetch = false;
  canManualEntry = false;

  // Kalendar
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  calendarCells: CalendarCell[][] = [];
  monthDays: BursaMonthDay[] = [];
  monthLoading = false;

  // Detajet e nje dite
  selectedDate: string | null = null;
  dayPrices: BursaHourlyPrice[] = [];
  dayLoading = false;

  // Config
  config: BursaConfig | null = null;

  // Manual entry
  showManualForm = false;
  manualPrices: number[] = Array(24).fill(0);
  manualBulkPaste = '';

  // Corrections
  corrections: BursaCorrectionLog[] = [];
  correctionsLoading = false;

  // 🆕 Bursa Fees (tab)
  fees: BursaFee[] = [];
  feesLoading = false;
  showFeeForm = false;
  editingFee: BursaFee | null = null;
  feeFormModel: Partial<BursaFee> = this.emptyFee();

  // 🆕 Kursi aktual EUR→ALL — perdoret per konvertim te fee-ve nga nje valute ne tjeter
  // ne rreshtat e totalit. Fetchohet ne ngOnInit nga /api/v1/exchangeRate.
  //   - Nese eshte i disponueshem kursi i dites se zgjedhur (dayPrices), perdoret ai.
  //   - Perndryshe, kursi me i fundit efektiv.
  //   - Fallback: 100 (approx historik EUR/ALL) — vetem qe totalet te mos jene NaN.
  currentExchangeRate: number = 100;

  // 🆕 Totalet permbyllin TE 4 fee-t (jo vetem ato me valute perkatese), duke konvertuar
  // kur duhet me `currentExchangeRate`. Perputhet me kerkesen: "per te 4 fee".
  //
  // Total EUR Fee / MWh = Σ EUR_fees + (Σ ALL_fees ÷ kursi)
  //   ku Σ ALL_fees eshte ne ALL/MWh, kursi ALL per 1 EUR → jep EUR/MWh.
  //
  // Total ALL Fee / kWh = (Σ EUR_fees × kursi + Σ ALL_fees) ÷ 1000
  //   ku Σ EUR_fees × kursi jep ALL/MWh, mbledhur me Σ ALL_fees (ALL/MWh),
  //   pastaj ÷ 1000 per konvertim MWh → kWh.
  private sumFeesByCurrency(currency: 'EUR' | 'ALL'): number {
    return (this.fees || [])
      .filter(f => f.is_active && String(f.currency).toUpperCase() === currency)
      .reduce((sum, f) => sum + (Number(f.value_per_mwh) || 0), 0);
  }
  get totalEurFeePerMWh(): number {
    const eurPart = this.sumFeesByCurrency('EUR');           // EUR/MWh
    const allPart = this.sumFeesByCurrency('ALL');           // ALL/MWh
    const rate = Number(this.currentExchangeRate) || 1;      // ALL per 1 EUR
    return eurPart + (allPart / rate);                       // → EUR/MWh
  }
  get totalAllFeePerKWh(): number {
    const eurPart = this.sumFeesByCurrency('EUR');           // EUR/MWh
    const allPart = this.sumFeesByCurrency('ALL');           // ALL/MWh
    const rate = Number(this.currentExchangeRate) || 1;      // ALL per 1 EUR
    const allPerMWh = eurPart * rate + allPart;              // ALL/MWh
    return allPerMWh / 1000;                                 // → ALL/kWh
  }

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(
    private bursaService: BursaPriceService,
    private feeService: BursaFeeService,
    private exchangeRateService: ExchangeRateService
  ) {}

  // 🆕 Fetchon kursin me te fundit EUR→ALL per konvertimin e totaleve te fee-ve.
  private loadCurrentExchangeRate(): void {
    this.exchangeRateService.list({ valute: 'EUR' }).subscribe({
      next: (r) => {
        const rates = (r.rates || []);
        if (rates.length > 0) {
          // Rendit sipas dates DESC dhe merr me te fundit
          const sorted = [...rates].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          const latest = Number(sorted[0]?.exchange_rate);
          if (Number.isFinite(latest) && latest > 0) {
            this.currentExchangeRate = latest;
          }
        }
      },
      error: (e) => {
        logger.warn('Nuk mund te fetchohet kursi aktual EUR→ALL. Perdorim fallback 100.', e);
      }
    });
  }

  emptyFee(): Partial<BursaFee> {
    return {
      code: '',
      name: '',
      currency: 'EUR',
      value_per_mwh: 0,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      is_active: true,
      sort_order: 0,
      description: ''
    };
  }

  ngOnInit(): void {
    this.userRole = (localStorage.getItem('userRole') || '').trim();
    // RadX_Admin, RADX_MODERATOR, COMPANY_ADMIN mund te refetch + manual entry
    // COMPANY_ANALYST vetem view
    const editRoles = ['RadX_Admin', 'RADX_MODERATOR', 'COMPANY_ADMIN', 'COMPANY_ANALYST'];
    this.canRefetch = editRoles.includes(this.userRole);
    this.canManualEntry = editRoles.includes(this.userRole);

    this.loadConfig();
    this.loadMonth();
    this.loadFees();
    this.loadCurrentExchangeRate();
  }

  // ─────────────────────────────────────────────
  // Bursa Fees
  // ─────────────────────────────────────────────
  loadFees(): void {
    this.feesLoading = true;
    this.feeService.list().subscribe({
      next: (r) => {
        this.fees = r.fees || [];
        this.feesLoading = false;
      },
      error: (e) => {
        logger.error('Fees load failed:', e);
        this.fees = [];
        this.feesLoading = false;
      }
    });
  }

  openFeeForm(fee: BursaFee | null = null): void {
    this.editingFee = fee;
    if (fee) {
      this.feeFormModel = {
        code: fee.code,
        name: fee.name,
        currency: fee.currency,
        value_per_mwh: fee.value_per_mwh,
        effective_from: fee.effective_from,
        effective_to: fee.effective_to,
        is_active: fee.is_active,
        sort_order: fee.sort_order,
        description: fee.description
      };
    } else {
      this.feeFormModel = this.emptyFee();
    }
    this.showFeeForm = true;
  }

  closeFeeForm(): void {
    this.showFeeForm = false;
    this.editingFee = null;
  }

  saveFee(): void {
    const m = this.feeFormModel;
    if (!m.code || !m.name || !m.currency || m.value_per_mwh == null || !m.effective_from) {
      Swal.fire({ icon: 'warning', title: 'Required fields', text: 'Code, Name, Currency, Value/MWh, Effective From — all are required.' });
      return;
    }
    Swal.fire({ title: 'Saving...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const done = (r: any) => {
      Swal.fire({ icon: 'success', title: 'Saved', text: r?.fee?.name || '' });
      this.closeFeeForm();
      this.loadFees();
    };
    const fail = (err: any) => {
      Swal.fire({ icon: 'error', title: 'Save failed', text: err?.error?.message || err?.message || 'Error' });
    };
    if (this.editingFee) {
      this.feeService.update(this.editingFee.id, m).subscribe({ next: done, error: fail });
    } else {
      this.feeService.create(m).subscribe({ next: done, error: fail });
    }
  }

  deactivateFee(fee: BursaFee): void {
    Swal.fire({
      title: `Deactivate "${fee.name}"?`,
      text: 'This fee will no longer be included in calculations for new sessions. History is preserved.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545'
    }).then((r) => {
      if (!r.isConfirmed) return;
      this.feeService.deactivate(fee.id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Deactivated' });
          this.loadFees();
        },
        error: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err?.error?.message || 'Error' })
      });
    });
  }

  // ─────────────────────────────────────────────
  // Config
  // ─────────────────────────────────────────────
  loadConfig(): void {
    this.bursaService.getConfig().subscribe({
      next: (r) => { this.config = r.config; },
      error: (e) => logger.error('Config load failed:', e)
    });
  }

  // ─────────────────────────────────────────────
  // Kalendar
  // ─────────────────────────────────────────────
  loadMonth(): void {
    this.monthLoading = true;
    this.bursaService.getMonthSummary(this.currentYear, this.currentMonth).subscribe({
      next: (r) => {
        this.monthDays = r.days || [];
        this.buildCalendar();
        this.monthLoading = false;
      },
      error: (e) => {
        logger.error('Month load failed:', e);
        this.monthLoading = false;
      }
    });
  }

  buildCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth, 0);
    const daysInMonth = lastDay.getDate();
    // Monday = 0, Sunday = 6 (perputhet me weekDays array)
    const startWeekday = (firstDay.getDay() + 6) % 7;

    const dayInfoMap: Record<string, BursaMonthDay> = {};
    for (const d of this.monthDays) dayInfoMap[d.date] = d;

    const weeks: CalendarCell[][] = [];
    let currentWeek: CalendarCell[] = [];

    // Ditet e zbrazeta te javes se pare (para 1 te muajit)
    for (let i = 0; i < startWeekday; i++) {
      currentWeek.push({ date: '', day: 0, inMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push({
        date: dateStr,
        day,
        inMonth: true,
        info: dayInfoMap[dateStr]
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    // Pjesa e mbetur e javes se fundit
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ date: '', day: 0, inMonth: false });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    this.calendarCells = weeks;
  }

  prevMonth(): void {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedDate = null;
    this.loadMonth();
  }

  nextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDate = null;
    this.loadMonth();
  }

  cellCssClass(cell: CalendarCell): string {
    if (!cell.inMonth) return 'cal-empty';
    const classes = ['cal-day'];
    if (this.selectedDate === cell.date) classes.push('selected');
    if (!cell.info) {
      classes.push('no-data');
    } else {
      const src = cell.info.dominant_source;
      if (src === 'alpex_api') classes.push('source-alpex');
      else if (src === 'fallback_avg7') classes.push('source-fallback');
      else if (src === 'manual_upload' || src === 'manual_correction') classes.push('source-manual');
    }
    return classes.join(' ');
  }

  // ─────────────────────────────────────────────
  // Detajet e dites
  // ─────────────────────────────────────────────
  selectDay(cell: CalendarCell): void {
    if (!cell.inMonth) return;
    this.selectedDate = cell.date;
    this.loadDayPrices();
    this.loadCorrections();
    this.showManualForm = false;
  }

  loadDayPrices(): void {
    if (!this.selectedDate) return;
    this.dayLoading = true;
    this.bursaService.getByDate(this.selectedDate).subscribe({
      next: (r) => {
        this.dayPrices = r.prices || [];
        this.dayLoading = false;
        // 🆕 Perditeso kursin aktual me ate te dites se zgjedhur (nese ka).
        // Kjo ndihmon qe totalet e Bursa Fees te reflektojne kursin qe do te aplikohej
        // per sesionet e asaj dite.
        const firstWithRate = this.dayPrices.find(p => Number(p.exchange_rate_eur_all) > 0);
        if (firstWithRate) {
          this.currentExchangeRate = Number(firstWithRate.exchange_rate_eur_all);
        }
      },
      error: (e) => {
        logger.error('Day load failed:', e);
        this.dayLoading = false;
      }
    });
  }

  sourceBadgeClass(source: BursaSource): string {
    switch (source) {
      case 'alpex_api': return 'badge-success';
      case 'fallback_avg7': return 'badge-warning';
      case 'manual_upload':
      case 'manual_correction': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  sourceLabel(source: BursaSource | string): string {
    switch (source) {
      case 'alpex_api': return 'ALPEX';
      case 'fallback_avg7': return 'Fallback (7-day)';
      case 'manual_upload': return 'Manual';
      case 'manual_correction': return 'Manual correction';
      default: return source || '—';
    }
  }

  // ─────────────────────────────────────────────
  // Refetch nga ALPEX
  // ─────────────────────────────────────────────
  refetchFromAlpex(): void {
    if (!this.selectedDate || !this.canRefetch) return;
    Swal.fire({
      title: 'Checking for differences...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.bursaService.refetchPreview(this.selectedDate).subscribe({
      next: (preview) => {
        Swal.close();
        if (preview.changes_count === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No changes',
            text: 'Current DB prices match ALPEX. No refetch needed.'
          });
          return;
        }
        const changesTable = preview.changes.slice(0, 10).map(c =>
          `<tr><td>${c.hour}:00</td>` +
          `<td>${c.old_price_eur_mwh ?? '—'}</td>` +
          `<td>${c.new_price_eur_mwh}</td>` +
          `<td>${(c.new_buy_price_all_kwh - (c.old_buy_price_all_kwh ?? 0)).toFixed(2)}</td></tr>`
        ).join('');
        const html = `
          <p><strong>${preview.changes_count}</strong> hours will be updated<br />
          <strong>${preview.affected_sessions}</strong> bursa sessions will be recalculated</p>
          <table class="table table-sm" style="font-size: 12px">
            <thead><tr><th>Hour</th><th>EUR/MWh old</th><th>EUR/MWh new</th><th>ALL/kWh diff</th></tr></thead>
            <tbody>${changesTable}</tbody>
          </table>
          ${preview.changes.length > 10 ? `<small>...and ${preview.changes.length - 10} more</small>` : ''}
        `;
        Swal.fire({
          title: `Refetch for ${this.selectedDate}?`,
          html,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, continue',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#e6575b',   // korali i logos, si .btn-success
          width: 700
        }).then((r) => {
          if (r.isConfirmed) this.doRefetch();
        });
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Preview failed', text: err?.error?.message || 'Error' });
      }
    });
  }

  private doRefetch(): void {
    if (!this.selectedDate) return;
    Swal.fire({ title: 'Refetching...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.bursaService.refetch(this.selectedDate, true).subscribe({
      next: (r) => {
        Swal.fire({
          icon: 'success',
          title: 'Refetch successful',
          html: `${r.inserted + r.updated} rows saved<br />` +
            (r.recompute ? `${r.recompute.sessions_updated} sessions recalculated<br />
              Total difference: ${r.recompute.total_cost_diff.toFixed(2)} ALL` : '')
        });
        this.loadMonth();
        this.loadDayPrices();
        this.loadCorrections();
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Refetch failed', text: err?.error?.message || 'Error' });
      }
    });
  }

  // ─────────────────────────────────────────────
  // Manual entry
  // ─────────────────────────────────────────────
  openManualForm(): void {
    if (!this.canManualEntry) return;
    // Prefill nga vlerat aktuale (nese kane)
    if (this.dayPrices.length > 0) {
      const byHour: Record<number, number> = {};
      for (const p of this.dayPrices) byHour[p.hour] = parseFloat(p.price_eur_mwh as any);
      this.manualPrices = Array.from({ length: 24 }, (_, h) => byHour[h] || 0);
    } else {
      this.manualPrices = Array(24).fill(0);
    }
    this.manualBulkPaste = '';
    this.showManualForm = true;
  }

  closeManualForm(): void {
    this.showManualForm = false;
  }

  /** Bulk-paste: user pastes 24 values from Excel (one per line), automatically split. */
  parseBulkPaste(): void {
    if (!this.manualBulkPaste) return;
    const lines = this.manualBulkPaste.split(/[\r\n\t;,]+/).map(s => s.trim()).filter(Boolean);
    if (lines.length !== 24) {
      Swal.fire({
        icon: 'warning',
        title: 'Wrong count',
        text: `24 values needed, found ${lines.length}. Check format (one value per line).`
      });
      return;
    }
    const parsed = lines.map(v => parseFloat(v.replace(',', '.')));
    if (parsed.some(v => !Number.isFinite(v))) {
      Swal.fire({ icon: 'warning', title: 'Invalid value', text: 'One or more values are not numbers.' });
      return;
    }
    this.manualPrices = parsed;
  }

  submitManualPrices(): void {
    if (!this.selectedDate) return;
    const prices = this.manualPrices.map((price, hour) => ({ hour, price_eur_mwh: price }));
    const invalid = prices.find(p => !Number.isFinite(p.price_eur_mwh) || p.price_eur_mwh < 0);
    if (invalid) {
      Swal.fire({ icon: 'warning', title: 'Invalid value', text: `Hour ${invalid.hour}: price must be a number >= 0` });
      return;
    }
    Swal.fire({
      title: `Save ${prices.length} prices for ${this.selectedDate}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save',
      cancelButtonText: 'Cancel'
    }).then((r) => {
      if (!r.isConfirmed) return;
      Swal.fire({ title: 'Saving...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      this.bursaService.manualUpload(this.selectedDate!, prices, true).subscribe({
        next: (resp) => {
          Swal.fire({
            icon: 'success',
            title: 'Saved',
            html: `${resp.inserted + resp.updated} rows<br />` +
              (resp.recompute ? `${resp.recompute.sessions_updated} sessions recalculated` : '')
          });
          this.showManualForm = false;
          this.loadMonth();
          this.loadDayPrices();
          this.loadCorrections();
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Save failed', text: err?.error?.message || 'Error' });
        }
      });
    });
  }

  // ─────────────────────────────────────────────
  // Corrections history
  // ─────────────────────────────────────────────
  loadCorrections(): void {
    if (!this.selectedDate) return;
    this.correctionsLoading = true;
    this.bursaService.getCorrections({ date: this.selectedDate }).subscribe({
      next: (r) => {
        this.corrections = r.corrections || [];
        this.correctionsLoading = false;
      },
      error: () => {
        this.corrections = [];
        this.correctionsLoading = false;
      }
    });
  }
}
