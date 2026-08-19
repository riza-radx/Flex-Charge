
import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from "../../../../services/reportService/report.service";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
// 🆕 Helper per sheets extras (User Groups + Gas Station + Recharge History) tek Company Report.
// saveCompanyReport perdor xlsx-js-style qe styles-t (ngjyra, borders, num format) te ruhen ne file.
import {
  buildUserGroupsAggregate,
  buildGasStationAggregate,
  buildCompanyReportBuffer,
  buildRechargersSheet,
  applyStyleToCompanyReportSheet,
  saveCompanyReport,
} from 'src/app/utils/companyReportExcel';
// 🆕 Helper per User Group Report — multi-sheet me fature + detail + per-card sheets.
// saveUserGroupReport perdor xlsx-js-style qe styles-t te ruhen ne file lokal.
import { buildUserGroupReportBuffer, saveUserGroupReport } from 'src/app/utils/userGroupReportExcel';
// 🆕 Helper per Partner Report — multi-sheet: General + FATURE SHITJE + nje sheet per çdo charger.
import { buildPartnerReportBuffer, savePartnerReport } from 'src/app/utils/partnerReportExcel';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

import { CompanyService } from 'src/app/services/companyService/company.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { UserService } from 'src/app/services/userService/user.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { CardService } from 'src/app/services/cardService/card.service';
import { ChargingHistoryService } from 'src/app/services/chargingHistoryService/charging-history.service';
// 🆕 Per te marre rechargers per te njejtin company + periudhe tek Company Report Excel.
import { RechargeService } from 'src/app/services/rechargeService/recharge.service';

