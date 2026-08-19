import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromoService } from "../../../../services/promoService/promo.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
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
  selector: 'app-radxpromo',
  templateUrl: './radxpromo.component.html',
  styles: [
  ]
})
export class RadxpromoComponent implements OnInit {
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
    private promoService: PromoService,
    private companyService: CompanyService,
    private router: Router) {
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
      this.router.navigate([`/rates/promo/${this.activeRow.promo_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
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
            this.getPromo();
            this.loadCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.getPromo();
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
            this.getPromoByCompany(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getPromoByCompany(company_id);
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
            logger.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        logger.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      logger.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    // this.getPromo()
  }

  // Load all companies
  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company; // Assuming the API returns a list of companies in 'company'
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  fetchCurrentMonthCount() {
    this.promoService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }

  // Filter rates by selected company
  filterByCompany(companyId: number | null) {
    this.selectedCompanyId = companyId;
    if (companyId) {
      this.getPromoByCompany(companyId);
    } else {
      this.getPromo(); // Load all rates if no company is selected
    }
  }

  getPromo() {
    this.promoService.getAllPromos().subscribe(
      (data) => {
        this.rows = data.promos.map(promo => ({
          ...promo,

          is_enabled: promo.is_enabled === 1 || promo.is_enabled === true ? 'Yes' : 'No'

        }));
        this.temp = [...this.rows];
        logger.log(this.rows);

        this.rows.forEach((row, index) => {
          this.companyService.getCompany(row.company_id).subscribe(
            (companyData) => {
              this.rows[index].company = companyData.company.company_name;
            },
            (error) => {
              this.errorMessage = error.message;
              logger.log(error);
            }
          );
        });
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getPromoByCompany(companyId: number) {
    this.promoService.getPromoByCompany(companyId).subscribe(
      (data) => {
        this.rows = data.promo.map(promo => ({
          ...promo,

          is_enabled: promo.is_enabled === 1 || promo.is_enabled === 'true' ? 'Yes' : 'No'

        }));
        this.temp = [...this.rows];
        logger.log(this.rows);

        this.rows.forEach((row, index) => {
          this.companyService.getCompany(row.company_id).subscribe(
            (companyData) => {
              this.rows[index].company = companyData.company.company_name;
            },
            (error) => {
              this.errorMessage = error.message;
              logger.log(error);
            }
          );
        });
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }


  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const tableData = this.temp.map(promo => [
      promo?.promo_name || 'N/A',
      promo?.promo_code || 'N/A',
      promo?.discount_percentage || '0',
      promo?.amount || '0',
      promo?.is_enabled !== undefined ? (promo?.is_enabled ? 'Enabled' : 'Disabled') : 'N/A'
    ]);

    autoTable(doc, {
      head: [['Promo Name', 'Promo Code', 'Discount Percentage', 'Amount', 'Is Enabled']],
      body: tableData
    });

    doc.save('promos.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    const filteredData = this.temp.map(promo => ({
      promo_name: promo.promo_name,
      promo_code: promo.promo_code,
      discount_percentage: promo.discount_percentage,
      amount: promo.amount,
      is_enabled: promo.is_enabled
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Promos': worksheet },
      SheetNames: ['Promos']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'promos');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';