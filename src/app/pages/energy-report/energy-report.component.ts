import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChargingHistoryService } from '../../services/chargingHistoryService/charging-history.service';
import { ChargerService } from '../../services/chargerService/charger.service';

interface BreakdownRow {
  date: string;
  total_energy: number;
  session_count?: number;
}

interface ChargerRow {
  charger_id: number;
  charger_name: string;
  total_energy: number;
  session_count: number;
}

@Component({
  selector: 'app-energy-report',
  templateUrl: './energy-report.component.html'
})
export class EnergyReportComponent implements OnInit {

  // Rolet
  userRole: string = '';
  isRadXAdmin: boolean = false;
  isRadXModerator: boolean = false;
  isCompanyAdmin: boolean = false;
  isCompanyAnalyst: boolean = false;

  // Mode + filter
  mode: 'year' | 'month' | 'daily' | 'day' = 'daily';
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  date: string = new Date().toISOString().split('T')[0];
  selectedChargerId: number | null = null;

  yearOptions: number[] = [];
  monthOptions = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];
  chargers: any[] = [];

  // Rezultatet
  loading = false;
  total: number = 0;
  totalSessions: number = 0;
  breakdown: BreakdownRow[] = [];
  byCharger: ChargerRow[] = [];
  chart: any = null;

  constructor(
    private chargingHistoryService: ChargingHistoryService,
    private chargerService: ChargerService,
  ) {}

  ngOnInit(): void {
    this.userRole = (localStorage.getItem('userRole') || '').trim();
    this.isRadXAdmin = this.userRole === 'RadX_Admin';
    this.isRadXModerator = this.userRole === 'RADX_MODERATOR';
    this.isCompanyAdmin = this.userRole === 'COMPANY_ADMIN';
    this.isCompanyAnalyst = this.userRole === 'COMPANY_ANALYST';

    const nowY = new Date().getFullYear();
    for (let y = nowY; y >= nowY - 5; y--) this.yearOptions.push(y);

    this.loadChargers();
    this.loadReport();
  }

  loadChargers(): void {
    this.chargerService.getAllChargers().subscribe(
      (data: any) => {
        this.chargers = data?.chargers || [];
      },
      (err: any) => {
        logger.warn('getAllChargers failed, trying by company');
        this.chargers = [];
      }
    );
  }

  onModeChange(newMode: 'year' | 'month' | 'daily' | 'day'): void {
    this.mode = newMode;
    this.loadReport();
  }

  onFilterChange(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    const params: any = { charger_id: this.selectedChargerId || null };
    if (this.mode === 'day') {
      params.date = this.date;
    } else if (this.mode === 'year') {
      params.year = this.year;
    } else {
      // 'month' dhe 'daily' — te dyja perdorin year+month
      params.year = this.year;
      params.month = this.month;
    }
    this.chargingHistoryService.getGlobalEnergySummary(params).subscribe(
      (data: any) => {
        if (data && data.success !== false) {
          this.total = Number(data.total) || 0;
          this.totalSessions = Number(data.totalSessions) || 0;
          this.breakdown = (data.breakdown || []).map((r: any) => ({
            date: typeof r.date === 'string' ? r.date : new Date(r.date).toISOString().split('T')[0],
            total_energy: Number(r.total_energy) || 0,
            session_count: Number(r.session_count) || 0,
          }));
          this.byCharger = (data.byCharger || []).map((r: any) => ({
            charger_id: r.charger_id,
            charger_name: r.charger_name || `Charger #${r.charger_id}`,
            total_energy: Number(r.total_energy) || 0,
            session_count: Number(r.session_count) || 0,
          }));
          if (this.mode !== 'day') {
            setTimeout(() => this.renderChart(), 100);
          }
        } else {
          this.reset();
        }
        this.loading = false;
      },
      (err: any) => {
        logger.error('Energy report load failed:', err);
        this.reset();
        this.loading = false;
      }
    );
  }

  private reset(): void {
    this.total = 0;
    this.totalSessions = 0;
    this.breakdown = [];
    this.byCharger = [];
  }

  formatEnergy(kwh: number): { value: string; unit: string } {
    const v = Number(kwh) || 0;
    if (v >= 1_000_000) return { value: (v / 1_000_000).toFixed(2), unit: 'GWh' };
    if (v >= 1_000) return { value: (v / 1_000).toFixed(2), unit: 'MWh' };
    return { value: v.toFixed(2), unit: 'kWh' };
  }

  formatBucketLabel(dateStr: string): string {
    if (this.mode === 'year') {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString('en-US', { month: 'long' });
    }
    return dateStr;
  }

  private formatBucketLabelShort(dateStr: string): string {
    if (this.mode === 'year') {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString('en-US', { month: 'short' });
    }
    return dateStr;
  }

  private renderChart(): void {
    const canvas: any = document.getElementById('energyReportChart');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (this.chart) this.chart.destroy();
    const labels = this.breakdown.map(r => this.formatBucketLabelShort(r.date));
    const data = this.breakdown.map(r => r.total_energy);
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'kWh',
          data,
          backgroundColor: 'rgba(147, 22, 35, 0.6)',
          borderColor: '#6b1019',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { title: { display: true, text: this.mode === 'year' ? 'Month' : 'Date' } },
          y: { beginAtZero: true, title: { display: true, text: 'kWh' } },
        },
      },
    } as any);
  }

  exportExcel(): void {
    // CSV multi-section: Summary + Breakdown + Top Chargers.
    // BOM (﻿) siguron Excel te hape UTF-8 saktesisht (per diakritike).
    const lines: string[] = [];

    // ── Section 1: Kokezimet + Summary ──
    lines.push('ENERGY REPORT');
    lines.push('Gjeneruar,' + new Date().toISOString().replace('T', ' ').slice(0, 19));
    lines.push('Mode,' + this.mode);
    if (this.mode === 'day') {
      lines.push('Data,' + this.date);
    } else if (this.mode === 'year') {
      lines.push('Viti,' + this.year);
    } else {
      lines.push('Viti,' + this.year);
      lines.push('Muaji,' + this.month);
    }
    const chargerLabel = this.selectedChargerId
      ? (this.chargers.find(c => c.charger_id === this.selectedChargerId)?.charger_name || `Charger #${this.selectedChargerId}`)
      : 'Te gjithe chargers';
    lines.push('Filter Charger,' + this.escapeCsv(chargerLabel));
    lines.push('');

    // ── Section 2: TOTALS ──
    lines.push('TOTALS');
    lines.push('Total Energy (kWh),' + this.total.toFixed(2));
    lines.push('Total Energy (MWh),' + (this.total / 1000).toFixed(4));
    lines.push('Total Sessions,' + this.totalSessions);
    lines.push('Mesatare per sesion (kWh),' + (this.totalSessions > 0 ? (this.total / this.totalSessions).toFixed(2) : '0'));
    lines.push('');

    // ── Section 3: BREAKDOWN ──
    lines.push('BREAKDOWN');
    lines.push([
      this.mode === 'year' ? 'Muaji' : 'Data',
      'Energji (kWh)',
      'Sesione',
      'Mesatare (kWh/sesion)'
    ].join(','));
    for (const r of this.breakdown) {
      const avg = r.session_count && r.session_count > 0 ? (r.total_energy / r.session_count).toFixed(2) : '';
      lines.push([
        this.escapeCsv(this.formatBucketLabel(r.date)),
        r.total_energy.toFixed(2),
        r.session_count || 0,
        avg
      ].join(','));
    }
    lines.push('');

    // ── Section 4: TOP CHARGERS (vetem kur s'ka filter charger) ──
    if (!this.selectedChargerId && this.byCharger.length > 0) {
      lines.push('TOP CHARGERS — SIPAS ENERGJISE');
      lines.push('#,Charger,Energji (kWh),Sesione,% e totalit');
      this.byCharger.forEach((c, i) => {
        const pct = this.total > 0 ? ((c.total_energy / this.total) * 100).toFixed(1) : '0';
        lines.push([
          i + 1,
          this.escapeCsv(c.charger_name),
          c.total_energy.toFixed(2),
          c.session_count,
          pct + '%'
        ].join(','));
      });
    }

    const csv = '﻿' + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy-report-${this.mode}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private escapeCsv(value: any): string {
    const s = String(value == null ? '' : value);
    // Nese ka koma, thonjeza ose newline → wrap ne thonjeza + escape thonjezat brenda
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  // 🆕 Export ne PDF me chart si imazh + tabela.
  exportPdf(): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // ── Header ──
    doc.setFontSize(18);
    doc.setTextColor(46, 125, 50); // jeshile e errët Vega
    doc.setFont('helvetica', 'bold');
    doc.text('Energy Report', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gjeneruar: ${new Date().toLocaleString('en-GB')}`, 14, y);
    y += 5;

    // Info mode + filtri
    let filterLabel: string;
    if (this.mode === 'day') filterLabel = `Single day: ${this.date}`;
    else if (this.mode === 'year') filterLabel = `Yearly total: ${this.year}`;
    else filterLabel = `${this.mode === 'month' ? 'Monthly total' : 'Daily breakdown'}: ${this.year}/${String(this.month).padStart(2, '0')}`;
    doc.text(filterLabel, 14, y);
    y += 5;

    const chargerLabel = this.selectedChargerId
      ? (this.chargers.find(c => c.charger_id === this.selectedChargerId)?.charger_name || `Charger #${this.selectedChargerId}`)
      : 'Te gjithe chargers';
    doc.text(`Charger: ${chargerLabel}`, 14, y);
    y += 8;

    // ── Totals box ──
    doc.setFillColor(232, 245, 233); // jeshile e lehtë background
    doc.setDrawColor(46, 125, 50);
    doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');
    doc.setTextColor(46, 125, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTALS', 18, y + 6);
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Energy: ${this.total.toFixed(2)} kWh (${(this.total / 1000).toFixed(3)} MWh)`, 18, y + 12);
    doc.text(`Total Sessions: ${this.totalSessions.toLocaleString()}   |   Mesatare: ${this.totalSessions > 0 ? (this.total / this.totalSessions).toFixed(2) : '0'} kWh/sesion`, 18, y + 18);
    y += 28;

    // ── Chart image (vetem per year/monthly/daily, jo per single day) ──
    if (this.mode !== 'day') {
      const canvas: any = document.getElementById('energyReportChart');
      if (canvas && canvas.toDataURL) {
        try {
          const imgData = canvas.toDataURL('image/png', 1.0);
          const imgW = pageWidth - 28;
          const imgH = 70; // aspect ratio fixed per chart bar
          if (y + imgH > 280) { doc.addPage(); y = 15; }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(60);
          doc.text(this.mode === 'year' ? 'Konsumi mujor' : 'Konsumi ditor', 14, y);
          y += 4;
          doc.addImage(imgData, 'PNG', 14, y, imgW, imgH);
          y += imgH + 8;
        } catch (err) {
          logger.warn('Chart to image failed:', err);
        }
      }
    }

    // ── Breakdown table ──
    if (this.breakdown.length > 0) {
      if (y + 20 > 280) { doc.addPage(); y = 15; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(60);
      doc.text('Breakdown', 14, y);
      y += 2;

      const breakdownRows = this.breakdown.map(r => {
        const avg = r.session_count && r.session_count > 0 ? (r.total_energy / r.session_count).toFixed(2) : '—';
        return [
          this.formatBucketLabel(r.date),
          r.total_energy.toFixed(2),
          String(r.session_count || 0),
          avg
        ];
      });
      // Total row
      breakdownRows.push([
        'TOTAL',
        this.total.toFixed(2),
        String(this.totalSessions),
        this.totalSessions > 0 ? (this.total / this.totalSessions).toFixed(2) : '—'
      ]);

      autoTable(doc, {
        startY: y + 2,
        head: [[this.mode === 'year' ? 'Muaji' : 'Data', 'Energji (kWh)', 'Sesione', 'Mesatare (kWh/sesion)']],
        body: breakdownRows,
        headStyles: { fillColor: [127, 188, 66], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        },
        // Bold rreshtin TOTAL (i fundit)
        didParseCell: (data) => {
          if (data.row.index === breakdownRows.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [220, 237, 200] as any;
          }
        }
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // ── Top Chargers table (vetem kur s'ka filter charger) ──
    if (!this.selectedChargerId && this.byCharger.length > 0) {
      if (y + 30 > 280) { doc.addPage(); y = 15; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(60);
      doc.text('Top Chargers — sipas energjise se ofruar', 14, y);
      y += 2;

      const chargerRows = this.byCharger.map((c, i) => {
        const pct = this.total > 0 ? ((c.total_energy / this.total) * 100).toFixed(1) : '0';
        return [
          String(i + 1),
          c.charger_name,
          c.total_energy.toFixed(2),
          String(c.session_count),
          pct + '%'
        ];
      });

      autoTable(doc, {
        startY: y + 2,
        head: [['#', 'Charger', 'Energji (kWh)', 'Sesione', '% e totalit']],
        body: chargerRows,
        headStyles: { fillColor: [127, 188, 66], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'right' }
        }
      });
    }

    // ── Footer me numer faqesh ──
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Faqja ${i} / ${totalPages}`, pageWidth - 30, 290);
      doc.text('Flex Charge — Energy Report', 14, 290);
    }

    doc.save(`energy-report-${this.mode}-${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