@Component({
  selector: 'app-financialdetails',
  templateUrl: './financialdetails.component.html',
  // 🆕 Custom styles per tooltip-in e "Email sent" (perdorim ::ng-deep sepse tooltip-i
  // renderohet ne body me container="body", stilet e scoped-uara nuk aplikohen).
  styles: [`
    ::ng-deep .report-tooltip-lg .tooltip-inner {
      font-size: 14px !important;
      max-width: 360px !important;
      padding: 10px 14px !important;
      line-height: 1.5 !important;
      text-align: left !important;
      background-color: #2c3e50 !important;
    }
    ::ng-deep .report-tooltip-lg .tooltip-arrow,
    ::ng-deep .report-tooltip-lg .arrow::before {
      border-left-color: #2c3e50 !important;
      border-right-color: #2c3e50 !important;
      border-top-color: #2c3e50 !important;
      border-bottom-color: #2c3e50 !important;
    }
  `]
})
export class FinancialdetailsComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  tempReports = [];
  activeRow: any;
  errorMessage: any;
  reports: any;
  reportMetadata: any = [];
  chargingHistory: any = [];
  reportColumns: any[] = [];
  startDate: string = "";
  endDate: string = "";
  startTime: string = "";
  toTime: string = "";
  name: any = null;
  email: any = null;
  phone_number: any = null;
  monthly_platform_fee: any;
  reportType: string = "";
  isCompanyReport: boolean = false;
  isPartnerReport: boolean = false;
  isTimeSplitReport: boolean = false;
  isUserReport: boolean = false;
  isUserGroupReport: boolean = false;

  // 🆕 Loading state per hapjen e raportit — shfaqet nje overlay me kohematese.
  // Raporte te medhenj (7-12 muaj) mund te marrin 15-30 sekonda per t'u ngarkuar.
  // Kohematesi rifreskohet cdo 100ms per feedback vizual smooth.
  isLoadingReport: boolean = false;
  loadingElapsedMs: number = 0;
  private loadingTimerHandle: any = null;
  private loadingStartTime: number = 0;

  private startReportLoading(): void {
    this.isLoadingReport = true;
    this.loadingElapsedMs = 0;
    this.loadingStartTime = Date.now();
    this.loadingTimerHandle = setInterval(() => {
      this.loadingElapsedMs = Date.now() - this.loadingStartTime;
    }, 100);
  }

  private stopReportLoading(): void {
    this.isLoadingReport = false;
    if (this.loadingTimerHandle) {
      clearInterval(this.loadingTimerHandle);
      this.loadingTimerHandle = null;
    }
  }

  get loadingElapsedSeconds(): string {
    return (this.loadingElapsedMs / 1000).toFixed(1);
  }
  isCardReport: boolean = false;
  isGeneralpReport: boolean = false;
  totalCost: number = 0;
  totalDuration: string = '';
  id: string;
  totalEnergy: number = 0;
  totalSalesCost: number = 0;
  totalEnergyCost: number = 0;
  totalCompanyEarning: number = 0;
  totalPartnerEarning: number = 0;
  cardSerial: string = '';
  company_id: any;
  userRole: string | null = null;

  // True when the current user is a Company Admin or Company Analyst.
  // Used to gate three extra user-group columns (Check Fisc / Allow Pay As You Go / Send Invoice By Email) in exports.
  get showUserGroupFlagsInExport(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'companyadmin' || role === 'companyanalyst';
  }

  // 🆕 True kur user-i sheh raportet me strukturen e plote multi-sheet:
  //   - Partner Report → General + FATURE SHITJE + nje sheet per çdo charger
  //   - User Group Report → FATURE + RMD + Charging History + per-card sheets me hyperlinks
  // Rolet e tjera (RadX admin, partner admin, etj) marrin nje single-sheet me info bazike.
  get showFullReport(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'companyadmin' || role === 'companyanalyst';
  }

  // 🆕 Send Report state + role helpers — te njejtat me radxfinancials.
  showSendConfirm: boolean = false;
  isSendingReport: boolean = false;
  sendReportMessage: string = '';
  sendReportMessageClass: string = '';

  get isCompanyAdmin(): boolean { return this.userRole === 'COMPANY_ADMIN'; }
  get isCompanyAnalyst(): boolean { return this.userRole === 'COMPANY_ANALYST'; }
  get isRadXRole(): boolean {
    return this.userRole === 'RadX_Admin' || this.userRole === 'RADX_MODERATOR';
  }
  get canSeeSendInfo(): boolean {
    return this.isCompanyAdmin || this.isCompanyAnalyst || this.isRadXRole;
  }
  // 🆕 A ka akses te dergoje raportin me email? Vetem COMPANY_ADMIN / COMPANY_ANALYST.
  get canSendReport(): boolean {
    return this.isCompanyAdmin || this.isCompanyAnalyst;
  }

  // 🆕 Generate PI — VETEM COMPANY_ANALYST (jo Admin) dhe VETEM per Partner Report.
  get canGeneratePI(): boolean {
    return this.isCompanyAnalyst && this.isPartnerReport;
  }
  // 🆕 STATE per Generate PI (button + confirm modal + result view).
  showGeneratePIModal: boolean = false;
  showGeneratePIConfirm: boolean = false;
  isGeneratingPI: boolean = false;
  generatePIMessage: string = '';
  generatePIMessageClass: string = '';
  generatePIResult: any = null;

  constructor(
    private reportService: ReportService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private router: Router,
    private cardService: CardService,
    private chargingHistoryService: ChargingHistoryService,
    private rechargeService: RechargeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.userRole = localStorage.getItem('userRole');
    this.getVReports();

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
      this.router.navigate([`/reports/financial/${this.activeRow.usergr_id}`]);
    }
  }

  getVReports() {
    // 🆕 Nis overlay-in me kohematese — do te ndalet ne success ose error.
    this.startReportLoading();
    this.reportService.getReport(this.id).subscribe(
      (data: any) => {
        this.reports = data.reportMetadata;
        this.reportColumns = this.reports;
        logger.log(this.reportColumns)
        this.startDate = this.reports?.from_date
        this.endDate = this.reports?.to_date
        this.startTime = this.reports?.from_time
        this.toTime = this.reports?.to_time
        const price = null;
        if (data && Array.isArray(data.reportData)) {
          this.reportMetadata = data.reportData.map((report) => {

            // Llogarit Price
            let price = 0;
            // 🆕 Company/Partner Report tashme perdor 'Sale Revenue (Lek)' — mbaj fallback tek 'Sales Cost' per rekorde te vjetra.
            const salesCost = parseFloat(report['Sale Revenue (Lek)'] ?? report['Sales Cost']) || 0;
            const energy = parseFloat(report['Energy (kWh)']) || 0;

            if (energy > 0) {
              price = salesCost / energy;
              price = Math.round(price); // rrethim tek numri më i afërt
            }

            // Include Charging History in the metadata
            if (report.Charging_History && Array.isArray(report.Charging_History)) {
              report.Charging_History.forEach((history) => {
                this.chargingHistory.push({
                  Start_Date: history.Start_Date,
                  End_Date: history.End_Date,
                  Energy_KW: history.Energy_KW,
                  Charge_Point_Name: history.Charge_Point_Name,
                  Cost: history.Cost,
                });
              });
            }

            const idleFeeCost = parseFloat(
              report['Idle Fee Cost'] ?? report['Idle Fee'] ?? report['idle_fee'] ?? report['fullchargefeecost'] ?? 0
            ) || 0;
            const feePerMinute = parseFloat(
              report['Fee per Minute'] ?? report['fullchargefeeperminute'] ?? 0
            ) || 0;
            const billableIdleMin = feePerMinute > 0 ? Math.round(idleFeeCost / feePerMinute) : 0;
            const cost = parseFloat(
              // 🆕 Company/Partner Report: 'Sale Revenue (Lek)' = shuma per user (ish 'Sales Cost').
              // 'Total Cost' i vjeter ne fakt mbante profitin — nuk perdoret me si session cost.
              report['Sale Revenue (Lek)']
              ?? report['Cost']
              ?? report['Total Amount']
              ?? report['Total Cost']
              ?? 0
            ) || 0;
            const chargingCost = cost - idleFeeCost < 0 ? 0 : cost - idleFeeCost;

            const chargingHistoryId =
              report['Charging History ID'] ??
              report['charging_history_id'] ??
              report['chargingHistoryId'] ??
              report['charging_history_id_fk'] ??
              '';

            return {
              ...report,
              Price: price.toFixed(2), // këtu e vendosim si string me 2 decimals
              formattedDuration: this.convertMinutesToHHMMSS(report['Duration (min)']),
              'Idle Min': billableIdleMin,
              'Fee per Minute': feePerMinute.toFixed(2),
              'Idle Fee Cost': idleFeeCost.toFixed(2),
              'Idle Fee': idleFeeCost.toFixed(2),
              'Idle Minutes': billableIdleMin,
              'Charging Cost': chargingCost.toFixed(2),
              'Charging History ID': chargingHistoryId,
            };
          });

          this.tempReports = [...this.reportMetadata];
          logger.log('tempReports:', this.tempReports);
          const reportType = data.reportMetadata?.report_type?.toLowerCase() || '';
          logger.log('Report Type:', reportType);
          logger.log('this.reports:', this.reports);
          this.reportType = reportType;
          switch (reportType) {
            case 'daily user group':
            case 'generated user group':
            case 'user group report':
            case 'user_group_report':
              this.isUserGroupReport = true;
              logger.log('Processing User Group Report...');
              const usergr_id = this.reports?.usergr_id
              this.getUserGroupDetails(usergr_id);
              this.enrichWithIdleFee('userGroup', usergr_id);
              break;
            case 'rfid_card_report':
            case 'RFID_Card_Report':
              this.isCardReport = true;
              logger.log('Processing User Group Report...');
              const cardId = this.reports?.cardId
              this.getCardDetails(cardId);
              this.enrichWithIdleFee('card', cardId);
              break;
            case 'daily company':
            case 'generated company':
            case 'company report':
            case 'company_report':
              this.isCompanyReport = true;
              logger.log('Processing Company Report...');
              this.company_id = this.reports?.company_id
              this.getCompanyDetails(this.company_id);
              break;
            case 'time split report':
            case 'time_split_report':
              this.isTimeSplitReport = true;
              logger.log('Processing Time Split Report...');
              this.company_id = this.reports?.company_id
              this.getCompanyDetails(this.company_id);
              break;
            case 'daily user':
            case 'generated user':
            case 'user report':
            case 'user_report':
              this.isUserReport = true;
              logger.log('Processing User Report...');
              this.getUserDetails(this.reports?.user_id);
              this.enrichWithIdleFee('user', this.reports?.user_id);
              break;

            case 'daily partner':
            case 'generated partner':
            case 'partner report':
            case 'partner_report':
              this.isPartnerReport = true;
              logger.log('Processing Partner Report...');
              this.getPartnerDetails(this.reports?.partner_id);
              break;

            case 'total_revenue_including_taxes':
            case 'total_revenue_excluding_taxes':
            case 'partner_share_revenue':
            case 'energy_kwh':
            case 'avarage_charging_duration':
            case 'avarage_energy_per_charging':
            case 'charging_count':
            case 'total amount spent':
            case 'avarage_amount_per_active_user':
            case 'avarage_amount_per_user':
            case 'avarage_energy_per_active_user':
            case 'avarage_duration_per_active_user':
            case 'avarage_duration_per_user':
            case 'avarage_sessions_per_active_user':
            case 'avarage_sessions_per_user':
              this.isGeneralpReport = true;
              logger.log('Processing General Report...');
              break;
            default:
              logger.log('Unknown report type:', reportType);
          }

          logger.log('Report Data:', this.reportMetadata);
          logger.log('Report Columns:', this.tempReports);
        } else {
          logger.log('No Report Data available.');
        }
        this.stopReportLoading();
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log('Error fetching report data:', error);
        this.stopReportLoading();
      }
    );
  }

  calculateTotalCost() {
    logger.log("calculateTotalCost");

    if (this.isUserReport) {
      this.totalCost = this.tempReports.reduce((sum, row) => sum + (parseFloat(row["Cost"]) || 0), 0);
      this.totalCost = parseFloat(this.totalCost.toFixed(3)); // Ensures 3 decimal places
      logger.log("this.tempReports", this.tempReports);
      logger.log("isUserReport this.totalCost", this.totalCost);
    } else if (this.isUserGroupReport) {
      this.totalCost = this.tempReports.reduce((sum, row) => sum + (parseFloat(row["Total Amount"]) || 0), 0);
      this.totalCost = parseFloat(this.totalCost.toFixed(3)); // Ensures 3 decimal places
      logger.log("this.tempReports", this.tempReports);
      logger.log("isUserGroupReport this.totalCost", this.totalCost);
    } else if (this.isCardReport) {
      this.totalCost = this.tempReports.reduce((sum, row) => sum + (parseFloat(row["Total Amount"]) || 0), 0);
      this.totalCost = parseFloat(this.totalCost.toFixed(3)); // Ensures 3 decimal places
      logger.log("this.tempReports", this.tempReports);
      logger.log("isUserGroupReport this.totalCost", this.totalCost);
    } else if (this.isPartnerReport || this.isCompanyReport || this.isTimeSplitReport) {
      // 🆕 Company/Partner Report tashme perdor 'Net Profit (Lek)' — kolona e vjeter 'Total Cost' i mbetet fallback.
      // Emri i variablit 'totalCost' ka mbetur si eshte (referohet nga UI), po vlera qe mban tashme quhet "Total Net Profit".
      this.totalCost = this.tempReports.reduce((sum, row) => sum + (parseFloat(row["Net Profit (Lek)"] ?? row["Total Cost"]) || 0), 0);
      this.totalCost = parseFloat(this.totalCost.toFixed(3)); // Ensures 3 decimal places
      logger.log("this.tempReports", this.tempReports);
      logger.log("isPartnerReport this.totalCost", this.totalCost);
    }
  }


  getUserGroupDetails(id: number): void {
    this.userGroupService.usergroupbyidForTheReport(id).subscribe({
      next: (response) => {
        logger.log('response:', response);
        this.name = response.userGroup.usergr_name;
        this.email = response.userGroup.usergr_email;
        this.phone_number = response.userGroup.usergr_phone_no
        logger.log('userGroupName:', this.name);
      },
      error: (error) => {
        logger.error('Error fetching User details:', error);
      }
    });
  }

  getCompanyDetails(id: number): void {
    this.companyService.getCompanyForTheReport(id).subscribe({
      next: (response) => {
        this.name = response.company.company_name;
        this.email = response.company.company_email;
        this.phone_number = response.company.company_phone_no;
        logger.log('response:', response);
        logger.log('companyName:', this.name);
      },
      error: (error) => {
        logger.error('Error fetching company details:', error);
      }
    });
  }
  // Enrich reportMetadata rows with idle fee data from chargingHistory.
  // Backend report endpoint does not include idle fee per row, so we match
  // each report row to a charging history record by Date + Start Time + Charger.
  enrichWithIdleFee(scope: 'user' | 'userGroup' | 'card' | 'company' | 'partner', id: any): void {
    if (!id) return;

    let obs;
    switch (scope) {
      case 'user': obs = this.chargingHistoryService.getChargingByUser(id); break;
      case 'userGroup': obs = this.chargingHistoryService.getChargingByUserGroup(id); break;
      case 'card': obs = this.chargingHistoryService.getChargingByCard(id); break;
      case 'company': obs = this.chargingHistoryService.getChargingByCompany(id); break;
      case 'partner': obs = this.chargingHistoryService.getChargingByPartner(id); break;
      default: return;
    }

    obs.subscribe(
      (data: any) => {
        const list = Array.isArray(data?.chargingHistory)
          ? data.chargingHistory
          : Array.isArray(data?.charging_history)
            ? data.charging_history
            : [];

        const idleByKey: { [k: string]: { idleFeeCost: number; feePerMinute: number; billableIdleMin: number; chargingHistoryId: any } } = {};
        list.forEach((h: any) => {
          const date = (h.charging_history_date || '').toString().trim();
          const start = (h.strted_time || h.started_time || '').toString().trim();
          const charger = (h.Charger?.charger_name || '').toString().trim();
          if (!date || !start) return;
          const idleFeeCost = parseFloat(h.fullchargefeecost) || 0;
          const feePerMinute = parseFloat(h.fullchargefeeperminute) || 0;
          const billableIdleMin = feePerMinute > 0 ? Math.round(idleFeeCost / feePerMinute) : 0;
          const key = `${date}|${start}|${charger}`;
          idleByKey[key] = {
            idleFeeCost,
            feePerMinute,
            billableIdleMin,
            chargingHistoryId: h.charging_history_id ?? h.id ?? '',
          };
        });

        let updated = false;
        this.reportMetadata = this.reportMetadata.map((row: any) => {
          const date = (row['Date'] || row['Start Date'] || '').toString().trim();
          const start = (row['Start Time'] || '').toString().trim();
          const charger = (row['Charge Point Name'] || row['Charge Point'] || '').toString().trim();
          const key = `${date}|${start}|${charger}`;
          const match = idleByKey[key];
          if (match) {
            updated = true;
            // 🆕 Company/Partner Report: 'Sale Revenue (Lek)' zevendeson 'Sales Cost'/'Total Cost'.
            const cost = parseFloat(row['Sale Revenue (Lek)'] ?? row['Cost'] ?? row['Total Amount'] ?? row['Total Cost'] ?? 0) || 0;
            const chargingCost = cost - match.idleFeeCost < 0 ? 0 : cost - match.idleFeeCost;
            return {
              ...row,
              'Charging History ID': row['Charging History ID'] || match.chargingHistoryId,
              ...(match.idleFeeCost > 0 ? {
                'Idle Min': match.billableIdleMin,
                'Fee per Minute': match.feePerMinute.toFixed(2),
                'Idle Fee Cost': match.idleFeeCost.toFixed(2),
                'Idle Fee': match.idleFeeCost.toFixed(2),
                'Idle Minutes': match.billableIdleMin,
                'Charging Cost': chargingCost.toFixed(2),
              } : {}),
            };
          }
          return row;
        });

        if (updated) {
          this.tempReports = [...this.reportMetadata];
        }
      },
      (error) => {
        logger.error('enrichWithIdleFee error:', error);
      }
    );
  }

  getUserDetails(id: number): void {
    this.userService.getUserByIdForTheReport(id).subscribe({
      next: (response) => {
        this.name = response.user.name;
        this.email = response.user.email;
        this.phone_number = response.user.phone_number;
        logger.log('response:', response);
        logger.log('userName:', this.name);
      },
      error: (error) => {
        logger.error('Error fetching User details:', error);
      }
    });
  }

  // 🆕 Split % i partnerit — perdoret nga Partner Report Excel (sheet FATURE SHITJE)
  // per ndarjen VEGA CHARGING vs PARTNER ne MARZHI. Fallback tek row['Partner Share %']
  // ne util nese ky nuk eshte ngarkuar akoma.
  partnerSplitPct: number = 50;

  // 🆕 Burimi i faturimit te energjise — 'OSHEE' | 'PARTNER' | 'INDIPENDENT'.
  // Kur = 'OSHEE': rreshti "ENERGJI ELEKTRIKE" tek "FATURIM PARTNER NDAJ VEGA CHARGING"
  // s'shfaqet dhe VLERA FATURIMIT = vetem PARTNER FEE.
  energyInvoicingSource: string = 'OSHEE';

  getPartnerDetails(id: number): void {
    this.partnerService.getsinglepartnerForTheReport(id).subscribe({
      next: (response) => {
        this.name = response.partner.partner_name;
        this.email = response.partner.email;
        this.phone_number = response.partner.phone_number;
        this.monthly_platform_fee = response.partner.monthly_platform_fee;
        // 🆕 Kap split_percentage per FATURE SHITJE sheet (default 50 nese s'eshte i konfiguruar).
        const sp = Number(response.partner.split_percentage);
        this.partnerSplitPct = Number.isFinite(sp) ? sp : 50;
        // 🆕 Kap energy_invoicing_source — kontrollon shfaqjen e rreshtit ENERGJI ELEKTRIKE
        // tek "FATURIM PARTNER NDAJ VEGA CHARGING" (default 'OSHEE' → hiqet).
        this.energyInvoicingSource = String(response.partner.energy_invoicing_source || 'OSHEE');
        logger.log('response:', response);
        logger.log('partnerName:', this.name);
      },
      error: (error) => {
        logger.error('Error fetching location details:', error);
      }
    });
  }

  // exportToExcel() {
  //   this.calculateTotalCost();
  //   this.calculateTotalEnergy();
  //   let sheetName = '';
  //   let workbook: XLSX.WorkBook = XLSX.utils.book_new();

  //   let headers: string[] = [];
  //   let data: any[][] = [];
  //   let footer: any[] = [];

  //   // Determine report type and set headers/data
  //   switch (true) {
  //     case this.isUserReport:
  //       sheetName = 'User Report';
  //       headers = ['User', 'ID Tag', 'RFID Serial No', 'Charge Point Name', 'Date', 'Start Time', 'End Time', 'Energy (kWh)', 'Cost'];
  //       data = this.reportMetadata.map((item: any) => [
  //         item.User, item['Id Tag'], item['RFID Serial No'] === 'Unknown' ? 'Start remote charging' : item['RFID Serial No'], item['Charge Point Name'],
  //         item.Date, item['Start Time'], item['End Date'], Number(item['Energy (Wh)']), Number(item['Cost'])
  //       ]);
  //       break;

  //     case this.isCardReport:
  //       sheetName = 'RFID Card Report';
  //       headers = ['RFID Serial No', 'User', 'User Group', 'Charge Point Name', 'Date', 'Start Time', 'End Time', 'Energy (kWh)', 'Total Amount'];
  //       data = this.reportMetadata.map((item: any) => [
  //         item['RFID Serial No'],
  //         item.User,
  //         item.UserGroup,
  //         item['Charge Point Name'],
  //         item['Start Date'],
  //         item['Start Time'],
  //         item['End Time'],
  //         Number(item['Energy (Kwh)']),
  //         Number(item['Total Amount'])
  //       ]);

  //       // Add a total row at the end
  //       data.push([
  //         '', '', '', '', '', '', '',
  //         `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`,
  //         `Total Cost: ${this.totalCost}`
  //       ]);
  //       break;

  //     case this.isUserGroupReport:
  //       sheetName = 'User Group Report';
  //       headers = [
  //         'RFID Serial No', 'User', 'Phone Number', 'Email', 'UserGroup', 'Start Date',
  //         'Start Time', 'End Time', 'Total Energy (KWh)', 'Cost', 'Charge Point Name'
  //       ];
  //       data = this.reportMetadata.map((item: any) => [
  //         item['RFID Serial No'] === 'N/A' ? 'Start remote charging' : item['RFID Serial No'], item.User, item['Phone Number'], item.Email, item.UserGroup,
  //         item['Start Date'], item['Start Time'], item['End Time'], Number(item['Energy (Kwh)']),
  //         Number(item['Total Amount']), item['Charge Point Name']
  //       ]);
  //       break;

  //     case this.isPartnerReport:
  //     case this.isCompanyReport:
  //       this.calculateTotalDuration();
  //       this.calculateTotalSalesCost();
  //       this.calculateTotalEnergyCost();
  //       this.calculateTotalCompanyEarning();
  //       this.calculateTotalPartnerEarning();

  //       sheetName = this.isPartnerReport ? 'Partner Report' : 'Company Report';
  //       headers = [
  //         'Charge Point', 'Capacity', 'User', 'RFID Serial No', 'Start Date', 'Start Time', 'End Time', 'Duration (hh:mm:ss)', 'Energy (kWh)', 'Rate Price',
  //         'Sales Cost', 'Buy Energy Price', 'Energy Cost', 'Total Cost', 'Partner\'s Earning', 'Company\'s Earning'
  //       ];
  //       data = this.reportMetadata.map((item: any) => [
  //         item['Charge Point'], item.Capacity, item.User, (!item['RFID Serial No'] || item['RFID Serial No'].trim().toLowerCase() === 'unknown') ? 'Remote Start' : item['RFID Serial No'],
  //         item['Start Date'],
  //         item['Start Time'],
  //         item['End Time'],
  //         item['formattedDuration'], Number(item['Energy (kWh)']), Number(item['Rate Price']),
  //         Number(item['Sales Cost']), Number(item['Buy Energy Price']), Number(item['Energy Cost']), Number(item['Total Cost']), Number(item["Partner's Earning"]), Number(item["Company's Earning"])
  //       ]);
  //       break;

  //     case this.isGeneralpReport:
  //       sheetName = 'General Report';
  //       headers = ['Date', 'Value'];
  //       data = this.reportMetadata.map((item: any) => [
  //         item.Date, item.Value
  //       ]);
  //       break;

  //     default:
  //       console.error('Unknown report type for export');
  //       return;
  //   }

  //   // Merge headers and data into worksheet
  //   let worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  //   // Find the index of the "Cost" column (you need to adjust this for each report type)
  //   let costColumnIndex = headers.findIndex(header =>
  //     ['cost', 'total cost', 'total amount'].includes(header.toLowerCase().trim())
  //   );
  //   let durationColumnIndex = headers.indexOf('Duration (hh:mm:ss)');
  //   let energyColumnIndex = headers.findIndex(h => h.toLowerCase().includes('energy'));

  //   let footerRow = Array(headers.length).fill('');

  //   if (this.isUserReport || this.isUserGroupReport) {
  //     if (energyColumnIndex !== -1) {
  //       footerRow[energyColumnIndex] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
  //     }
  //     if (costColumnIndex !== -1) {
  //       footerRow[costColumnIndex] = `Total Cost: ${this.totalCost.toFixed(2)}`;
  //     }
  //   }

  //   if (this.isPartnerReport || this.isCompanyReport) {
  //     if (durationColumnIndex !== -1) {
  //       footerRow[durationColumnIndex] = `Total Duration: ${this.totalDuration}`;
  //     }

  //     if (energyColumnIndex !== -1) {
  //       footerRow[energyColumnIndex] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
  //     }

  //     const salesCostIndex = headers.indexOf('Sales Cost');
  //     if (salesCostIndex !== -1) {
  //       footerRow[salesCostIndex] = `Total Sales Cost: ${this.totalSalesCost.toFixed(2)}`;
  //     }

  //     const energyCostIndex = headers.indexOf('Energy Cost');
  //     if (energyCostIndex !== -1) {
  //       footerRow[energyCostIndex] = `Total Energy Cost: ${this.totalEnergyCost.toFixed(2)}`;
  //     }

  //     if (costColumnIndex !== -1) {
  //       footerRow[costColumnIndex] = `Total Cost: ${this.totalCost.toFixed(2)}`;
  //     }

  //     const partnerEarningIndex = headers.indexOf(`Partner's Earning`);
  //     if (partnerEarningIndex !== -1) {
  //       footerRow[partnerEarningIndex] = `Partner's Total: ${this.totalPartnerEarning.toFixed(2)}`;
  //     }

  //     const companyEarningIndex = headers.indexOf(`Company's Earning`);
  //     if (companyEarningIndex !== -1) {
  //       footerRow[companyEarningIndex] = `Company's Total: ${this.totalCompanyEarning.toFixed(2)}`;
  //     }
  //   }

  //   XLSX.utils.sheet_add_aoa(worksheet, [footerRow], { origin: -1 });




  //   // Set header row styles
  //   for (let i = 0; i < headers.length; i++) {
  //     let cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: i })]; // Reference to header row
  //     if (!cell) continue;
  //     cell.s = { fill: { fgColor: { rgb: '00A3B9' } }, font: { bold: true, color: { rgb: 'FFFFFF' } } }; // Set background color and text color
  //   }

  //   // Append worksheet to workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  //   // Save Excel file
  //   XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  // }

  exportToExcel() {
    this.calculateTotalCost();
    this.calculateTotalEnergy();

    // 🆕 User Group Report ka struktura te vecanta multi-sheet:
    //   1. FATURE SHITJE_<periudha> — invoice summary grupuar per rate
    //   2. RMD_<ugName> — VETEM aggregate per RFID card me hyperlinks
    //   3. Charging History — VETEM detail rows
    //   4..N. Nje sheet per cdo kart me detajet
    // Perdorim `saveUserGroupReport` (xlsx-js-style writeFile) qe styles-t te ruhen.
    // Vanilla `XLSX.writeFile` do ta strip-onte cell.s → pa ngjyra ne output.
    // 🆕 User Group Report — multi-sheet (FATURE + RMD + detail + per-card sheets me hyperlinks).
    // GATING: vetem per Company Admin / Company Analyst; rolet e tjera bien tek switch-i
    // me poshte qe gjeneron single-sheet me kolonat bazike te sesioneve.
    if (this.isUserGroupReport && this.showFullReport) {
      const ugName = this.name || 'UserGroup';
      const from = this.startDate || '';
      const to = this.endDate || '';
      saveUserGroupReport(this.reportMetadata || [], ugName, from, to);
      return;
    }

    // 🆕 Partner Report — multi-sheet me strukture te vecante (General + FATURE SHITJE
    // + nje sheet per çdo charger, me grupim KLIENT/KOMPANI / VEGA STAFF / KLIENT FUNDOR /
    // SHITJE ME KARTE CASH). GATING: e njejta si UG report.
    if (this.isPartnerReport && this.showFullReport) {
      const partnerName = this.name || 'Partner';
      const from = this.startDate || '';
      const to = this.endDate || '';
      const reportPartnerId = this.reports?.partner_id != null ? Number(this.reports.partner_id) : null;
      savePartnerReport(this.reportMetadata || [], partnerName, reportPartnerId, this.partnerSplitPct, from, to, this.energyInvoicingSource);
      return;
    }

    let sheetName = '';
    let workbook: XLSX.WorkBook = XLSX.utils.book_new();

    let headers: string[] = [];
    let data: any[][] = [];
    let footer: any[] = [];

    // Determine report type and set headers/data
    switch (true) {
      case this.isUserReport:
        sheetName = 'User Report';
        headers = ['Charging History ID', 'User', 'ID Tag', 'RFID Serial No', 'Charge Point Name', 'Date', 'Start Time', 'End Time', 'Energy (kWh)', 'Charging Cost', 'Idle Min', 'Fee per Minute', 'Idle Fee Cost', 'Total Cost'];
        data = this.reportMetadata.map((item: any) => [
          Number(item['Charging History ID']) || '',
          item.User, item['Id Tag'], item['RFID Serial No'] === 'Unknown' ? 'Start remote charging' : item['RFID Serial No'], item['Charge Point Name'],
          item.Date, item['Start Time'], item['End Date'], Number(item['Energy (Wh)']),
          Number(item['Charging Cost']) || 0,
          Number(item['Idle Min']) || 0,
          Number(item['Fee per Minute']) || 0,
          Number(item['Idle Fee Cost']) || 0,
          Number(item['Cost'])
        ]);

        // Sort by User (index 1), then by RFID Serial No (index 3)
        data.sort((a, b) => {
          if (a[1] === b[1]) {
            return (a[3] || '').localeCompare(b[3] || '');
          }
          return (a[1] || '').localeCompare(b[1] || '');
        });

        break;

      case this.isCardReport: {
        sheetName = 'RFID Card Report';
        const ugHeaders = this.showUserGroupFlagsInExport ? ['Check Fisc', 'Allow Pay As You Go', 'Send Invoice By Email'] : [];
        headers = ['Charging History ID', 'RFID Serial No', 'User', 'User Group', ...ugHeaders, 'Charge Point Name', 'Date', 'Start Time', 'End Time', 'Energy (kWh)', 'Charging Cost', 'Idle Min', 'Fee per Minute', 'Idle Fee Cost', 'Total Amount'];
        data = this.reportMetadata.map((item: any) => {
          const ugVals = this.showUserGroupFlagsInExport
            ? [item['Check Fisc'] || 'No', item['Allow Pay As You Go'] || 'No', item['Send Invoice By Email'] || 'No']
            : [];
          return [
            Number(item['Charging History ID']) || '',
            item['RFID Serial No'],
            item.User,
            item.UserGroup,
            ...ugVals,
            item['Charge Point Name'],
            item['Start Date'],
            item['Start Time'],
            item['End Time'],
            Number(item['Energy (Kwh)']),
            Number(item['Charging Cost']) || 0,
            Number(item['Idle Min']) || 0,
            Number(item['Fee per Minute']) || 0,
            Number(item['Idle Fee Cost']) || 0,
            Number(item['Total Amount'])
          ];
        });

        // Sort by User (index 2), then by RFID Serial No (index 1)
        data.sort((a, b) => {
          if (a[2] === b[2]) {
            return (a[1] || '').localeCompare(b[1] || '');
          }
          return (a[2] || '').localeCompare(b[2] || '');
        });

        // Add a total row at the end (length-aware)
        const totalRow = Array(headers.length).fill('');
        const energyIdx = headers.findIndex(h => h.toLowerCase().includes('energy'));
        const costIdx = headers.findIndex(h => ['total amount', 'total cost'].includes(h.toLowerCase()));
        if (energyIdx >= 0) totalRow[energyIdx] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
        if (costIdx >= 0) totalRow[costIdx] = `Total Cost: ${this.totalCost}`;
        data.push(totalRow);
        break;
      }

      case this.isUserGroupReport: {
        sheetName = 'User Group Report';
        const ugHeaders = this.showUserGroupFlagsInExport ? ['Check Fisc', 'Allow Pay As You Go', 'Send Invoice By Email'] : [];
        headers = [
          'Charging History ID', 'RFID Serial No', 'User', 'Phone Number', 'Email', 'UserGroup', ...ugHeaders, 'Start Date',
          'Start Time', 'End Time', 'Total Energy (KWh)', 'Charging Cost', 'Idle Min', 'Fee per Minute', 'Idle Fee Cost', 'Total Cost', 'Charge Point Name'
        ];
        data = this.reportMetadata.map((item: any) => {
          const ugVals = this.showUserGroupFlagsInExport
            ? [item['Check Fisc'] || 'No', item['Allow Pay As You Go'] || 'No', item['Send Invoice By Email'] || 'No']
            : [];
          return [
            Number(item['Charging History ID']) || '',
            item['RFID Serial No'] === 'N/A' ? 'Start remote charging' : item['RFID Serial No'], item.User, item['Phone Number'], item.Email, item.UserGroup,
            ...ugVals,
            item['Start Date'], item['Start Time'], item['End Time'], Number(item['Energy (Kwh)']),
            Number(item['Charging Cost']) || 0,
            Number(item['Idle Min']) || 0,
            Number(item['Fee per Minute']) || 0,
            Number(item['Idle Fee Cost']) || 0,
            Number(item['Total Amount']), item['Charge Point Name']
          ];
        });

        // Sort by User (index 2), then by RFID Serial No (index 1)
        data.sort((a, b) => {
          if (a[2] === b[2]) {
            return (a[1] || '').localeCompare(b[1] || '');
          }
          return (a[2] || '').localeCompare(b[2] || '');
        });

        break;
      }

      // case this.isPartnerReport:
      //   this.calculateTotalDuration();
      //   this.calculateTotalSalesCost();
      //   this.calculateTotalEnergyCost();
      //   this.calculateTotalCompanyEarning();
      //   this.calculateTotalPartnerEarning();

      //   sheetName = this.isPartnerReport ? 'Partner Report' : 'Company Report';
      //   headers = [
      //     'Charge Point', 'Capacity', 'User', 'RFID Serial No', 'Start Date', 'Start Time', 'End Time', 'Duration (hh:mm:ss)', 'Energy (kWh)', 'Rate Price',
      //     'Sales Cost', 'Buy Energy Price', 'Energy Cost', 'Total Cost', 'Partner\'s Earning', 'Company\'s Earning'
      //   ];
      //   data = this.reportMetadata.map((item: any) => [
      //     item['Charge Point'], item.Capacity, item.User, (!item['RFID Serial No'] || item['RFID Serial No'].trim().toLowerCase() === 'unknown') ? 'Remote Start' : item['RFID Serial No'],
      //     item['Start Date'],
      //     item['Start Time'],
      //     item['End Time'],
      //     item['formattedDuration'], Number(item['Energy (kWh)']), Number(item['Rate Price']),
      //     Number(item['Sales Cost']), Number(item['Buy Energy Price']), Number(item['Energy Cost']), Number(item['Total Cost']), Number(item["Partner's Earning"]), Number(item["Company's Earning"])
      //   ]);

      //   // Sort first by User, then by RFID Serial No
      //   data.sort((a, b) => {
      //     if (a[2] === b[2]) {
      //       return (a[3] || '').localeCompare(b[3] || '');  // Compare RFID Serial No (index 3) if Users (index 2) are the same
      //     }
      //     return a[2].localeCompare(b[2]); // Sort by User (index 2)
      //   });

      //   break;
      // case this.isPartnerReport:
      //   this.calculateTotalDuration();
      //   this.calculateTotalSalesCost();
      //   this.calculateTotalEnergyCost();
      //   this.calculateTotalCompanyEarning();
      //   this.calculateTotalPartnerEarning();

      //   sheetName = 'Partner Report';
      //   headers = [
      //     'Charge Point', 'Capacity', 'User', 'RFID Serial No', 'Start Date', 'Start Time', 'End Time',
      //     'Duration (hh:mm:ss)', 'Energy (kWh)', 'Rate Price', 'Sales Cost', 'Buy Energy Price',
      //     'Energy Cost', 'Total Cost', 'Partner\'s Earning', 'Company\'s Earning'
      //   ];
      //   data = this.reportMetadata.map((item: any) => [
      //     item['Charge Point'], item.Capacity, item.User,
      //     (!item['RFID Serial No'] || item['RFID Serial No'].trim().toLowerCase() === 'unknown') ? 'Remote Start' : item['RFID Serial No'],
      //     item['Start Date'], item['Start Time'], item['End Time'],
      //     item['formattedDuration'], Number(item['Energy (kWh)']), Number(item['Rate Price']),
      //     Number(item['Sales Cost']), Number(item['Buy Energy Price']), Number(item['Energy Cost']),
      //     Number(item['Total Cost']), Number(item["Partner's Earning"]), Number(item["Company's Earning"])
      //   ]);

      //   data.sort((a, b) => a[2].localeCompare(b[2]) || (a[3] || '').localeCompare(b[3] || ''));
      //   break;
      // case this.isCompanyReport:
      //   this.calculateTotalDuration();
      //   this.calculateTotalSalesCost();
      //   this.calculateTotalEnergyCost();
      //   this.calculateTotalCompanyEarning();
      //   this.calculateTotalPartnerEarning();

      //   sheetName = this.isPartnerReport ? 'Partner Report' : 'Company Report';
      //   headers = [
      //     'Charge Point', 'Capacity', 'User', 'User Group', 'RFID Serial No', 'Start Date', 'Start Time', 'End Time', 'Duration (hh:mm:ss)', 'Energy (kWh)', 'Rate Price',
      //     'Sales Cost', 'Buy Energy Price', 'Energy Cost', 'Total Cost', 'Partner\'s Earning', 'Company\'s Earning'
      //   ];
      //   data = this.reportMetadata.map((item: any) => [
      //     item['Charge Point'], item.Capacity, item.User, item.UserGroup, (!item['RFID Serial No'] || item['RFID Serial No'].trim().toLowerCase() === 'unknown') ? 'Remote Start' : item['RFID Serial No'],
      //     item['Start Date'],
      //     item['Start Time'],
      //     item['End Time'],
      //     item['formattedDuration'], Number(item['Energy (kWh)']), Number(item['Rate Price']),
      //     Number(item['Sales Cost']), Number(item['Buy Energy Price']), Number(item['Energy Cost']), Number(item['Total Cost']), Number(item["Partner's Earning"]), Number(item["Company's Earning"])
      //   ]);

      //   // Sort first by User, then by RFID Serial No
      //   data.sort((a, b) => {
      //     if (a[2] === b[2]) {
      //       return (a[3] || '').localeCompare(b[3] || '');  // Compare RFID Serial No (index 3) if Users (index 2) are the same
      //     }
      //     return a[2].localeCompare(b[2]); // Sort by User (index 2)
      //   });

      //   break;
      case this.isPartnerReport:
      case this.isCompanyReport:
      case this.isTimeSplitReport:
        this.calculateTotalDuration();
        this.calculateTotalSalesCost();
        this.calculateTotalEnergyCost();
        this.calculateTotalCompanyEarning();
        this.calculateTotalPartnerEarning();

        // sheetName = 'Company Report';
        // sheetName = this.isPartnerReport ? 'Partner Report' : 'Company Report';
        sheetName = this.isPartnerReport ? 'Partner Report'
          : this.isCompanyReport ? 'Company Report'
            : this.isTimeSplitReport ? 'Time Split Report'
              : '';
        {
          const ugHeaders = this.showUserGroupFlagsInExport ? ['Check Fisc', 'Allow Pay As You Go', 'Send Invoice By Email'] : [];
          // 🆕 BC Invoice shtohet vetem per Company Report (jo Partner / Time Split).
          const bcHeader = this.isCompanyReport ? ['BC Invoice'] : [];
          // 🆕 Kolonat e riemertuara + 2 kolona te reja Share %.
          // Kolona e vjeter 'Total Cost' (qe ne fakt mbante fitimin) tashme quhet 'Net Profit (Lek)'.
          // Kolonat Share % vine nga snapshot i partner.split_percentage ne charging_history.
          // 🆕 Kolonat me/pa TVSH: Sale Rate + Sale Revenue kane te dyja variantet;
          // Purchase eshte pa TVSH; Net Profit pa TVSH; Earnings me/pa TVSH.
          headers = [
            'Charging History ID', 'Charge Point', 'Capacity', 'User', 'User Group', ...ugHeaders, 'RFID Serial No', 'Start Date', 'Start Time', 'End Time',
            'Duration (hh:mm:ss)', 'Energy (kWh)',
            'Sale Rate (Lek/kWh) Me TVSH', 'Sale Rate (Lek/kWh) Pa TVSH',
            'Sale Revenue (Lek) Me TVSH', 'Sale Revenue (Lek) Pa TVSH',
            'Purchase Rate (Lek/kWh) Pa TVSH', 'Purchase Cost (Lek) Pa TVSH',
            'Net Profit (Lek) Pa TVSH', 'Net Profit (Lek) Me TVSH',
            'Partner Share %', 'Partner\'s Earning Pa TVSH', 'Partner\'s Earning Me TVSH',
            'Company Share %', 'Company\'s Earning Pa TVSH', 'Company\'s Earning Me TVSH',
            ...bcHeader
          ];
          data = this.reportMetadata.map((item: any) => {
            const ugVals = this.showUserGroupFlagsInExport
              ? [item['Check Fisc'] || 'No', item['Allow Pay As You Go'] || 'No', item['Send Invoice By Email'] || 'No']
              : [];
            const bcVal = this.isCompanyReport ? [item['BC Invoice'] || ''] : [];
            const VAT = 0.2;
            // Ndihmes: nese backend ka fushen Pa TVSH → perdore direkt; perndryshe llogariti nga Me TVSH.
            const saleRateInc = Number(item['Sale Rate (Lek/kWh)'] ?? item['Rate Price']) || 0;
            const saleRateEx = Number(item['Sale Rate (Lek/kWh) Pa TVSH'] ?? (saleRateInc / (1 + VAT))) || 0;
            const saleRevInc = Number(item['Sale Revenue (Lek)'] ?? item['Sales Cost']) || 0;
            const saleRevEx = Number(item['Sale Revenue (Lek) Pa TVSH'] ?? (saleRevInc / (1 + VAT))) || 0;
            const purchaseRate = Number(item['Purchase Rate (Lek/kWh)'] ?? item['Buy Energy Price']) || 0;
            const purchaseCost = Number(item['Purchase Cost (Lek)'] ?? item['Energy Cost']) || 0;
            const netProfitEx = Number(item['Net Profit (Lek) Pa TVSH'] ?? (saleRevEx - purchaseCost)) || 0;
            const netProfitInc = Number(item['Net Profit (Lek) Me TVSH'] ?? (netProfitEx * (1 + VAT))) || 0;
            const partnerSharePct = Number(item['Partner Share %'] ?? item["Partner's Percentage"]) || 0;
            const companySharePct = Number(item['Company Share %'] ?? (100 - partnerSharePct)) || 0;
            const partnerEarnEx = Number(item["Partner's Earning Pa TVSH"] ?? (netProfitEx * partnerSharePct / 100)) || 0;
            const partnerEarnInc = Number(item["Partner's Earning Me TVSH"] ?? (partnerEarnEx * (1 + VAT))) || 0;
            const companyEarnEx = Number(item["Company's Earning Pa TVSH"] ?? (netProfitEx - partnerEarnEx)) || 0;
            const companyEarnInc = Number(item["Company's Earning Me TVSH"] ?? (companyEarnEx * (1 + VAT))) || 0;
            return [
              Number(item['Charging History ID']) || '',
              item['Charge Point'], item.Capacity, item.User, item.UserGroup,
              ...ugVals,
              (!item['RFID Serial No'] || item['RFID Serial No'].trim().toLowerCase() === 'unknown') ? 'Remote Start' : item['RFID Serial No'],
              item['Start Date'], item['Start Time'], item['End Time'], item['formattedDuration'],
              Number(item['Energy (kWh)']),
              saleRateInc, saleRateEx,
              saleRevInc, saleRevEx,
              purchaseRate, purchaseCost, netProfitEx, netProfitInc,
              partnerSharePct, partnerEarnEx, partnerEarnInc,
              companySharePct, companyEarnEx, companyEarnInc,
              ...bcVal
            ];
          });

          // Sort by User (index 3) then by RFID Serial No (varies with flags)
          const rfidIdx = headers.indexOf('RFID Serial No');
          data.sort((a, b) => (a[3] || '').localeCompare(b[3] || '') || ((a[rfidIdx] || '') + '').localeCompare((b[rfidIdx] || '') + ''));
        }
        break;


      case this.isGeneralpReport:
        sheetName = 'General Report';
        headers = ['Date', 'Value'];
        data = this.reportMetadata.map((item: any) => [
          item.Date, item.Value
        ]);
        break;

      default:
        logger.error('Unknown report type for export');
        return;
    }

    // Merge headers and data into worksheet
    let worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Find the index of the "Cost" column (you need to adjust this for each report type)
    let costColumnIndex = headers.findIndex(header =>
      ['cost', 'total cost', 'total amount'].includes(header.toLowerCase().trim())
    );
    let durationColumnIndex = headers.indexOf('Duration (hh:mm:ss)');
    let energyColumnIndex = headers.findIndex(h => h.toLowerCase().includes('energy'));

    let footerRow = Array(headers.length).fill('');

    if (this.isUserReport || this.isUserGroupReport) {
      if (energyColumnIndex !== -1) {
        footerRow[energyColumnIndex] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
      }
      if (costColumnIndex !== -1) {
        footerRow[costColumnIndex] = `Total Cost: ${this.totalCost.toFixed(2)}`;
      }
    }

    if (this.isPartnerReport || this.isCompanyReport || this.isTimeSplitReport) {
      if (durationColumnIndex !== -1) {
        footerRow[durationColumnIndex] = `Total Duration: ${this.totalDuration}`;
      }

      if (energyColumnIndex !== -1) {
        footerRow[energyColumnIndex] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
      }

      // 🆕 Emrat e rinj Me/Pa TVSH (me fallback tek emrat legacy per compat).
      const salesCostIndex = headers.indexOf('Sale Revenue (Lek) Me TVSH');
      if (salesCostIndex !== -1) {
        footerRow[salesCostIndex] = `Total Revenue: ${this.totalSalesCost.toFixed(2)}`;
      }

      const energyCostIndex = headers.indexOf('Purchase Cost (Lek) Pa TVSH');
      if (energyCostIndex !== -1) {
        footerRow[energyCostIndex] = `Total Purchase Cost: ${this.totalEnergyCost.toFixed(2)}`;
      }

      // 🆕 Preferohet totali Me TVSH; nese s'ekziston, kthehu tek Pa TVSH.
      const netProfitIncIndex = headers.indexOf('Net Profit (Lek) Me TVSH');
      const netProfitExIndex = headers.indexOf('Net Profit (Lek) Pa TVSH');
      if (netProfitIncIndex !== -1) {
        footerRow[netProfitIncIndex] = `Total Net Profit: ${this.totalCost.toFixed(2)}`;
      } else if (netProfitExIndex !== -1) {
        footerRow[netProfitExIndex] = `Total Net Profit: ${this.totalCost.toFixed(2)}`;
      } else if (costColumnIndex !== -1) {
        footerRow[costColumnIndex] = `Total Cost: ${this.totalCost.toFixed(2)}`;
      }

      // 🆕 Preferohet totali Me TVSH (per faturim); nese s'ekziston, kthehu tek Pa TVSH.
      const partnerEarningIndex = headers.indexOf(`Partner's Earning Me TVSH`);
      const partnerEarningExIndex = headers.indexOf(`Partner's Earning Pa TVSH`);
      if (partnerEarningIndex !== -1) {
        footerRow[partnerEarningIndex] = `Partner's Total: ${this.totalPartnerEarning.toFixed(2)}`;
      } else if (partnerEarningExIndex !== -1) {
        footerRow[partnerEarningExIndex] = `Partner's Total: ${this.totalPartnerEarning.toFixed(2)}`;
      }

      const companyEarningIndex = headers.indexOf(`Company's Earning Me TVSH`);
      const companyEarningExIndex = headers.indexOf(`Company's Earning Pa TVSH`);
      if (companyEarningIndex !== -1) {
        footerRow[companyEarningIndex] = `Company's Total: ${this.totalCompanyEarning.toFixed(2)}`;
      } else if (companyEarningExIndex !== -1) {
        footerRow[companyEarningExIndex] = `Company's Total: ${this.totalCompanyEarning.toFixed(2)}`;
      }
    }

    XLSX.utils.sheet_add_aoa(worksheet, [footerRow], { origin: -1 });

    // Set header row styles
    for (let i = 0; i < headers.length; i++) {
      let cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: i })]; // Reference to header row
      if (!cell) continue;
      cell.s = { fill: { fgColor: { rgb: '00A3B9' } }, font: { bold: true, color: { rgb: 'FFFFFF' } } }; // Set background color and text color
    }

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 🆕 Vetem per Company Report — shto sheets shtese me styling + perdor xlsx-js-style writeFile.
    //   Sheet 1 (Company Report) — aplikoj styling (header ngjyre + zebra + num format)
    //   Sheet 2 "User Groups"    — kWh totale per cdo grup (styled)
    //   Sheet 3 "Gas Station"    — kWh totale per cdo Charge Point (styled)
    //   Sheet 4 "Recharge History" — rechargers e kompanise ne te njejten periudhe (async fetch)
    if (this.isCompanyReport) {
      const source = this.tempReports || this.reportMetadata || [];

      // 🆕 Aplikoj styling ne sheet-in kryesor (Company Report). Header row = 0.
      applyStyleToCompanyReportSheet(worksheet, 0);

      // Sheet 2: User Groups (me styling brenda funksionit)
      const ugRows = buildUserGroupsAggregate(source);
      const ugSheet = XLSX.utils.json_to_sheet(ugRows);
      ugSheet['!cols'] = [{ wch: 40 }, { wch: 22 }];
      applyStyleToCompanyReportSheet(ugSheet, 0);
      // TOTAL row (rreshti fundit) — aplikohet nga applyStyleToCompanyReportSheet si zebra;
      // per te qene i dukshem, s'kerkohet ekstra work — palete e vjeter e amber ekziston.
      XLSX.utils.book_append_sheet(workbook, ugSheet, 'User Groups');

      // Sheet 3: Gas Station
      const gsRows = buildGasStationAggregate(source);
      const gsSheet = XLSX.utils.json_to_sheet(gsRows);
      gsSheet['!cols'] = [{ wch: 40 }, { wch: 22 }];
      applyStyleToCompanyReportSheet(gsSheet, 0);
      XLSX.utils.book_append_sheet(workbook, gsSheet, 'Gas Station');

      // Sheet 4: Recharge History (async)
      const companyId = this.reports?.company_id;
      const dateMin = this.startDate || this.reports?.from_date || '';
      const dateMax = this.endDate || this.reports?.to_date || '';
      if (companyId && dateMin && dateMax) {
        this.rechargeService.getRechargesByCompany(companyId, {
          date_min: dateMin,
          date_max: dateMax,
        }).subscribe({
          next: (data: any) => {
            const raw: any[] = data?.recharges || [];
            const mapped = raw.map((row: any) => ({
              ...row,
              company: row?.Company?.company_name || '',
              user: row?.User?.username || '',
              userGroup: row?.UserGroup?.usergr_name || '',
              display_order_id: row?.pokOrderId || (row?.recharge_id ? `topup-${row.recharge_id}` : ''),
            }));
            if (mapped.length > 0) {
              const rechargeSheet = buildRechargersSheet(mapped);
              XLSX.utils.book_append_sheet(workbook, rechargeSheet, 'Recharge History');
            }
            // 🆕 Perdor saveCompanyReport (xlsx-js-style writeFile) qe styles-t te ruhen.
            saveCompanyReport(workbook, `${sheetName}.xlsx`);
          },
          error: (err) => {
            logger.warn('⚠️ S\'u marren dot rechargers per Company Report Excel:', err);
            saveCompanyReport(workbook, `${sheetName}.xlsx`);
          }
        });
        return; // async → writeFile therret ne callback.
      }
      // Nese s'kemi company_id/date — ruaj Excel-in pa Recharge History me styles.
      saveCompanyReport(workbook, `${sheetName}.xlsx`);
      return;
    }

    // Save Excel file (sync path per report tipe te tjera — pa styles specifike).
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  }




  exportToPDF() {
    this.calculateTotalCost();
    this.calculateTotalEnergy();
    let doc = new jsPDF('landscape');
    let title = '';
    let headers: string[][] = [];
    let data: any[][] = [];
    let headerInfoLeft = [
      ['Report to:', this.name],
      ['Email:', this.email],
      ['Phone Number:', this.phone_number]
    ];

    let headerInfoRight = [
      ['Report Type:', this.reportType],
      ['Date Range:', this.startDate + ' - ' + this.endDate]
    ];

    if (this.isTimeSplitReport) {
      headerInfoRight.push(['Time Range:', `${this.startTime} – ${this.toTime}`]);
    }

    switch (true) {
      case this.isUserReport:
        title = 'User Report';
        headers = [['Charging History ID', 'User', 'ID Tag', 'RFID Serial No', 'Charge Point Name', 'Date', 'Start Time', 'End Time', 'Energy (kWh)', 'Charging Cost', 'Idle Min', 'Fee per Minute', 'Idle Fee Cost', 'Total Cost']];
        data = this.reportMetadata.map((item: any) => [
          Number(item['Charging History ID']) || '',
          item.User, item['Id Tag'], item['RFID Serial No'] === 'Unknown' ? 'Start remote charging' : item['RFID Serial No'], item['Charge Point Name'],
          item.Date, item['Start Time'], item['End Date'], item['Energy (Wh)'],
          item['Charging Cost'], item['Idle Min'], item['Fee per Minute'], item['Idle Fee Cost'], item['Cost']
        ]);
        data.push(['', '', '', '', '', '', '', '', `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`, '', '', '', '', `Total Cost: ${this.totalCost}`]);

        break;
      case this.isCardReport: {
        title = 'RFID Card Report';
        const ugHeaders = this.showUserGroupFlagsInExport ? ['Check Fisc', 'Allow Pay As You Go', 'Send Invoice By Email'] : [];
        headers = [['Charging History ID', 'RFID Serial No', 'User', 'User Group', ...ugHeaders, 'Charge Point Name', 'Date', 'Start Time', 'End Time', 'Energy (kWh)', 'Charging Cost', 'Idle Min', 'Fee per Minute', 'Idle Fee Cost', 'Total Amount']];
        data = this.reportMetadata.map((item: any) => {
          const ugVals = this.showUserGroupFlagsInExport
            ? [item['Check Fisc'] || 'No', item['Allow Pay As You Go'] || 'No', item['Send Invoice By Email'] || 'No']
            : [];
          return [
            Number(item['Charging History ID']) || '',
            item['RFID Serial No'], item.User, item.UserGroup, ...ugVals, item['Charge Point Name'],
            item['Start Date'], item['Start Time'], item['End Time'], item['Energy (Kwh)'],
            item['Charging Cost'], item['Idle Min'], item['Fee per Minute'], item['Idle Fee Cost'], item['Total Amount']
          ];
        });
        const totalRow = Array(headers[0].length).fill('');
        const energyIdx = headers[0].findIndex(h => h.toLowerCase().includes('energy'));
        const totalIdx = headers[0].findIndex(h => ['total amount', 'total cost'].includes(h.toLowerCase()));
        if (energyIdx >= 0) totalRow[energyIdx] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
        if (totalIdx >= 0) totalRow[totalIdx] = `Total Cost: ${this.totalCost}`;
        data.push(totalRow);
        break;
      }

      case this.isUserGroupReport: {
        title = 'User Group Report';
        const ugHeaders = this.showUserGroupFlagsInExport ? ['Check Fisc', 'Allow Pay As You Go', 'Send Invoice By Email'] : [];
        headers = [[
          'Charging History ID', 'RFID Serial No', 'User', 'Phone Number', 'Email', 'UserGroup', ...ugHeaders, 'Start Date',
          'Start Time', 'End Time', 'Total Energy (Kwh)', 'Charging Cost', 'Idle Min', 'Fee per Minute', 'Idle Fee Cost', 'Total Cost', 'Charge Point Name'
        ]];
        data = this.reportMetadata.map((item: any) => {
          const ugVals = this.showUserGroupFlagsInExport
            ? [item['Check Fisc'] || 'No', item['Allow Pay As You Go'] || 'No', item['Send Invoice By Email'] || 'No']
            : [];
          return [
            Number(item['Charging History ID']) || '',
            item['RFID Serial No'] === 'N/A' ? 'Start remote charging' : item['RFID Serial No'], item.User, item['Phone Number'], item.Email, item.UserGroup,
            ...ugVals,
            item['Start Date'], item['Start Time'], item['End Time'], item['Energy (Kwh)'],
            item['Charging Cost'], item['Idle Min'], item['Fee per Minute'], item['Idle Fee Cost'],
            item['Total Amount'], item['Charge Point Name']
          ];
        });
        const totalRow = Array(headers[0].length).fill('');
        const energyIdx = headers[0].findIndex(h => h.toLowerCase().includes('energy'));
        const totalIdx = headers[0].findIndex(h => ['total amount', 'total cost'].includes(h.toLowerCase()));
        if (energyIdx >= 0) totalRow[energyIdx] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
        if (totalIdx >= 0) totalRow[totalIdx] = `Total Cost: ${this.totalCost}`;
        data.push(totalRow);
        break;
      }

      // case this.isPartnerReport:
      //   this.calculateTotalDuration();
      //   this.calculateTotalSalesCost();
      //   this.calculateTotalEnergyCost();
      //   this.calculateTotalCompanyEarning();
      //   this.calculateTotalPartnerEarning();

      //   title = this.isPartnerReport ? 'Partner Report' : 'Company Report';
      //   headers = [[
      //     'Charge Point', 'Capacity', 'User', 'Card', 'Date', 'Start Time', 'End Time', 'Duration(hh:mm:ss)', 'Energy(kWh)', 'Price',
      //     'Sales Cost', 'Buy Energy Price', 'Energy Cost', 'Total Cost', 'Partner\'s Earning', 'Company\'s Earning'
      //   ]];
      //   data = this.reportMetadata.map((item: any) => [
      //     item['Charge Point'], item.Capacity, item.User, item['RFID Serial No'] === 'N/A' ? 'Start remote charging' : item['RFID Serial No'], item['Start Date'], item['Start Time'], item['End Time'], item['formattedDuration'], item['Energy (kWh)'], item['Rate Price'],
      //     item['Sales Cost'], item['Buy Energy Price'], item['Energy Cost'], item['Total Cost'], item['Partner\'s Earning'], item['Company\'s Earning']
      //   ]);
      //   // Add total cost row below the table
      //   data.push(['', '', '', '', '', '', '', `Total Duration(min): ${this.totalDuration}`, `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`, '',
      //     `Total Sales Cost: ${this.totalSalesCost.toFixed(2)}`, '', `Total Energy Cost: ${this.totalEnergyCost.toFixed(2)}`,
      //     `Total Cost: ${this.totalCost}`, `Partner's Total: ${this.totalPartnerEarning.toFixed(2)}`, `Company's Total: ${this.totalCompanyEarning.toFixed(2)}`]);


      //   break;
      case this.isPartnerReport:
      case this.isCompanyReport:
      case this.isTimeSplitReport:
        this.calculateTotalDuration();
        this.calculateTotalSalesCost();
        this.calculateTotalEnergyCost();
        this.calculateTotalCompanyEarning();
        this.calculateTotalPartnerEarning();

        // title = this.isPartnerReport ? 'Partner Report' : 'Company Report';
        title = this.isPartnerReport ? 'Partner Report'
          : this.isCompanyReport ? 'Company Report'
            : this.isTimeSplitReport ? 'Time Split Report'
              : '';
        {
          const ugHeaders = this.showUserGroupFlagsInExport ? ['Check Fisc', 'Allow Pay As You Go', 'Send Invoice By Email'] : [];
          // 🆕 Kolonat e riemertuara + 2 kolona te reja Share %.
          headers = [[
            'Charging History ID', 'Charge Point', 'Capacity', 'User', 'User Group', ...ugHeaders, 'Card', 'Date', 'Start Time', 'End Time', 'Duration(hh:mm:ss)', 'Energy(kWh)',
            'Sale Rate (Lek/kWh)', 'Sale Revenue (Lek)', 'Purchase Rate (Lek/kWh)', 'Purchase Cost (Lek)', 'Net Profit (Lek)',
            'Partner Share %', 'Partner\'s Earning', 'Company Share %', 'Company\'s Earning'
          ]];
          data = this.reportMetadata.map((item: any) => {
            const ugVals = this.showUserGroupFlagsInExport
              ? [item['Check Fisc'] || 'No', item['Allow Pay As You Go'] || 'No', item['Send Invoice By Email'] || 'No']
              : [];
            // 🆕 Lexo emrat e rinj me fallback tek emrat e vjeter per compat.
            const saleRate = Number(item['Sale Rate (Lek/kWh)'] ?? item['Rate Price']) || 0;
            const saleRevenue = Number(item['Sale Revenue (Lek)'] ?? item['Sales Cost']) || 0;
            const purchaseRate = Number(item['Purchase Rate (Lek/kWh)'] ?? item['Buy Energy Price']) || 0;
            const purchaseCost = Number(item['Purchase Cost (Lek)'] ?? item['Energy Cost']) || 0;
            const netProfit = Number(item['Net Profit (Lek)'] ?? item['Total Cost']) || 0;
            const partnerSharePct = Number(item['Partner Share %'] ?? item["Partner's Percentage"]) || 0;
            const companySharePct = Number(item['Company Share %'] ?? (100 - partnerSharePct)) || 0;
            return [
              Number(item['Charging History ID']) || '',
              item['Charge Point'], item.Capacity, item.User, item.UserGroup, ...ugVals,
              item['RFID Serial No'] === 'N/A' ? 'Start remote charging' : item['RFID Serial No'],
              item['Start Date'], item['Start Time'], item['End Time'], item['formattedDuration'], item['Energy (kWh)'],
              saleRate, saleRevenue, purchaseRate, purchaseCost, netProfit,
              partnerSharePct, item['Partner\'s Earning'],
              companySharePct, item['Company\'s Earning']
            ];
          });
          // Totals row (length-aware so it lines up with the column headers regardless of role)
          const totalRow = Array(headers[0].length).fill('');
          const idx = (name: string) => headers[0].indexOf(name);
          if (idx('Duration(hh:mm:ss)') >= 0) totalRow[idx('Duration(hh:mm:ss)')] = `Total Duration(min): ${this.totalDuration}`;
          if (idx('Energy(kWh)') >= 0) totalRow[idx('Energy(kWh)')] = `Total Energy: ${this.totalEnergy.toFixed(2)} kWh`;
          if (idx('Sale Revenue (Lek)') >= 0) totalRow[idx('Sale Revenue (Lek)')] = `Total Revenue: ${this.totalSalesCost.toFixed(2)}`;
          if (idx('Purchase Cost (Lek)') >= 0) totalRow[idx('Purchase Cost (Lek)')] = `Total Purchase Cost: ${this.totalEnergyCost.toFixed(2)}`;
          if (idx('Net Profit (Lek)') >= 0) totalRow[idx('Net Profit (Lek)')] = `Total Net Profit: ${this.totalCost}`;
          if (idx("Partner's Earning") >= 0) totalRow[idx("Partner's Earning")] = `Partner's Total: ${this.totalPartnerEarning.toFixed(2)}`;
          if (idx("Company's Earning") >= 0) totalRow[idx("Company's Earning")] = `Company's Total: ${this.totalCompanyEarning.toFixed(2)}`;
          data.push(totalRow);
        }

        break;
      case this.isGeneralpReport:
        title = 'General Report';
        headers = [['Date', 'Value']];
        data = this.reportMetadata.map((item: any) => [
          item.Date, item.Value
        ]);
        break;

      default:
        logger.error('Unknown report type for PDF export');
        return;
    }

    // **Add the single image (logo)**
    let imgUrl = 'assets/flexcharge/logo-nobg.png'; // Path to the single image
    let imgWidth = 50; // Adjust width as needed
    let imgHeight = 15; // Adjust height as needed
    let imgX = 120; // Position for the image (left)
    let imgY = 5; // Position at the top
    doc.addImage(imgUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);

    // **Set title**
    doc.setFontSize(16);
    doc.text(title, 14, 15 + imgHeight + 5);  // Adjusting position for title after image

    // **Add header info (left aligned)**
    doc.setFontSize(10);
    let yPosition = 25 + imgHeight + 10; // Initial Y position for left-aligned headers

    headerInfoLeft.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, 14, yPosition);
      yPosition += 7; // Adjust space between lines
    });

    // **Add header info (right aligned)**
    let rightXPosition = 200; // X position for right-aligned headers
    let rightYPosition = 25 + imgHeight + 10; // Initial Y position for right-aligned headers

    headerInfoRight.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, rightXPosition, rightYPosition);
      rightYPosition += 7; // Adjust space between lines
    });

    // **Generate table**
    let finalY = yPosition + 5; // Calculate the initial position for the table
    // autoTable(doc, {
    //   head: headers,
    //   body: data,
    //   startY: finalY, // Ensuring proper spacing from header info
    //   styles: { fontSize: 10 },
    //   headStyles: {
    //     fillColor: [127, 188, 66], // Set only the header background color
    //     textColor: [0, 0, 0], // Keep the header text color black
    //     halign: 'center' // Center the header text
    //   },
    //   theme: 'grid',
    //   didDrawPage: (data) => {
    //     finalY = data.cursor.y; // Get the Y position after the table is drawn
    //   }
    // });
    let columnStyles = {};

    if (this.isCompanyReport || this.isTimeSplitReport) {
      columnStyles = {
        1: { cellWidth: 10 },  // Capacity - shrink
        4: { cellWidth: 30 },  // Card - expand
        7: { cellWidth: 15 },  // Duration - shrink
        8: { cellWidth: 15 }   // Energy - shrink
      };
    } else if (this.isPartnerReport) {
      columnStyles = {
        1: { cellWidth: 10 },  // Capacity - shrink
        3: { cellWidth: 30 },  // Card - expand
        7: { cellWidth: 15 },  // Duration - shrink
        8: { cellWidth: 15 }   // Energy - shrink
      };
    }

    autoTable(doc, {
      head: headers,
      body: data,
      startY: finalY,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [127, 188, 66],
        textColor: [0, 0, 0],
        halign: 'center'
      },
      theme: 'grid',
      columnStyles: columnStyles,
      didDrawPage: (data) => {
        finalY = data.cursor.y;
      }
    });
    // autoTable(doc, {
    //   head: headers,
    //   body: data,
    //   startY: finalY,
    //   styles: {
    //     fontSize: 10,
    //     cellPadding: 2,
    //     overflow: 'linebreak'
    //   },
    //   headStyles: {
    //     fillColor: [127, 188, 66],
    //     textColor: [0, 0, 0],
    //     halign: 'center'
    //   },
    //   theme: 'grid',
    //   columnStyles: this.isPartnerReport || this.isCompanyReport ? {
    //     1: { cellWidth: 10 },  // Capacity - shrink
    //     4: { cellWidth: 30 },  // Card - expand to hold multiple lines
    //     7: { cellWidth: 15 },  // Duration - shrink
    //     8: { cellWidth: 15 },  // Energy - shrink
    //   } : {},
    //   didDrawPage: (data) => {
    //     finalY = data.cursor.y;
    //   }
    // });


    // Get the width of the footer text

    doc.setFontSize(10);

    // **Save PDF**
    doc.save(`${title}.pdf`);
  }

  convertMinutesToHHMMSS(duration: string): string {
    if (!duration) {
      return '00:00:00'; // Ose mund të vendosni vlerën që dëshironi për vlerat bosh ose të papërcaktuara
    }

    // Përshtatje për ndarjen e minutave dhe sekondave
    const [minutes, seconds] = duration.split(':').map(num => parseInt(num, 10));

    // Llogarit orët dhe minutat
    const hours = Math.floor(minutes / 60);  // Llogarit orët
    const remainingMinutes = minutes % 60;  // Llogarit minutat që mbeten

    // Kthejeni në formatin "hh:mm:ss"
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  calculateTotalDuration() {
    let totalSeconds = 0;

    if (this.reportMetadata && this.reportMetadata.length > 0) {
      this.reportMetadata.forEach((item: any) => {
        const durationStr = item['formattedDuration']; // Assumes format is 'hh:mm:ss'
        if (durationStr) {
          const parts = durationStr.split(':').map(Number);
          if (parts.length === 3) {
            const [hours, minutes, seconds] = parts;
            totalSeconds += (hours * 3600) + (minutes * 60) + seconds;
          }
        }
      });
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.totalDuration = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    logger.log('Total Duration:', this.totalDuration);
  }

  // calculateTotalDuration() {
  //   let totalSeconds = 0;

  //   if (this.reportMetadata && this.reportMetadata.length > 0) {
  //     this.reportMetadata.forEach((item: any) => {
  //       const durationStr = item['formattedDuration']; // Format: 'hh:mm:ss'
  //       if (durationStr) {
  //         const parts = durationStr.split(':').map(Number);
  //         if (parts.length === 3) {
  //           const [hours, minutes, seconds] = parts;
  //           totalSeconds += (hours * 3600) + (minutes * 60) + seconds;
  //         }
  //       }
  //     });
  //   }

  //   const totalMinutes = Math.floor(totalSeconds / 60); // Round down to full minutes
  //   this.totalDuration = totalMinutes.toString(); // Store as string if you're displaying it

  //   console.log('Total Duration in Minutes:', this.totalDuration);
  // }


  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
  calculateTotalEnergy(): void {
    let energyField = '';

    if (this.isUserReport) {
      energyField = 'Energy (Wh)';
    } else if (this.isCardReport) {
      energyField = 'Energy (Kwh)';
    } else if (this.isUserGroupReport) {
      energyField = 'Energy (Kwh)';
    } else if (this.isPartnerReport || this.isCompanyReport || this.isTimeSplitReport) {
      energyField = 'Energy (kWh)';
    } else {
      this.totalEnergy = 0;
      return;
    }

    this.totalEnergy = this.reportMetadata.reduce((sum: number, item: any) => {
      let value = parseFloat(item[energyField]);
      if (!isNaN(value)) {
        return (sum + value);
      }
      return sum;
    }, 0);
    this.totalEnergy = parseFloat(this.totalEnergy.toFixed(4)); // Use 4+ decimals for better precision
  }


  calculateTotalSalesCost(): void {
    // 🆕 Per Partner/Company/TimeSplit report, backend tashme emeron 'Sale Revenue (Lek)'.
    // Mbaj fallback tek 'Sales Cost' i vjeter per compat me report-e te kesheruar.
    const readValue = (item: any): number => {
      if (this.isPartnerReport || this.isCompanyReport || this.isTimeSplitReport) {
        return parseFloat(item['Sale Revenue (Lek)'] ?? item['Sales Cost']) || 0;
      }
      if (this.isUserReport || this.isUserGroupReport) {
        return parseFloat(item['Sales Cost']) || 0;
      }
      return NaN;
    };

    if (!(this.isUserReport || this.isUserGroupReport || this.isPartnerReport || this.isCompanyReport || this.isTimeSplitReport)) {
      this.totalSalesCost = 0;
      return;
    }

    this.totalSalesCost = this.reportMetadata.reduce((sum: number, item: any) => {
      const value = readValue(item);
      return !isNaN(value) ? sum + value : sum;
    }, 0);
    this.totalSalesCost = parseFloat(this.totalSalesCost.toFixed(4));
  }

  calculateTotalEnergyCost(): void {
    // 🆕 Per Partner/Company/TimeSplit report, backend tashme emeron 'Purchase Cost (Lek)'.
    // Mbaj fallback tek 'Energy Cost' i vjeter per compat.
    const readValue = (item: any): number => {
      if (this.isPartnerReport || this.isCompanyReport || this.isTimeSplitReport) {
        return parseFloat(item['Purchase Cost (Lek)'] ?? item['Energy Cost']) || 0;
      }
      if (this.isUserReport || this.isUserGroupReport) {
        return parseFloat(item['Energy Cost']) || 0;
      }
      return NaN;
    };

    if (!(this.isUserReport || this.isUserGroupReport || this.isPartnerReport || this.isCompanyReport || this.isTimeSplitReport)) {
      this.totalEnergyCost = 0;
      return;
    }

    this.totalEnergyCost = this.reportMetadata.reduce((sum: number, item: any) => {
      const value = readValue(item);
      return !isNaN(value) ? sum + value : sum;
    }, 0);
    this.totalEnergyCost = parseFloat(this.totalEnergyCost.toFixed(4));
  }

  calculateTotalCompanyEarning(): void {
    const field = "Company's Earning";

    this.totalCompanyEarning = this.reportMetadata.reduce((sum: number, item: any) => {
      const value = parseFloat(item[field]);
      return !isNaN(value) ? sum + value : sum;
    }, 0);
    this.totalCompanyEarning = parseFloat(this.totalCompanyEarning.toFixed(4));

  }

  calculateTotalPartnerEarning(): void {
    const field = "Partner's Earning";

    this.totalPartnerEarning = this.reportMetadata.reduce((sum: number, item: any) => {
      const value = parseFloat(item[field]);
      return !isNaN(value) ? sum + value : sum;
    }, 0);
    this.totalPartnerEarning = parseFloat(this.totalPartnerEarning.toFixed(4));

  }

  getCardDetails(id: number): void {
    this.cardService.getCard(id).subscribe({
      next: (response) => {
        this.cardSerial = response.card.serial_no;

        logger.log('response:', response);
        logger.log('cardSerial:', this.cardSerial);
      },
      error: (error) => {
        logger.error('Error fetching location details:', error);
      }
    });
  }

  // ============================================================================
  // 🆕 SEND REPORT EMAIL — buton brenda faqes Details.
  // Logjika i njejte me radxfinancials (list page): kur klikohet, hap confirm
  // modal → ndertim Excel me `buildCompanyReportBuffer` (nese Company Report,
  // 3 sheets) → POST tek endpoint-i sendReportEmail → update state ne UI.
  // ============================================================================

  // Etiketa e marresit per popup-in.
  getRecipientLabel(): string {
    const type = String(this.reports?.report_type || '').toLowerCase();
    if (type.includes('partner')) return `Partner: ${this.name || 'Unknown'}`;
    if (type.includes('user_group') || type.includes('user group')) return `User Group: ${this.name || 'Unknown'}`;
    if (type.includes('company')) return `Company: ${this.name || 'Unknown'}`;
    if (type.includes('rfid') || type.includes('card')) return `Card owner (User / Group / Partner)`;
    if (type.includes('user')) return `User: ${this.name || 'Unknown'}`;
    return 'Recipient sipas tipit te raportit';
  }

  // Email-i i marresit (nese eshte i njohur nga backend).
  getRecipientEmail(): string {
    return this.email || '';
  }

  onClickSendReport() {
    // 🆕 Defensive check: bllok edhe nese DOM-i eshte modifikuar dhe butoni behet i klikueshem.
    if (!this.canSendReport) return;
    this.showSendConfirm = true;
    this.sendReportMessage = '';
    this.sendReportMessageClass = '';
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 🆕 GENERATE PI — modal handlers per Partner Report (COMPANY_ANALYST only)
  // ═══════════════════════════════════════════════════════════════════════
  onClickGeneratePI() {
    if (!this.canGeneratePI) return;
    // Idempotency check ne UI — nese eshte bere tashme, mos hap modalin.
    if (this.reports?.pi_generated_at) {
      this.generatePIMessage = `PI-t per kete raport jane gjeneruar tashme ne ${this.reports.pi_generated_at} nga ${this.reports.pi_generated_by || 'N/A'}.`;
      this.generatePIMessageClass = 'alert-warning';
      return;
    }
    this.showGeneratePIModal = true;
    this.showGeneratePIConfirm = false;
    this.generatePIMessage = '';
    this.generatePIMessageClass = '';
    this.generatePIResult = null;
  }

  closeGeneratePIModal() {
    this.showGeneratePIModal = false;
    this.showGeneratePIConfirm = false;
    this.isGeneratingPI = false;
  }

  onGeneratePISubmitClick() {
    if (this.isGeneratingPI) return;
    this.showGeneratePIConfirm = true;
  }

  cancelGeneratePIConfirm() {
    this.showGeneratePIConfirm = false;
  }

  // Ekzekuto POST-in aktual pas konfirmimit.
  confirmGeneratePISubmit() {
    if (this.isGeneratingPI) return;
    this.isGeneratingPI = true;
    this.generatePIMessage = '';
    this.reportService.generatePartnerPI(this.id).subscribe({
      next: (resp: any) => {
        this.isGeneratingPI = false;
        this.showGeneratePIConfirm = false;
        if (resp?.success) {
          this.generatePIResult = resp;
          this.generatePIMessage = `Sukses: u krijuan ${resp.invoicesCreated} Purchase Invoices ne BC (Draft) per ${resp.locations} location(s).`;
          this.generatePIMessageClass = 'alert-success';
          // Update local tracking qe butoni te dezaktivizohet menjehere.
          if (this.reports) {
            this.reports.pi_generated_at = new Date().toISOString();
            this.reports.pi_generated_by = 'Ju';
          }
        } else {
          this.generatePIMessage = resp?.message || 'Deshtim ne gjenerimin e PI.';
          this.generatePIMessageClass = 'alert-danger';
        }
      },
      error: (err: any) => {
        this.isGeneratingPI = false;
        this.showGeneratePIConfirm = false;
        logger.error('generatePI error:', err);
        this.generatePIMessage = err?.error?.message || err?.message || 'Deshtim ne API. Financa dhe RadX jane njoftuar me email.';
        this.generatePIMessageClass = 'alert-danger';
      },
    });
  }

  cancelSendReport() {
    this.showSendConfirm = false;
    this.isSendingReport = false;
  }

  // Konfirmim + dergimi aktual.
  confirmSendReport() {
    if (this.isSendingReport) return;
    this.isSendingReport = true;

    try {
      const reportRows: any[] = Array.isArray(this.reportMetadata) ? this.reportMetadata : [];
      if (reportRows.length === 0) {
        this.finishSendWithError('Nuk ka te dhena per kete raport (bosh) — nuk mund te dergohet.');
        return;
      }

      // Ndertim Excel — logjika e ndryshme sipas tipit te raportit:
      //   Company Report → 4 sheets (Company + User Groups + Gas Station + Recharge History)
      //   User Group Report → multi-sheet (Fature + Detail + per-card sheets me hyperlinks)
      //   Partner Report → multi-sheet (General + FATURE SHITJE + nje sheet per çdo charger)
      //   Te tjera → nje sheet i vetem
      const reportType = String(this.reports?.report_type || '').toLowerCase();
      const isCompanyReport = reportType.includes('company');
      const isUserGroupReport = reportType.includes('user_group') || reportType.includes('user group');
      const isPartnerReport = reportType.includes('partner');

      if (isCompanyReport) {
        // 🆕 Company Report: fetch rechargers async, pastaj build buffer + POST.
        const companyId = this.reports?.company_id;
        const dateMin = this.startDate || this.reports?.from_date || '';
        const dateMax = this.endDate || this.reports?.to_date || '';
        const proceedWithBuffer = (rechargers: any[]) => {
          const buffer = buildCompanyReportBuffer(reportRows, undefined, rechargers);
          this.postExcelBuffer(buffer);
        };
        if (companyId && dateMin && dateMax) {
          this.rechargeService.getRechargesByCompany(companyId, {
            date_min: dateMin,
            date_max: dateMax,
          }).subscribe({
            next: (data: any) => {
              const raw: any[] = data?.recharges || [];
              const mapped = raw.map((row: any) => ({
                ...row,
                company: row?.Company?.company_name || '',
                user: row?.User?.username || '',
                userGroup: row?.UserGroup?.usergr_name || '',
                display_order_id: row?.pokOrderId || (row?.recharge_id ? `topup-${row.recharge_id}` : ''),
              }));
              proceedWithBuffer(mapped);
            },
            error: () => proceedWithBuffer([]),
          });
        } else {
          proceedWithBuffer([]);
        }
        return; // async — POST behet ne callback
      }

      let buffer: ArrayBuffer;
      if (isUserGroupReport && this.showFullReport) {
        // 🆕 UG Report multi-sheet — VETEM per Company Admin / Company Analyst.
        // Rolet e tjera bien tek else me poshte dhe marrin nje single-sheet me info bazike.
        const ugName = this.name || 'UserGroup';
        const from = this.startDate || this.reports?.from_date || '';
        const to = this.endDate || this.reports?.to_date || '';
        buffer = buildUserGroupReportBuffer(reportRows, ugName, from, to);
      } else if (isPartnerReport && this.showFullReport) {
        // 🆕 Partner Report multi-sheet — VETEM per Company Admin / Company Analyst.
        const partnerName = this.name || 'Partner';
        const from = this.startDate || this.reports?.from_date || '';
        const to = this.endDate || this.reports?.to_date || '';
        const reportPartnerId = this.reports?.partner_id != null ? Number(this.reports.partner_id) : null;
        buffer = buildPartnerReportBuffer(reportRows, partnerName, reportPartnerId, this.partnerSplitPct, from, to, this.energyInvoicingSource);
      } else {
        const ws = XLSX.utils.json_to_sheet(reportRows);
        const wb: XLSX.WorkBook = { Sheets: { 'Report': ws }, SheetNames: ['Report'] };
        buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      }

      this.postExcelBuffer(buffer);
    } catch (buildErr: any) {
      this.finishSendWithError('S\'u ndertua dot Excel-i: ' + (buildErr?.message || buildErr));
    }
  }

  // 🆕 POST-oj Excel buffer-in tek endpoint-i sendReportEmail dhe update-oj state.
  // Ekstraktuar si metode qe te riperdoret nga rrjedhat sync (User Group, User, etc.)
  // dhe async (Company Report qe pret rechargers).
  private postExcelBuffer(buffer: ArrayBuffer) {
    const excelBlob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const fileName = `Raport_${this.reports?.report_type || 'Report'}_${this.reports?.from_date || ''}_${this.reports?.to_date || ''}.xlsx`
      .replace(/[^a-zA-Z0-9._-]+/g, '_');

    const formData = new FormData();
    formData.append('excel', excelBlob, fileName);

    this.reportService.sendReportEmail(this.id, formData).subscribe({
      next: (resp: any) => {
        this.isSendingReport = false;
        this.showSendConfirm = false;

        if (this.reports) {
          this.reports.sent_at = resp?.data?.sent_at || new Date();
          this.reports.send_count = resp?.data?.send_count || (this.reports.send_count || 0) + 1;
          this.reports.sent_to_emails = (resp?.data?.recipients || []).join(', ');
        }

        this.sendReportMessage = resp?.message || 'Email sent successfully';
        this.sendReportMessageClass = 'alert-success';
        setTimeout(() => this.sendReportMessage = '', 5000);
      },
      error: (err) => {
        this.finishSendWithError(err?.error?.message || err?.message || 'Failed to send email');
      }
    });
  }

  private finishSendWithError(msg: string) {
    this.isSendingReport = false;
    this.showSendConfirm = false;
    this.sendReportMessage = msg;
    this.sendReportMessageClass = 'alert-danger';
    setTimeout(() => this.sendReportMessage = '', 8000);
  }

}
