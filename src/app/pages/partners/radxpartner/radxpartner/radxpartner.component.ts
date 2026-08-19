import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerService } from '../../../../services/partnerService/partner.service'
import { CompanyService } from '../../../../services/companyService/company.service'
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
  selector: 'app-radxpartner',
  templateUrl: './radxpartner.component.html',
  styles: [
  ]
})
export class RadxpartnerComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

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
  currentMonthCountEntry: number = 0;
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
    private partnerService: PartnerService,
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
      this.router.navigate([`/partners/partner/${this.activeRow.partner_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    // this.loadCompanies();
    //   this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXRole = true;
            this.getPartners();
            this.loadCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.getPartners();
            this.loadCompanies();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.getPartnersByCompany(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getPartnersByCompany(company_id);
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
    // this.getPartners()
  }
  fetchCurrentMonthCount() {
    this.companyService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
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
        logger.log(error);
      }
    );
  }

  // Filter partners based on the selected company
  filterByCompany(companyId: number) {
    this.selectedCompanyId = companyId;
    if (companyId) {
      this.partnerService.getPartnerByCompany(companyId).subscribe(
        (data) => {
          this.rows = data.partner; // Assuming the API returns the filtered partners
          this.temp = [...this.rows];
        },
        (error) => {
          this.errorMessage = error.message;
          logger.log(error);
        }
      );
    } else {
      this.getPartners(); // Load all partners if no company is selected
    }
  }

  getPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.rows = data.partners;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }

  getPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        this.rows = data.partner;
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
    const tableData = this.temp.map(partner => [
      partner?.partner_name || 'N/A',
      partner?.nipt || 'N/A',
      partner?.email || 'N/A',
      partner?.phone_number || 'N/A',
      partner?.address || 'N/A',
      partner?.city || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Partner Name', 'NIPT', 'Email', 'Phone Number', 'Address', 'City']],
      body: tableData,
      margin: { left: 5 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 27 },
        2: { cellWidth: 48 },
        3: { cellWidth: 27 },
        4: { cellWidth: 40 },
        5: { cellWidth: 25 }
      }
    });

    doc.save('partners.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    // 🆕 Fusha e re `energy_invoicing_source` mban direkt stringun (OSHEE/PARTNER/INDIPENDENT),
    // keshtu qe Excel-i shfaq direkt vleren; nese eshte null -> bosh.
    const invoicedBy = (v: any) => v || '';

    const headers = [
      'Name', 'Nipt', 'Email', 'Phone Number', 'Address', 'City',
      'Monthly Platform Fee', 'Split %', 'AC Split %', 'DC Split %',
      'Energy Invoiced By', 'Vendor Number'
    ];

    const rows = this.temp.map(partner => ([
      partner.partner_name || '',
      partner.nipt || '',
      partner.email || '',
      partner.phone_number || '',
      partner.address || '',
      partner.city || '',
      partner.monthly_platform_fee != null ? partner.monthly_platform_fee : '',
      partner.split_percentage != null ? partner.split_percentage : '',
      partner.ac_split_percentage != null ? partner.ac_split_percentage : '',
      partner.dc_split_percentage != null ? partner.dc_split_percentage : '',
      invoicedBy(partner.energy_invoicing_source),
      partner.vendor_number || '',
    ]));

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: 'A2' });
    worksheet['!cols'] = [
      { wch: 22 }, // Name
      { wch: 14 }, // Nipt
      { wch: 28 }, // Email
      { wch: 16 }, // Phone
      { wch: 30 }, // Address
      { wch: 14 }, // City
      { wch: 20 }, // Monthly Platform Fee
      { wch: 10 }, // Split %
      { wch: 12 }, // AC Split %
      { wch: 12 }, // DC Split %
      { wch: 18 }, // Energy Invoiced By
      { wch: 20 }, // Vendor Number
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Partners': worksheet },
      SheetNames: ['Partners']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'partners');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';