import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerService } from "../../../services/chargerService/charger.service";
import { ChargingHistoryService } from "../../../services/chargingHistoryService/charging-history.service";
import { ConnectorService } from "../../../services/connectorService/connector.service";
import { ReservationService } from "../../../services/reservationService/reservation.service";
import { LogService } from "../../../services/logService/log.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CardService } from 'src/app/services/cardService/card.service';
import { UserService } from 'src/app/services/userService/user.service';
import { RateService } from 'src/app/services/rateService/rate.service';
// 🆕 Per te marre çmimet oraret te rate-it te blerjes (energy_tariff_rate_id).
import { RatePerDaysService } from 'src/app/services/ratePerDaysService/rate-per-days.service';
import { BursaPriceService, BursaHourlyPrice } from 'src/app/services/bursaPriceService/bursa-price.service';
import { LocalListService } from 'src/app/services/localList/local-list.service';
import { ConfirmationDialogComponent } from '../../dashboards/components/confirmation-dialog/confirmation-dialog.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import Chart from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-charger-details',
  templateUrl: './charger-details.component.html',
  styles: [
  ]
})
export class ChargerDetailsComponent {
  errorMessage: any;
  id: string;
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;

  chargers: any[] = [];
  chargingHistory: any[] = [];
  connectors: any[] = [];
  reservations: any[] = [];
  logs: any[] = [];
  localLists: any[] = [];
  tempChargers = [];
  tempChargingHistory = [];
  tempConnectors = [];
  tempReservations = [];
  tempLogs = [];
  tempLocalLists = [];
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  userRole: string | null = null;
  isRadXAdmin: boolean = false;
  isRadXModerator: boolean = false;
  isSuperUser: boolean = false;
  isCompanyAdmin: boolean = false;
  isCompanyModerator: boolean = false;
  isCompanyOperator: boolean = false;
  isCompanyTechnicalOperator: boolean = false;
  isCompanyMaintenanceSpecialist: boolean = false;
  isCompanyCallCenter: boolean = false;
  isCompanyAnalyst: boolean = false;
  isUserGroupAdmin: boolean = false;
  isUserGroupModerator: boolean = false;
  isUserGroupUser: boolean = false;
  isPartnerAdmin: boolean = false;
  isPartnerModerator: boolean = false;
  isUser: boolean = false;
  rateName: any;
  // 🆕 Emri i rate-it te blerjes se energjise (charger.energy_tariff_rate_id)
  energyTariffRateName: any;
  ratePrice: any;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.isSmallScreen = event.target.innerWidth < 768;
  //   // Hide input when switching to small screen
  //   if (this.isSmallScreen) {
  //     this.isInputVisible = false;
  //   }
  // }
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  toggleSearchInput() {
    this.isInputVisible = !this.isInputVisible; // Toggle input visibility on icon click
  }
  // Diagnostics tab state
  diagnosticsFiles: any[] = [];
  diagnosticsLoading: boolean = false;
  diagnosticsError: string | null = null;
  diagnosticsSending: boolean = false;
  diagnosticsLastStatus: string | null = null;

  // 🆕 Energy Report tab state (vetem COMPANY_ADMIN)
  energyMode: 'year' | 'month' | 'daily' | 'day' = 'year';
  energyYear: number = new Date().getFullYear();
  energyMonth: number = new Date().getMonth() + 1;
  energyDate: string = new Date().toISOString().split('T')[0];
  energyTotal: number = 0;
  energyBreakdown: { date: string; total_energy: number }[] = [];
  energyLoading: boolean = false;
  energyLoaded: boolean = false;
  private energyChart: any = null;
  readonly energyYearOptions: number[] = (() => {
    const cur = new Date().getFullYear();
    const arr: number[] = [];
    for (let y = 2025; y <= cur + 1; y++) arr.push(y);
    return arr;
  })();
  readonly energyMonthOptions = [
    { num: 1, name: 'January' }, { num: 2, name: 'February' }, { num: 3, name: 'March' },
    { num: 4, name: 'April' }, { num: 5, name: 'May' }, { num: 6, name: 'June' },
    { num: 7, name: 'July' }, { num: 8, name: 'August' }, { num: 9, name: 'September' },
    { num: 10, name: 'October' }, { num: 11, name: 'November' }, { num: 12, name: 'December' },
  ];

