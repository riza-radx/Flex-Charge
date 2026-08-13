import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RateService } from "../../../../services/rateService/rate.service";
import { CompanyService } from "../../../../services/companyService/company.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-radxrate',
  templateUrl: './radxrate.component.html',
  styles: [
  ]
})
export class RadxrateComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;
  currentMonthCountEntry: number = 0;
  companies: any[] = [];
  selectedCompanyId: number | null = null;

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

  isRadXRole: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  // 🆕 Tab-i aktual: 'sale' (default) ose 'purchase'. Filtron rows-in per te
  // shfaqur vetem tipin perkates te rate-ve.
  activeRateTab: 'sale' | 'purchase' = 'sale';
  // Backup i te gjitha rate-ve; temp filtrohet per tab-in aktual dhe search-in.
  allRows: any[] = [];

  // 🆕 Numeruesit per te dyja tab-et (shfaqen ngjitur me emrin e tab-it).
  get saleCount(): number {
    return (this.allRows || []).filter(r => (r?.rate_type || 'sale') === 'sale').length;
  }
  get purchaseCount(): number {
    return (this.allRows || []).filter(r => r?.rate_type === 'purchase').length;
  }
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
  constructor(
    private rateService: RateService,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      // If the search input is cleared, reset temp to original rows
      this.temp = [...this.rows];
      return;
    }

    this.temp = this.rows.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // this.activeRow = event.row;
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/rates/rate/${this.activeRow.rate_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXRole = true;
            this.getRate();
            this.loadCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.getRate();
            this.loadCompanies();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.getRateByCompany(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getRateByCompany(company_id);
            break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getUserGroupMembers(company_id);
          //   break;
          // case 'PARTNER_ADMIN':
          // case 'PARTNER_MODERATOR':
          //   this.getPartnerMembers(partner_id);
          //   break;
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
    // this.getRate();
  }

  fetchCurrentMonthCount() {
    this.rateService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        console.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  // Load all companies
  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company; // Assuming the API returns a list of companies in 'company'
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  // Filter rates by selected company
  filterByCompany(companyId: number | null) {
    this.selectedCompanyId = companyId;
    if (companyId) {
      this.getRateByCompany(companyId);
    } else {
      this.getRate(); // Load all rates if no company is selected
    }
  }

  getRate() {
    this.rateService.getAllRates().subscribe(
      (data) => {
        this.allRows = data.rates || [];
        this.applyTabFilter();
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getRateByCompany(companyId: number) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        this.allRows = data.rate || [];
        this.applyTabFilter();
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  // 🆕 Nderron tab-in aktual dhe rifreskon listen e shfaqur.
  setRateTab(tab: 'sale' | 'purchase') {
    this.activeRateTab = tab;
    this.applyTabFilter();
  }

  // 🆕 Filtron allRows sipas tab-it aktual (rate_type) dhe e vendos ne rows/temp.
  // Rate-t e vjetra pa rate_type trajtohen si 'sale' (default).
  private applyTabFilter() {
    const filtered = (this.allRows || []).filter((r: any) => {
      const t = r?.rate_type === 'purchase' ? 'purchase' : 'sale';
      return t === this.activeRateTab;
    });
    this.rows = filtered;
    this.temp = [...filtered];
  }

  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const tableData = this.temp.map(rate => [
      rate?.rate_name || 'N/A',
      rate?.percentage || '0',
      rate?.default_price || '0'
    ]);

    autoTable(doc, {
      head: [['Rate Name', 'Percentage', 'Default Price']],
      body: tableData
    });

    doc.save('rates.pdf');
  }

  // 🆕 Export Excel me 2 sheets: "Sale Rates" + "Purchase Rates".
  // Cdo sheet mban vetem rate-t e tipit perkates dhe ka nje rresht totali ne fund.
  // Perdor allRows (jo temp) qe te mos filtrohet nga tab-i aktual.
  exportToExcel() {
    const yesNo = (v: any) => (v === true || v === 1 || v === '1' || v === 'true') ? 'Yes' : 'No';

    const buildSheet = (rates: any[], sheetLabel: string): XLSX.WorkSheet => {
      const rows = rates.map(rate => ({
        'Rate Name': rate.rate_name,
        'Purchase Category': rate.purchase_category || '',
        'Default': yesNo(rate.is_default),
        'Percentage': Number(rate.percentage),
        'Default Price': Number(rate.default_price),
        'Created By': rate.madeBy || '',
        'Modified By': rate.modifiedBy || '',
      }));
      // Rreshti i totalit ne fund per lexim te shpejte.
      const totalRow = {
        'Rate Name': `TOTAL: ${rates.length} ${sheetLabel}`,
        'Purchase Category': '',
        'Default': '',
        'Percentage': '',
        'Default Price': '',
        'Created By': '',
        'Modified By': '',
      };
      const ws = XLSX.utils.json_to_sheet([...rows, totalRow]);
      ws['!cols'] = [
        { wch: 30 }, // Rate Name (me e gjere per totalin)
        { wch: 18 }, // Purchase Category
        { wch: 10 }, // Default
        { wch: 12 }, // Percentage
        { wch: 14 }, // Default Price
        { wch: 16 }, // Created By
        { wch: 16 }, // Modified By
      ];
      return ws;
    };

    // Ndaj rate-t sipas tipit nga allRows (te gjitha, jo vetem tab-i aktual).
    const saleRates = (this.allRows || []).filter(r => (r?.rate_type || 'sale') === 'sale');
    const purchaseRates = (this.allRows || []).filter(r => r?.rate_type === 'purchase');

    const workbook: XLSX.WorkBook = {
      Sheets: {
        'Sale Rates': buildSheet(saleRates, 'Sale Rates'),
        'Purchase Rates': buildSheet(purchaseRates, 'Purchase Rates'),
      },
      SheetNames: ['Sale Rates', 'Purchase Rates'],
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'rates');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';