import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { CompanyService } from "../../../../services/companyService/company.service";
// 🆕 Per filter panel-in Partner dhe kolonen e re Partner ne list.
import { PartnerService } from "../../../../services/partnerService/partner.service";
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
  selector: 'app-radxusergroup',
  templateUrl: './radxusergroup.component.html',
  styles: [
  ]
})
export class RadxusergroupComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  companies: any[] = [];
  selectedCompanyId: number | null = null;
  cities: string[] = []; // Store the cities for filtering
  countries: string[] = []; // Store the countries for filtering
  selectedCity: string = ''; // To hold the selected city
  selectedCountry: string = ''; // To hold the selected country
  rows: any = [];
  SelectionType = SelectionType;
  currentMonthCountEntry: number = 0;
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
  selectedAllowPayAsYouGo: string = ''; // or null
  selectedSplitWallet: string = ''; // or null
  // 🆕 Filter Partner — lista e partnereve te kompanise + partneri i zgjedhur.
  partners: any[] = [];
  selectedPartner: number | null = null;
  company_id: any;

  // 🆕 Kontroll roli per kolonen `Vega Staff` — vetem admin/analyst e shohin ne tabele + excel.
  get canManageVegaStaff(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'radxadmin'
      || role === 'radxmoderator'
      || role === 'companyadmin'
      || role === 'superuser'
      || role === 'companyanalyst';
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

  constructor(private userGroupService: UserGroupService, private companyService: CompanyService, private partnerService: PartnerService, private router: Router) {
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
      this.router.navigate([`/users/usergroup/${this.activeRow.usergr_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      // 🆕 Ngarko partneret e kompanise per filter dropdown-in (per Company Admin/Analyst/RadX).
      if (this.company_id) {
        this.loadPartnersByCompany(this.company_id);
      }

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getUserGroups();
            this.loadCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getUserGroups();
            this.loadCompanies();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.getUserGroupsByCompany();
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyOperator = true;
            this.getUserGroupsByCompany();
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyModerator = true;
            this.getUserGroupsByCompany();
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyTechnicalOperator = true;
            this.getUserGroupsByCompany();
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyMaintenanceSpecialist = true;
            this.getUserGroupsByCompany();
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyCallCenter = true;
            this.getUserGroupsByCompany();
            break;

          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.getUserGroupsByCompany();
            break;
          case 'COMPANY_ANALYST':
            this.getUserGroupsByCompany();
            this.isCompanyAnalyst = true
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
    // this.getUserGroups()
    // console.log("rows",this.rows)
  }

  // getUserGroups() {
  //   this.userGroupService.getAllUserGroups().subscribe(
  //     (data) => {
  //       this.rows = data.userGroupMembers;
  //       this.temp = [...this.rows];
  //       console.log(this.rows);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }
  // Load all companies
  fetchCurrentMonthCount() {
    this.userGroupService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
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

  // 🆕 Ngarko partneret aktive te kompanise per filter dropdown-in ne headers.
  loadPartnersByCompany(companyId: string | number) {
    this.partnerService.getPartnerByCompany(companyId as any).subscribe(
      (data: any) => {
        const raw = data?.partner ?? data?.partners ?? [];
        this.partners = raw.filter((p: any) =>
          p?.partner_status === 'true' || p?.partner_status === true || p?.partner_status === undefined
        );
      },
      (error) => {
        logger.log("Error fetching partners for filter:", error);
      }
    );
  }

  // 🆕 Rifresko listen kur ndryshon filter-i i partnerit.
  // Perdor rrugen e pershtatshme sipas rolit (RadX vs Company).
  onPartnerFilterChange() {
    if (this.isRadXRole) {
      this.getUserGroups();
    } else {
      this.getUserGroupsByCompany();
    }
  }
  getUserGroups() {
    // 🆕 Perfshi filter partner_id nese eshte zgjedhur nga dropdown-i (per RadX role).
    const filters: any = {};
    if (this.selectedPartner != null) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedAllowPayAsYouGo !== '') {
      filters.allow_pay_as_you_go = this.selectedAllowPayAsYouGo;
    }
    if (this.selectedSplitWallet !== '') {
      filters.split_wallet = this.selectedSplitWallet;
    }
    this.userGroupService.getAllUserGroups(filters).subscribe(
      (data) => {
        // Check if the response has the expected structure
        if (data.success && Array.isArray(data.userGroup)) {
          this.rows = data.userGroup;  // Access the userGroup array from the response
          // console.log("rows", this.rows)
          this.temp = [...this.rows];
          this.cities = data.cities.map((cityObj: any) => cityObj.usergr_city);
          this.countries = data.countries.map((countryObj: any) => countryObj.usergr_country);
        } else {
          logger.error('Unexpected data format:', data);
          this.rows = [];
          this.temp = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log('Error fetching user groups:', error);
      }
    );
  }

  // Filter partners based on the selected company
  filterByCompany(companyId: number) {
    this.selectedCompanyId = companyId;
    if (companyId) {
      this.userGroupService.getUserGroupByCompany(companyId).subscribe(
        (data) => {
          this.rows = data.userGroup; // Assuming the API returns the filtered partners
          this.temp = [...this.rows];
        },
        (error) => {
          this.errorMessage = error.message;
          logger.log(error);
        }
      );
    } else {
      this.getUserGroups(); // Load all partners if no company is selected
    }
  }

  // getUserGroupsByCompany(companyID: number) {
  //   // Retrieve companyID from local storage
  //   // const companyID = localStorage.getItem('cugpCred.companyID');
  //   this.userGroupService.getUserGroupByCompany(companyID).subscribe(
  //     (data) => {
  //       // Check if the response has the expected structure
  //       if (data.success && Array.isArray(data.userGroup)) {
  //         this.rows = data.userGroup;  // Access the userGroup array from the response
  //         this.temp = [...this.rows];
  //       } else {
  //         console.error('Unexpected data format:', data);
  //         this.rows = [];
  //         this.temp = [];
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log('Error fetching user groups:', error);
  //     }
  //   );
  // }
  getUserGroupsByCompany() {
    const filters: any = {};

    if (this.selectedAllowPayAsYouGo !== '') {
      filters.allow_pay_as_you_go = this.selectedAllowPayAsYouGo;
    }

    if (this.selectedSplitWallet !== '') {
      filters.split_wallet = this.selectedSplitWallet;
    }

    // 🆕 Filter partner_id (opsional). null = All Partners.
    if (this.selectedPartner != null) {
      filters.partner_id = this.selectedPartner;
    }

    this.userGroupService.getUserGroupByCompany(this.company_id, filters).subscribe(
      (data) => {
        if (data.success && Array.isArray(data.userGroup)) {
          this.rows = data.userGroup;
          this.temp = [...this.rows];
          // console.log("data.userGroup", data.userGroup)
        } else {
          logger.error('Unexpected data format:', data);
          this.rows = [];
          this.temp = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log('Error fetching user groups:', error);
      }
    );
  }


  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const filteredData = this.temp.map(userGroup => ({
      name: userGroup.usergr_name,
      address: userGroup.usergr_addres,
      city: userGroup.usergr_city,
      country: userGroup.usergr_country,
      email: userGroup.usergr_email,
      phone_number: userGroup.usergr_phone_no
    }));

    autoTable(doc, {
      head: [['Name', 'Address', 'City', 'Country', 'Email', 'Phone']],
      body: filteredData.map(userGroup => [
        userGroup.name, // Corrected access to property names
        userGroup.address,
        userGroup.city,
        userGroup.country,
        userGroup.email,
        userGroup.phone_number
      ]),
      margin: { left: 5 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 48 },
        5: { cellWidth: 27 }
      }
    });

    doc.save('user_group.pdf');
  }

  // Export the relevant fields to Excel
  // exportToExcel() {
  //   const filteredData = this.temp.map(userGroup => ({
  //     name: userGroup.usergr_name,
  //     address: userGroup.usergr_addres,
  //     city: userGroup.usergr_city,
  //     country: userGroup.usergr_country,
  //     email: userGroup.usergr_email,
  //     phone_number: userGroup.usergr_phone_no,
  //     customer_number: userGroup.customer_number,
  //     dimension_value: userGroup.dimension_value,
  //     send_invoice_by_email:
  //       (userGroup.send_invoice_by_email === 1 || userGroup.send_invoice_by_email === true)
  //         ? 'Yes'
  //         : 'No',
  //   }));

  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'UserGroups': worksheet },
  //     SheetNames: ['UserGroups']
  //   };

  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, 'user_groups');
  // }
  exportToExcel() {
    // 🆕 Kolona e re "Partner" — pas Company (rendi natyror ne raport).
    // 🆕 Kolona "Vega Staff" perfshihet vetem kur thirresi eshte admin/analyst.
    const headers = [
      'Name',
      'Address',
      'City',
      'Country',
      'Email',
      'Phone Number',
      'Company',
      'Partner',
      'Rate',
      'Balance',
      'Debit Balance',
      'Send Invoice By Email',
      'Customer Number',
      'Dimension KLIENT/FURNITOR',
      'Allow Pay-As-You-Go',
      'Check Fisk',
      ...(this.canManageVegaStaff ? ['Vega Staff'] : []),
      'Send Email',
      'Split Wallet'
    ];

    const toYesNo = (val: any) =>
      (val === 1 || val === true || val === '1' || val === 'true') ? 'Yes' : 'No';

    const rows = this.temp.map(userGroup => ([
      userGroup.usergr_name || '',
      userGroup.usergr_addres || '',
      userGroup.usergr_city || '',
      userGroup.usergr_country || '',
      userGroup.usergr_email || '',
      userGroup.usergr_phone_no || '',

      userGroup.company_name || '',
      userGroup.partner_name || '', // 🆕 vjen nga LEFT JOIN i backend; bosh nese grupi s'ka partner.
      userGroup.rate_name || '',
      userGroup.balance != null ? userGroup.balance : '',
      userGroup.debit_balance != null ? userGroup.debit_balance : '',

      toYesNo(userGroup.send_invoice_by_email),

      userGroup.customer_number || '',
      userGroup.dimension_value || '',

      toYesNo(userGroup.allow_pay_as_you_go),
      toYesNo(userGroup.check_fisk),
      // 🆕 Vega Staff — perfshihet vetem kur admin/analyst e ekzekuton exportin.
      ...(this.canManageVegaStaff ? [toYesNo(userGroup.is_vega_staff)] : []),
      toYesNo(userGroup.send_invoice_by_email),
      toYesNo(userGroup.split_wallet)
    ]));

    // Krijo sheet bosh
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Shto header në rreshtin e parë
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    // Shto të dhënat nga rreshti i dytë
    XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: 'A2' });

    // Vendos width të kolonave (opsionale por stabilizon rendin në Excel)
    worksheet['!cols'] = [
      { wch: 20 }, // Name
      { wch: 25 }, // Address
      { wch: 15 }, // City
      { wch: 15 }, // Country
      { wch: 25 }, // Email
      { wch: 18 }, // Phone
      { wch: 20 }, // Company
      { wch: 20 }, // Partner 🆕
      { wch: 18 }, // Rate
      { wch: 12 }, // Balance
      { wch: 14 }, // Debit Balance
      { wch: 20 }, // Send invoice
      { wch: 20 }, // Customer number
      { wch: 28 }, // Dimension
      { wch: 20 }, // Allow Pay-As-You-Go
      { wch: 12 }, // Check Fisk
      // 🆕 Vega Staff — width e vecante, opsionale sipas rolit.
      ...(this.canManageVegaStaff ? [{ wch: 12 }] : []),
      { wch: 12 }, // Send Email
      { wch: 14 }  // Split Wallet
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'UserGroups': worksheet },
      SheetNames: ['UserGroups']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'user_groups');
  }



  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';