  // 🆕 STATE per modalin "Change Buy Energy Price" — vetem COMPANY_ADMIN + COMPANY_ANALYST.
  showRebillModal: boolean = false;               // hape/mbylle modalin
  showRebillConfirm: boolean = false;             // dialog konfirmimi para submit-it
  rebillMode: 'rate' | 'custom' | 'bursa' = 'rate';   // dropdown ekzistues vs custom 24 çmime vs bursa
  rebillStartDatetime: string = '';               // input datetime-local (YYYY-MM-DDTHH:mm)
  rebillEndDatetime: string = '';                 // input datetime-local (bosh kur endIsNow)
  rebillEndIsNow: boolean = true;                 // toggle "Now"
  rebillSelectedRateId: number | null = null;     // rate ekzistuese e zgjedhur
  rebillCustomHourly: number[] = new Array(24).fill(0);  // 24 çmime custom
  rebillAvailableRates: any[] = [];               // lista e rate-ve te kompanise per dropdown
  rebillLoading: boolean = false;                 // gjatë POST-it
  rebillMessage: string = '';                     // toast success/error
  rebillMessageClass: string = '';                // 'alert-success' | 'alert-danger'
  rebillLastResult: any = null;                   // rezultati i fundit per shfaqje

  // 🆕 Cmimi i blerjes se energjise per çdo orë (0..23) i rate-it te lidhur me chargerin.
  // Popullohet nga getEnergyTariffHourlyPrices(). VETEM per admin/analyst ne UI.
  energyTariffHourlyPrices: number[] = [];        // 24 vlera
  energyTariffHourlyPricesLoaded: boolean = false;

  // 🆕 Bursa (kur charger.uses_bursa_price = true): 24 rreshtat per diten e sotme.
  bursaTodayPrices: BursaHourlyPrice[] = [];
  bursaTodayLoaded: boolean = false;
  bursaTodayDate: string = new Date().toISOString().split('T')[0];

  /** Helper i sigurt: kthene TRUE kur charger perdor bursen.
   *  Trajton te tri format qe mund te vine nga MySQL/JSON: true, 1, "1". */
  get isBursaCharger(): boolean {
    const v = this.chargers?.[0]?.uses_bursa_price;
    return v === true || v === 1 || v === '1' || v === 'true';
  }

