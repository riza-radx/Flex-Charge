import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargingStatusService } from "../../../../services/chargingStatusService/charging-status.service";
import { CompanyService } from "../../../../services/companyService/company.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";

import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
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
  selector: 'app-radxlocations',
  templateUrl: './radxlocations.component.html',
  styles: [
  ]
})
export class RadxlocationsComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;
  currentMonthCountEntry: number = 0;
  companies: any[] = [];
  partners: any[] = [];
  selectedCompany: string = '';
  selectedPartner: string = '';
  // Client-side company filter (used by COMPANY_* roles to filter among
  // own + roaming partner companies returned by the backend).
  selectedCompanyFilter: string = '';
  companyOptions: { id: any; name: string }[] = [];

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
  company_id: any;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
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
    private chargerLocationService: ChargerLocationService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
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
      this.router.navigate([`/assets/locations/${this.activeRow.location_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    // this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getLocations();
            this.loadAllCompanies();
            this.loadAllPartners();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getLocations();
            this.loadAllPartners();
            break;
          case 'COMPANY_ADMIN':
            // 🆕 Set isCompanyAdmin qe kolona Vendor Number OSHEE (dhe gates te tjere admin-only) te aktivizohen.
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getLocationsByCompany();
            this.loadAllPartnersByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.isCompanyRole = true;
            this.getLocationsByCompany();
            this.loadAllPartnersByCompany(this.company_id);
            // this.getCurrencies(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getLocationsByCompany();
            this.loadAllPartnersByCompany(this.company_id);
            break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getTaxesByByUserGroup(usergroup_id);
          //   break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getLocationsByPartner(partner_id);
            break;
          // case 'USER':
          case 'COMPANY_USER':
          // case 'SUPER_USER':
          // this.getTaxesByByUser(user_id);
          // // this.getCurrencies(company_id);
          // break;
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
    // this.getLocations()
  }

  // Load companies for dropdown
  loadAllCompanies() {
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
    this.chargerLocationService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  // Load partners for dropdown
  loadAllPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data.partners;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  // Load partners for dropdown
  loadAllPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        this.partners = data.partner;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }


  getLocations() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    this.chargerLocationService.getAllChargerLocations(filters).subscribe(
      (data) => {
        logger.log(data);
        if (Array.isArray(data.location)) {
          this.rows = data.location;
          this.rebuildCompanyOptions();
          this.applyCompanyFilter();
        } else {
          logger.error('Unexpected data structure:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getLocationsByCompany() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    this.chargerLocationService.getChargerLocationByCompany(this.company_id, filters).subscribe(
      (data) => {
        logger.log(data);
        if (Array.isArray(data.location)) {
          this.rows = data.location;
          this.rebuildCompanyOptions();
          this.applyCompanyFilter();
        } else {
          logger.error('Unexpected data structure:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getLocationsByPartner(partnerId: number) {
    this.chargerLocationService.getChargerLocationByPartner(partnerId).subscribe(
      (data) => {
        logger.log(data);
        if (Array.isArray(data.location)) {
          this.rows = data.location;
          this.rebuildCompanyOptions();
          this.applyCompanyFilter();
        } else {
          logger.error('Unexpected data structure:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // Build dropdown options from the unique companies present in the loaded
  // rows. For COMPANY_* roles this naturally yields "own + roaming partners".
  private rebuildCompanyOptions() {
    const map = new Map<any, string>();
    for (const row of this.rows || []) {
      const id = row?.Company?.company_id ?? row?.company_id;
      const name = row?.Company?.company_name;
      if (id != null && name && !map.has(id)) {
        map.set(id, name);
      }
    }
    this.companyOptions = Array.from(map, ([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  applyCompanyFilter() {
    if (!this.selectedCompanyFilter) {
      this.temp = [...this.rows];
      return;
    }
    this.temp = this.rows.filter((d: any) => {
      const id = d?.Company?.company_id ?? d?.company_id;
      return String(id) === String(this.selectedCompanyFilter);
    });
  }

  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const tableData = this.temp.map(location => [
      location?.location_name || 'N/A',
      location?.addres || 'N/A',
      location?.city || 'N/A',
      location?.country || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Location Name', 'Address', 'City', 'Country']],
      body: tableData
    });

    doc.save('locations.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    // 🆕 Vendor Number OSHEE — vetem COMPANY_ADMIN + COMPANY_ANALYST e shohin ne Excel.
    const canSeeVendor = this.isCompanyAdmin || this.isCompanyAnalyst;
    const filteredData = this.temp.map(location => {
      const row: any = {
        location_name: location.location_name,
        address: location.addres,
        city: location.city,
        country: location.country,
      };
      if (canSeeVendor) {
        row['Vendor Number OSHEE'] = location.vendor_number_oshee || '';
      }
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Locations': worksheet },
      SheetNames: ['Locations']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'locations');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

