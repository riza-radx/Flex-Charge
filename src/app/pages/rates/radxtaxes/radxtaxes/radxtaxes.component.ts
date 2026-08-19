import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaxService } from "../../../../services/taxService/tax.service";
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
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';


@Component({
  selector: 'app-radxtaxes',
  templateUrl: './radxtaxes.component.html',
  styles: [
  ]
})
export class RadxtaxesComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  errorMessage: any;
  activeRow: any;
  rows: any = [];
  companies: any[] = [];
  SelectionType = SelectionType;
  currentMonthCountEntry: number = 0;
  userRole: string | null = null;
  isRadXRole: boolean = false;
  isRadXAdmin: boolean = false;
  isRadXModerator: boolean = false;
  isSuperUser: boolean = false;
  isCompanyRole: boolean = false;
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
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  company_id: any;
  partner_id: any;
  usergroup_id: any;
  user_id: any;
  userGroups: any[] = [];

  selectedCompany: string = '';
  selectedUserGroup: string = '';
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
    private taxService: TaxService,
    private router: Router,
    private userGroupService: UserGroupService,
    private companyService: CompanyService,) {
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
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // this.activeRow = event.row;
    this.activeRow = event.row;
    // if (event.type === 'click') {
    //   this.router.navigate([`/rates/taxes/${this.activeRow.tax_id}`]);  // Navigate to company details page
    // }
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


  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getTaxes();
            this.loadCompanies();
            this.loadUserGroups();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getTaxes();
            this.loadCompanies();
            this.loadUserGroups();
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
            this.isCompanyRole = true;
            this.getTaxesByCompany();
            this.loadUserGroupsByCompany(this.company_id);
            // this.getCurrencies(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getTaxesByCompany();
            this.loadUserGroupsByCompany(this.company_id);
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            this.getTaxesByByUserGroup();
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.getTaxesByByPartner();
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.getTaxesByByUser();
            // this.getCurrencies(company_id);
            break;
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
    // this.getTaxes()
  }
  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  fetchCurrentMonthCount() {
    this.taxService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data) => {
        this.userGroups = data.userGroup;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data) => {
        this.userGroups = data.userGroup;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getTaxes() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }

    this.taxService.getAllTaxes(filters).subscribe(
      (data) => {
        this.rows = data.taxes;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }


  getTaxesByCompany() {
    const filters: any = {};
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    this.taxService.getTaxByCompany(this.company_id, filters).subscribe(
      (data) => {
        this.rows = data.tax;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getTaxesByByPartner() {
    this.taxService.getTaxByPartner(this.partner_id).subscribe(
      (data) => {
        this.rows = data.tax;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getTaxesByByUserGroup() {
    this.taxService.getTaxByUserGroup(this.usergroup_id).subscribe(
      (data) => {
        this.rows = data.tax;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getTaxesByByUser() {
    this.taxService.getTaxByUser(this.user_id).subscribe(
      (data) => {
        this.rows = data.tax;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }

  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const tableData = this.temp.map(tax => [
      tax?.tax_name || 'N/A',
      tax?.taxIdentificationNumber || 'N/A',
      tax?.percentage || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Tax Name', 'Tax Identification Number', 'Percentage']],
      body: tableData
    });

    doc.save('taxes.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    const filteredData = this.temp.map(tax => ({
      tax_name: tax.tax_name,
      taxIdentificationNumber: tax.taxIdentificationNumber,
      percentage: Number(tax.percentage).toFixed(2)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Taxes': worksheet },
      SheetNames: ['Taxes']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'taxes');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';