  constructor(
    private chargerService: ChargerService,
    private chargingHistoryService: ChargingHistoryService,
    private connectorService: ConnectorService,
    private rateService: RateService,
    // 🆕 Per çmimet oraret te rate-it te blerjes se energjise.
    private ratePerDaysService: RatePerDaysService,
    // 🆕 Per çmimet oraret te bursa (kur charger.uses_bursa_price = true).
    private bursaPriceService: BursaPriceService,
    private reservationService: ReservationService,
    private logService: LogService,
    private cardService: CardService,
    private userService: UserService,
    private localListService: LocalListService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getChargers();
            this.getChargingHistory();
            this.getConnectors();
            this.getReservations();
            this.getChargerLocalListByCharger();
            // this.getLogsByCharger();
            this.getLogsByCharger('UTC');
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getChargers();
            this.getChargingHistory();
            this.getConnectors();
            this.getReservations();
            this.getChargerLocalListByCharger();
            // this.getLogsByCharger();
            this.getLogsByCharger('UTC');
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getChargers();
            this.getChargingHistory();
            this.getConnectors();
            this.getReservations();
            this.getChargerLocalListByCharger();
            this.getLogsByCharger('UTC');
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

            this.isCompanyRole = true;
            this.getChargers();
            this.getChargingHistory();
            this.getConnectors();
            this.getReservations();
            this.getChargerLocalListByCharger();
            // this.getLogsByCharger();
            this.getLogsByCharger('UTC');
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            //this.isCompanyRole = true;
            this.getChargers();
            this.getChargingHistory();
            this.getConnectors();
            this.getReservations();
            this.getChargerLocalListByCharger();
            // this.getLogsByCharger();
            this.getLogsByCharger('UTC');
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getChargers();
            this.getChargingHistory();
            this.getConnectors();
            this.getReservations();
            this.getChargerLocalListByCharger();
            // this.getLogsByCharger();
            this.getLogsByCharger('UTC');
            break;
          default:
            console.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        console.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    // this.getChargers();
    // this.getChargingHistory();
    // this.getConnectors();
    // this.getReservations();
    // this.getLogsByCharger();
    // this.getLocation();

  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }


  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
    if (event.type === 'click') {
      // this.router.navigate([`/users/usergroup/${this.activeRow.usergr_id}`]);
    }
  }

  onChargingHistoryActivate(event) {
    this.activeRow = event.row;
    if (event.type === 'click' && this.activeRow?.charging_history_id) {
      this.router.navigate([`/assets/charinghistory/${this.activeRow.charging_history_id}`]);
    }
  }

  // -------- Diagnostics tab --------

  private get currentOcppId(): string | null {
    return this.chargers && this.chargers[0] ? this.chargers[0].ocpp_id : null;
  }

  loadDiagnosticsFiles(): void {
    const ocppId = this.currentOcppId;
    if (!ocppId) return;
    this.diagnosticsLoading = true;
    this.diagnosticsError = null;
    this.chargerService.listDiagnosticsFiles(ocppId).subscribe(
      (res: any) => {
        this.diagnosticsFiles = (res && res.files) ? res.files : [];
        this.diagnosticsLoading = false;
      },
      (err) => {
        this.diagnosticsLoading = false;
        this.diagnosticsError = err?.error?.error || err?.message || 'Failed to load diagnostics';
      }
    );
  }

  onDiagnosticsTabSelect(): void {
    // Refresh list whenever user opens the tab
    this.loadDiagnosticsFiles();
  }

  sendGetDiagnosticsFromTab(): void {
    const ocppId = this.currentOcppId;
    if (!ocppId) return;
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Get Diagnostics',
        message: 'Plotëso payload-in për GetDiagnostics:'
      }
    });
    modalRef.content.onClose.subscribe((result: { confirmed: boolean; payload?: any }) => {
      if (!result.confirmed || !result.payload) return;
      this.diagnosticsSending = true;
      this.diagnosticsLastStatus = 'Sending…';
      this.chargerService.getDiagnostics(ocppId, result.payload).subscribe(
        () => {
          this.diagnosticsLastStatus = 'Komanda u dërgua. Po pres charger-in…';
          this.pollDiagnosticsForTab(ocppId);
        },
        (err) => {
          this.diagnosticsSending = false;
          this.diagnosticsLastStatus = null;
          swal.fire({
            title: 'Gabim',
            text: err?.error?.error || err?.message || 'S\'u dërgua dot komanda.',
            icon: 'error'
          });
        }
      );
    });
  }

  private pollDiagnosticsForTab(ocppId: string): void {
    let attempts = 0;
    const maxAttempts = 40;
    const intervalMs = 5000;
    let lastStatus: string | null = null;
    let lastFile: string | null = null;
    const tick = () => {
      attempts++;
      this.chargerService.getDiagnosticsStatus(ocppId).subscribe(
        (res: any) => {
          const status = res?.latestStatus || null;
          const fileName = res?.latestFileName || null;
          if (status && status !== lastStatus) {
            lastStatus = status;
            this.diagnosticsLastStatus = `Status: ${status}` + (fileName ? ` (${fileName})` : '');
          }
          if (fileName && fileName !== lastFile) lastFile = fileName;
          const done = status === 'Uploaded' || status === 'UploadFailed';
          if (done) {
            this.diagnosticsSending = false;
            this.diagnosticsLastStatus =
              status === 'Uploaded'
                ? `✅ Diagnostika u ngarkuan (${lastFile || 'file i ri'})`
                : `❌ Ngarkimi dështoi`;
            this.loadDiagnosticsFiles();
            return;
          }
          if (attempts < maxAttempts) {
            setTimeout(tick, intervalMs);
          } else {
            this.diagnosticsSending = false;
            this.diagnosticsLastStatus = 'Timeout — kontrollo manualisht më vonë.';
          }
        },
        () => {
          if (attempts < maxAttempts) setTimeout(tick, intervalMs);
          else this.diagnosticsSending = false;
        }
      );
    };
    setTimeout(tick, intervalMs);
  }

  downloadDiagnostic(fileName: string): void {
    if (!fileName) return;
    this.chargerService.downloadDiagnosticsFile(fileName).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (err) => {
        swal.fire({
          title: 'Gabim te shkarkimi',
          text: err?.message || `Nuk u shkarkua dot ${fileName}`,
          icon: 'error'
        });
      }
    );
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  formatFileDate(d: string | Date | undefined): string {
    if (!d) return '';
    try { return new Date(d).toLocaleString(); } catch (_) { return String(d); }
  }

  getChargers() {
    this.chargerService.getCharger(this.id).subscribe(
      (data) => {
        // console.log(data);
        this.chargers = [data.charger]; // Storing the charger in an array
        this.tempChargers = [...this.chargers];

        // Extract rate_id from the first charger object
        if (this.chargers.length > 0) {
          const rateId = this.chargers[0].rate_id;
          this.getRateById(rateId);

          // 🆕 Rrjedha e re: nese charger perdor bursen (uses_bursa_price=true),
          // ngarko cmimet e sotme te bursa. Ndryshe, ngarko rate-in fikse.
          // Perdor isBursaCharger qe trajton te tri format nga MySQL: true, 1, "1".
          if (this.isBursaCharger) {
            this.loadBursaTodayPrices();
            // Sigurohu qe tabela e vjeter e rate fikse te fshihet plotesisht.
            this.energyTariffHourlyPricesLoaded = false;
            this.energyTariffHourlyPrices = [];
            this.energyTariffRateName = null;
          } else {
            const tariffRateId = this.chargers[0].energy_tariff_rate_id;
            if (tariffRateId != null) {
              this.getEnergyTariffRateById(tariffRateId);
            } else {
              this.energyTariffRateName = null;
            }
          }
        }
      },
      (error) => {
        // Backend rejects access to chargers the user doesn't own (incl.
        // roaming-partner chargers). Bounce out of the management view.
        if (error && (error.status === 403 || error.status === 404)) {
          this.router.navigate(['/maps/google']);
          return;
        }
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  // 🆕 Ngarko cmimet e bursa per diten e sotme (24 rreshta nga bursa_hourly_price).
  // Shfaqet vetem kur charger.uses_bursa_price = true.
  loadBursaTodayPrices(): void {
    this.bursaTodayDate = new Date().toISOString().split('T')[0];
    this.bursaPriceService.getByDate(this.bursaTodayDate).subscribe(
      (r) => {
        this.bursaTodayPrices = r.prices || [];
        this.bursaTodayLoaded = true;
      },
      (err) => {
        console.error('Bursa today prices load failed:', err);
        this.bursaTodayPrices = [];
        this.bursaTodayLoaded = true;
      }
    );
  }

  async getRateById(id: number) {
    try {
      // console.log('Fetching rate details for ID:', id);

      // Await the API response
      const response = await this.rateService.getRate(id).toPromise();

      if (response && response.rate) {
        this.rateName = response.rate.rate_name; // Set the rate name
        // console.log('Rate Name:', this.rateName);
      } else {
        console.warn('Rate not found in response:', response);
      }
    } catch (error) {
      console.error('Error fetching rate:', error);
    }
  }

  // 🆕 Kthen emrin e rate-it te blerjes se energjise per t'u shfaqur ne Charger Details.
  // Gjithashtu popullon `energyTariffHourlyPrices` (24 çmime) qe admin/analyst
  // ta shohin info-n e çmimit te blerjes per çdo ore.
  async getEnergyTariffRateById(id: number) {
    try {
      const response = await this.rateService.getRate(id).toPromise();
      if (response && response.rate) {
        this.energyTariffRateName = response.rate.rate_name;
      } else {
        this.energyTariffRateName = null;
      }
      // Merr rate_per_days per kete rate; popullon harten oraret.
      // ⚠️ Backend service e kthen si `ratePerDay` (njesh); mbulojme edhe aliaset e mundshme
      // dhe rastin kur response eshte direkt nje array.
      this.ratePerDaysService.getRatePerDayByRate(id).subscribe(
        (data: any) => {
          const rpds = Array.isArray(data)
            ? data
            : (data?.ratePerDay || data?.ratePerDays || data?.rate_per_days || data?.ratesPerDay || []);
          this.energyTariffHourlyPrices = this.buildHourPricesFromRatePerDays(rpds);
          this.energyTariffHourlyPricesLoaded = true;
        },
        (err: any) => {
          console.error('Error loading rate_per_days for energy tariff:', err);
          this.energyTariffHourlyPrices = new Array(24).fill(0);
          this.energyTariffHourlyPricesLoaded = false;
        }
      );
    } catch (error) {
      console.error('Error fetching energy tariff rate:', error);
      this.energyTariffRateName = null;
      this.energyTariffHourlyPrices = [];
    }
  }

  // 🆕 Ndertim harta 24-oreshe nga array-i rate_per_days [{ from_time, to_time, price }].
  // Perdoret per shfaqjen ne Charger Details (info per admin/analyst).
  // MySQL TIME mund te kthehet ne formate te ndryshme (HH:mm:ss, HH:mm, ose Date-ish string).
  // Perdorim helper qe e normalizon ne minuta te dites (0..1439) per krahasim te sigurt.
  private buildHourPricesFromRatePerDays(rpds: any[]): number[] {
    const map = new Array(24).fill(0);
    if (!Array.isArray(rpds) || rpds.length === 0) return map;
    for (let h = 0; h < 24; h++) {
      const hourMin = h * 60; // p.sh. ora 16 = 16*60 = 960 min
      const match = rpds.find((r: any) => {
        const fromMin = this.timeStrToMinutes(r.from_time);
        const toMin = this.timeStrToMinutes(r.to_time);
        if (fromMin == null || toMin == null) return false;
        // from inkluziv, to ekskluziv. Trajtim special: nese to <= from (p.sh. 22:00 → 06:00 wrap),
        // konsiderojme si "kalim mesnate": ora bie brenda nese hourMin >= from OSE hourMin < to.
        if (toMin <= fromMin) {
          return hourMin >= fromMin || hourMin < toMin;
        }
        return hourMin >= fromMin && hourMin < toMin;
      });
      map[h] = match ? Number(match.price) : 0;
    }
    return map;
  }

  // 🆕 Konverton nje string kohe (p.sh. "06:00", "06:00:00", "1970-01-01T06:00:00") ne minuta te dites (0..1439).
  // Kthen null nese s'perpiqet dot te parse-oje.
  private timeStrToMinutes(t: any): number | null {
    if (t == null) return null;
    let s = String(t).trim();
    if (!s) return null;
    // Rasti ISO datetime "1970-01-01T06:00:00" → merr pjesen mbas "T".
    if (s.includes('T')) {
      const parts = s.split('T');
      s = parts[1] || parts[0];
    }
    // Rasti me hapesire "1970-01-01 06:00:00" → merr pjesen e dyte.
    if (s.includes(' ')) {
      const parts = s.split(' ');
      s = parts[parts.length - 1];
    }
    // Rasti me "Z" ne fund → hiqe.
    s = s.replace(/[zZ]$/, '');
    const bits = s.split(':');
    const hh = parseInt(bits[0], 10);
    const mm = parseInt(bits[1], 10);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
    if (hh < 0 || hh > 24 || mm < 0 || mm > 59) return null;
    return hh * 60 + mm;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 🆕 CHANGE BUY ENERGY PRICE — modal + submit + confirm
  // ─────────────────────────────────────────────────────────────────────────

  // Hape modalin. Ngarko rate-t e kompanise per dropdown-in.
  openRebillModal(): void {
    if (!(this.isCompanyAdmin || this.isCompanyAnalyst)) return;
    this.rebillMode = 'rate';
    this.rebillStartDatetime = '';
    this.rebillEndDatetime = '';
    this.rebillEndIsNow = true;
    this.rebillSelectedRateId = null;
    this.rebillCustomHourly = new Array(24).fill(0);
    this.rebillMessage = '';
    this.rebillMessageClass = '';
    this.rebillLastResult = null;
    this.showRebillModal = true;

    // Ngarko rate-t e kompanise (filtruar per rate-t e blerjes — te njejtat qe perdoren
    // per energy_tariff_rate_id te chargerit).
    const companyId = this.chargers?.[0]?.company_id;
    if (companyId) {
      this.rateService.getRateByCompany(companyId).subscribe(
        (data: any) => {
          const raw = data?.rate ?? data?.rates ?? [];
          this.rebillAvailableRates = raw;
        },
        (err: any) => {
          console.error('Error loading rates for rebill modal:', err);
          this.rebillAvailableRates = [];
        }
      );
    }
  }

  closeRebillModal(): void {
    this.showRebillModal = false;
    this.showRebillConfirm = false;
  }

  // Validon inputet dhe hap dialogun e konfirmimit.
  onRebillSubmitClick(): void {
    this.rebillMessage = '';
    if (!this.rebillStartDatetime) {
      this.rebillMessage = 'Data e fillimit eshte e detyrueshme.';
      this.rebillMessageClass = 'alert-danger';
      return;
    }
    if (!this.rebillEndIsNow && !this.rebillEndDatetime) {
      this.rebillMessage = 'Data e mbarimit eshte e detyrueshme (ose zgjidh "Now").';
      this.rebillMessageClass = 'alert-danger';
      return;
    }
    if (this.rebillMode === 'rate' && !this.rebillSelectedRateId) {
      this.rebillMessage = 'Zgjidh nje rate ekzistuese.';
      this.rebillMessageClass = 'alert-danger';
      return;
    }
    if (this.rebillMode === 'custom') {
      const invalid = this.rebillCustomHourly.some(v => v === null || v === undefined || Number.isNaN(Number(v)) || Number(v) < 0);
      if (invalid) {
        this.rebillMessage = 'Te gjitha 24 çmimet custom duhet te jene numra >= 0.';
        this.rebillMessageClass = 'alert-danger';
        return;
      }
    }
    // Mode bursa nuk kerkon input shtese — cmimet lexohen nga bursa_hourly_price ne backend
    this.showRebillConfirm = true;
  }

  cancelRebillConfirm(): void {
    this.showRebillConfirm = false;
  }

  // Ekzekuto POST-in aktual pas konfirmimit.
  confirmRebillSubmit(): void {
    if (this.rebillLoading) return;
    this.rebillLoading = true;
    const body: any = {
      startDatetime: this.rebillStartDatetime,
      endDatetime: this.rebillEndIsNow ? null : this.rebillEndDatetime,
    };
    if (this.rebillMode === 'rate') {
      body.rateId = this.rebillSelectedRateId;
    } else if (this.rebillMode === 'custom') {
      body.customHourlyPrices = this.rebillCustomHourly.map(v => Number(v));
    } else if (this.rebillMode === 'bursa') {
      body.useBursa = true;
    }
    this.chargerService.rebillEnergyTariff(this.id, body).subscribe({
      next: (resp: any) => {
        this.rebillLoading = false;
        this.showRebillConfirm = false;
        if (resp?.success) {
          this.rebillLastResult = resp;
          this.rebillMessage = `Sukses: u perditesuan ${resp.affectedCount} sesione (nga ${resp.totalCount} te skanuara).`;
          this.rebillMessageClass = 'alert-success';
          // Refresh charging history per te reflektuar cmimet e reja.
          this.getChargingHistory();
        } else {
          this.rebillMessage = resp?.message || 'Deshtim ne perditesimin e sesioneve.';
          this.rebillMessageClass = 'alert-danger';
        }
      },
      error: (err: any) => {
        this.rebillLoading = false;
        this.showRebillConfirm = false;
        console.error('rebill error:', err);
        this.rebillMessage = err?.error?.message || err?.message || 'Deshtim ne API.';
        this.rebillMessageClass = 'alert-danger';
      },
    });
  }


  getChargingHistory() {
    this.chargingHistoryService.getChargingByCharger(this.id).subscribe(
      (data) => {
        // console.log(data);
        this.chargingHistory = data.chargingHistory
          ;
        this.tempChargingHistory = [...this.chargingHistory];

        this.chargingHistory.forEach((row, index) => {
          this.cardService.getCard(row.card_id).subscribe(
            (cardData) => {
              this.chargingHistory[index].card = cardData.card.serial_no;
              this.tempChargingHistory = [...this.chargingHistory];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              console.log(error);
            }
          );

        });

      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getConnectors() {
    this.connectorService.getConnectorByCharger(this.id).subscribe(
      (data) => {
        // console.log(data);
        this.connectors = data.connector;
        this.tempConnectors = [...this.connectors];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getReservations() {
    this.reservationService.getReservationByCharger(this.id).subscribe(
      (data) => {
        // console.log(data);
        this.reservations = data.reservation;
        this.tempReservations = [...this.reservations];
        // console.log("tempReservations", this.tempReservations);

        this.reservations.forEach((row, index) => {
          this.reservations[index].charger = row.Charger.charger_name;
          this.reservations[index].user = row.User.username;
          this.reservations[index].time = row.time;
          this.reservations[index].reservationStatus = row.reservation_status;
        });
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getLogsByCharger(timezone: any) {
    this.logService.getLogByCharger(this.id, timezone).subscribe(
      (data) => {
        this.logs = data.logs;
        this.tempLogs = [...this.logs];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  exportLogsToExcel() {
    if (!this.tempLogs || this.tempLogs.length === 0) {
      return;
    }

    const data = this.tempLogs.map((log: any, index: number) => ({
      'No.': index + 1,
      'Protocol': log.protocol || '',
      'Status': log.protocol_status || '',
      'Description': log.protocol_description || '',
      'Date': log.date || '',
      'Time': log.time || ''
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Charger Logs': worksheet },
      SheetNames: ['Charger Logs']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    const chargerName = (this.chargers?.[0]?.charger_name || `charger_${this.id}`).replace(/[^\w\-]+/g, '_');
    saveAs(blob, `${chargerName}_logs_${new Date().getTime()}.xlsx`);
  }

  getChargerLocalListByCharger() {
    this.localListService.getChargerLocalListByCharger(this.id).subscribe(
      (data: any) => {
        // console.log("Response Data:", data);

        // Ensure chargerLocalList is always an array
        if (Array.isArray(data.chargerLocalList)) {
          this.localLists = data.chargerLocalList;
        } else if (data.chargerLocalList) {
          this.localLists = [data.chargerLocalList]; // Wrap single object in an array
        } else {
          this.localLists = [];
        }

        this.tempLocalLists = [...this.localLists]; // Spread to trigger Angular change detection

        // console.log("tempLocalLists", this.tempLocalLists);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log("Error:", error);
      }
    );
  }


  getIpData() {
    this.logService.getIPInfo().subscribe(
      (data) => {
        // this.logs = data.log;
        // this.tempLogs = [...this.logs];
        // console.log("IP Info", data)
        this.getLogsByCharger(data.timezone);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  filterChargingHistoryTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    // console.log('Search Value:', val);  // Debug log

    if (!val) {
      // If the search input is cleared, reset temp to original rows
      this.tempChargingHistory = [...this.chargingHistory];
      return;
    }

    this.tempChargingHistory = this.chargingHistory.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          const match = d[key].toLowerCase().includes(val); // Check if the property contains the search value
          if (match) console.log(`Matched: ${d[key]} for ${key}`); // Debug log for matching values
          return match;
        }
        return false; // Ignore non-string properties
      });
    });
  }

  filterConnectorTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempConnectors = [...this.connectors];
      return;
    }

    this.tempConnectors = this.connectors.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  filterReservationsTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempReservations = [...this.reservations];
      return;
    }

    this.tempReservations = this.reservations.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  filterLogsTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempLogs = [...this.logs];
      return;
    }

    this.tempLogs = this.logs.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  // ==========================================================================
  // 🆕 ENERGY REPORT TAB (Company Admin only)
  // ==========================================================================

  // Thirret nga (selectTab) — lazy load: sillet vetem kur user-i hap tab-in.
  onEnergyReportTabSelect() {
    if (!this.energyLoaded) {
      this.loadEnergyReport();
      this.energyLoaded = true;
    }
  }

  // Kur user-i nderron mode-in, pastroj vleren dhe rifreskoj.
  onEnergyModeChange(mode: 'year' | 'month' | 'daily' | 'day') {
    this.energyMode = mode;
    this.energyTotal = 0;
    this.energyBreakdown = [];
    if (this.energyChart) { this.energyChart.destroy(); this.energyChart = null; }
    this.loadEnergyReport();
  }

  loadEnergyReport() {
    this.energyLoading = true;
    let params: any;
    if (this.energyMode === 'day') {
      params = { date: this.energyDate };
    } else if (this.energyMode === 'year') {
      params = { year: this.energyYear };
    } else {
      params = { year: this.energyYear, month: this.energyMonth };
    }

    this.chargingHistoryService.getChargerEnergySummary(this.id, params).subscribe(
      (data: any) => {
        if (data && data.success !== false) {
          this.energyTotal = Number(data.total) || 0;
          this.energyBreakdown = (data.breakdown || []).map((r: any) => ({
            date: typeof r.date === 'string' ? r.date : new Date(r.date).toISOString().split('T')[0],
            total_energy: Number(r.total_energy) || 0,
          }));
          if (this.energyMode === 'daily' || this.energyMode === 'year') {
            // Render chart pasi Angular ta kete vendosur canvas-in.
            setTimeout(() => this.renderEnergyChart(), 0);
          }
        } else {
          this.energyTotal = 0;
          this.energyBreakdown = [];
        }
        this.energyLoading = false;
      },
      (err) => {
        console.error('Energy report load error:', err);
        this.energyLoading = false;
        this.energyTotal = 0;
        this.energyBreakdown = [];
      }
    );
  }

  // Kthen label-in per nje bucket ne breakdown, sipas mode-it:
  //   - yearly → "January", "February", ...
  //   - daily  → data si-string (psh "2026-07-15")
  formatBucketLabel(dateStr: string): string {
    if (this.energyMode === 'year') {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString('en-US', { month: 'long' });
    }
    return dateStr;
  }

  // Version i shkurter i formatBucketLabel — per chart-in (etiketa me pak vend).
  private formatBucketLabelShort(dateStr: string): string {
    if (this.energyMode === 'year') {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString('en-US', { month: 'short' });
    }
    return dateStr;
  }

  // Konvertim automatik i njesive: kWh → MWh (>=1000) → GWh (>=1M)
  formatEnergy(kwh: number): { value: string; unit: string } {
    const v = Number(kwh) || 0;
    if (v >= 1_000_000) return { value: (v / 1_000_000).toFixed(2), unit: 'GWh' };
    if (v >= 1_000) return { value: (v / 1_000).toFixed(2), unit: 'MWh' };
    return { value: v.toFixed(2), unit: 'kWh' };
  }

  private renderEnergyChart() {
    const canvas: any = document.getElementById('energyChart');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (this.energyChart) { this.energyChart.destroy(); }
    const labels = this.energyBreakdown.map(r => this.formatBucketLabelShort(r.date));
    const data = this.energyBreakdown.map(r => r.total_energy);
    this.energyChart = new Chart(ctx, {
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
        legend: { display: false },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'kWh' } }],
          xAxes: [{ scaleLabel: { display: true, labelString: this.energyMode === 'year' ? 'Month' : 'Date' } }],
        },
      },
    });
  }

  // Helper: emri i periudhes per titull export-i (varet nga mode-i).
  private energyPeriodLabel(): string {
    if (this.energyMode === 'year') return `${this.energyYear}`;
    const m = this.energyMonthOptions.find(x => x.num === this.energyMonth);
    return `${m ? m.name : this.energyMonth} ${this.energyYear}`;
  }

  // Suffix per file-in e exportit (varet nga mode-i).
  private energyFileSuffix(): string {
    if (this.energyMode === 'year') return `${this.energyYear}`;
    return `${this.energyYear}-${String(this.energyMonth).padStart(2, '0')}`;
  }

  // 🆕 Export Excel — per mode-t "Daily breakdown" dhe "Yearly total".
  exportEnergyReportToExcel() {
    if ((this.energyMode !== 'daily' && this.energyMode !== 'year') ||
        !this.energyBreakdown || this.energyBreakdown.length === 0) return;
    const total = this.formatEnergy(this.energyTotal);
    const chargerName = this.chargers?.[0]?.charger_name || `Charger ${this.id}`;
    const bucketHeader = this.energyMode === 'year' ? 'Month' : 'Date';

    // Ndertimi si Array-of-Arrays qe te kete rreshtat e titullit + boshllek + tabelen.
    const aoa: any[][] = [
      [`Energy Report — ${this.energyPeriodLabel()}`],
      [`Charger: ${chargerName}`],
      [`Total: ${total.value} ${total.unit}  (${this.energyTotal.toFixed(2)} kWh)`],
      [],
      [bucketHeader, 'Energy'],
    ];
    this.energyBreakdown.forEach(r => {
      const f = this.formatEnergy(r.total_energy);
      aoa.push([this.formatBucketLabel(r.date), `${f.value} ${f.unit}`]);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [{ wch: 14 }, { wch: 18 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Energy Report');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const safeName = chargerName.replace(/[^\w\-]+/g, '_');
    saveAs(new Blob([buf], { type: 'application/octet-stream' }),
      `EnergyReport_${safeName}_${this.energyFileSuffix()}.xlsx`);
  }

  // 🆕 Export PDF — per mode-t "Daily breakdown" dhe "Yearly total". Perfshin
  // karten e totalit, chart-in (si imazh) dhe tabelen — te njejtin layout si UI-ja.
  exportEnergyReportToPDF() {
    if ((this.energyMode !== 'daily' && this.energyMode !== 'year') ||
        !this.energyBreakdown || this.energyBreakdown.length === 0) return;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const total = this.formatEnergy(this.energyTotal);
    const chargerName = this.chargers?.[0]?.charger_name || `Charger ${this.id}`;
    const bucketHeader = this.energyMode === 'year' ? 'Month' : 'Date';

    // Titulli
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Energy Report', 40, 50);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${chargerName} — ${this.energyPeriodLabel()}`, 40, 68);

    // Kutia me totalin
    doc.setDrawColor(220);
    doc.setFillColor(248, 249, 250);
    doc.rect(40, 85, pageWidth - 80, 60, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('TOTAL ENERGY', pageWidth / 2, 105, { align: 'center' });
    doc.setFontSize(22);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${total.value} ${total.unit}`, pageWidth / 2, 130, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Raw: ${this.energyTotal.toFixed(2)} kWh`, pageWidth / 2, 143, { align: 'center' });

    // Chart si imazh
    let cursorY = 170;
    const canvas: any = document.getElementById('energyChart');
    if (canvas && canvas.toDataURL) {
      try {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = pageWidth - 80;
        const imgHeight = 200;
        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(this.energyMode === 'year' ? 'Monthly consumption' : 'Daily consumption', 40, cursorY);
        cursorY += 10;
        doc.addImage(imgData, 'PNG', 40, cursorY, imgWidth, imgHeight);
        cursorY += imgHeight + 20;
      } catch (e) {
        console.warn('Could not embed chart image:', e);
      }
    }

    // Tabela
    const body = this.energyBreakdown.map(r => {
      const f = this.formatEnergy(r.total_energy);
      return [this.formatBucketLabel(r.date), `${f.value} ${f.unit}`];
    });
    autoTable(doc, {
      startY: cursorY,
      head: [[bucketHeader, 'Energy']],
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [127, 188, 66], textColor: 255 },
      margin: { left: 40, right: 40 },
    });

    const safeName = chargerName.replace(/[^\w\-]+/g, '_');
    doc.save(`EnergyReport_${safeName}_${this.energyFileSuffix()}.pdf`);
  }

}
