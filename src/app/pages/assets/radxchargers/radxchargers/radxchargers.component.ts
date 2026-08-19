import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { CompanyService } from "../../../../services/companyService/company.service"; // Service to load companies
import { PartnerService } from "../../../../services/partnerService/partner.service"; // Service to load partners

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
  selector: 'app-radxchargers',
  templateUrl: './radxchargers.component.html',
  styles: [
  ]
})
export class RadxchargersComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;
  isPopupVisible = false;
  currentMonthCountEntry: number = 0;
  //  // Add new properties to store filter values
  //  companies: any[] = [];
  //  partners: any[] = [];
  //  selectedCompany: number | null = null;
  //  selectedPartner: number | null = null;
  // Filter options
  companies: any[] = [];
  partners: any[] = [];
  selectedCompany: number | null = null;
  selectedPartner: number | null = null;
  selectedType: string | null = null; // AC or DC
  selectedStatus: string | null = null; // Enable, Disable, Demo, Out Of Order
  selectedOcppProtocol: string | null = null; // 1.6 or 2.1
  selectedMaxVoltage: string | null = null; // 230V, 380V, 400V, 480V
  selectedPhase: string | null = null; // SinglePhase, SplitPhase, ThreePhases
  selectedPhaseRotation: string | null = null; // RST, RTS, SRT, STR, TRS, TSR

  // Options for filtering
  types = ['AC', 'DC'];
  statuses = ['Available', 'Offline', 'Charging', 'Reserved', 'In Use', 'Preparing', 'Enable', 'Disable', 'Demo', 'Out Of Order'];
  ocppProtocols = ['1.6', '2.1'];
  maxVoltages = ['230V', '380V', '400V', '480V'];
  phases = ['SinglePhase', 'SplitPhase', 'ThreePhases'];
  phaseRotations = ['RST', 'RTS', 'SRT', 'STR', 'TRS', 'TSR'];

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
  partner_id: any;
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
    private chargerService: ChargerService,
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
  // filterTable($event: any) {
  //   const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case insensitive search
  //   this.temp = this.rows.filter((d) => {
  //     // Check if any of the properties in the object match the search value
  //     return Object.keys(d).some(key => {
  //       if (typeof d[key] === 'string') {
  //         return d[key].toLowerCase().includes(val); // Check if the property contains the search value
  //       }
  //       return false; // Return false for non-string properties
  //     });
  //   });
  // }

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
      this.router.navigate([`/assets/chargers/${this.activeRow.charger_id}`]);  // Navigate to company details page
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
      this.partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getChargers();
            this.loadCompanies();
            this.loadPartners();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getChargers();
            this.loadCompanies();
            this.loadPartners();
            break;
          case 'COMPANY_ADMIN':
            // 🆕 Set isCompanyAdmin qe kolonat G/L (dhe elemente te tjere gated per admin) te shfaqen.
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getChargersByCompany();
            this.loadPartnersByCompany(this.company_id);
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
            this.getChargersByCompany();
            this.loadPartnersByCompany(this.company_id);
            // this.getCurrencies(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getChargersByCompany();
            this.loadPartnersByCompany(this.company_id);
            break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getTaxesByByUserGroup(usergroup_id);
          //   break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getChargersByPartner();
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
    // this.getChargers()
  }
  fetchCurrentMonthCount() {
    this.chargerService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  getChargers() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedType) {
      filters.type = this.selectedType;
    }
    if (this.selectedStatus) {
      filters.status = this.selectedStatus;
    }
    if (this.selectedOcppProtocol) {
      filters.ocpp_protocol = this.selectedOcppProtocol;
    }
    if (this.selectedMaxVoltage) {
      filters.max_voltage = this.selectedMaxVoltage;
    }
    if (this.selectedPhase) {
      filters.phase = this.selectedPhase;
    }
    if (this.selectedPhaseRotation) {
      filters.phase_rotation = this.selectedPhaseRotation;
    }

    // this.chargerService.getAllChargers(filters).subscribe(
    //   (data) => {
    //     // Transform the `valid` field
    //     this.rows = data.chargers.map((charger: any) => ({
    //       ...charger,
    //       valid: charger.valid === 1 ? 'No' : 'Yes',
    //     }));
    //     this.temp = [...this.rows];
    //     console.log("chargers: ",this.rows);
    //   },
    //   (error) => {
    //     this.errorMessage = error.message;
    //     console.log(error);
    //   }
    // );
    this.chargerService.getAllChargers(filters).subscribe(
      (data) => {
        this.rows = data.chargers.map((charger: any, index: number) => ({
          ...charger,
          id: index,
          valid: charger.valid === 1 ? 'No' : 'Yes',

          // Flatten connector fields
          connector1Type: charger.Connectors?.[0]?.standard || 'N/A',
          connector1Status: charger.Connectors?.[0]?.status || 'N/A',
          connector2Type: charger.Connectors?.[1]?.standard || 'N/A',
          connector2Status: charger.Connectors?.[1]?.status || 'N/A',
        }));

        this.temp = [...this.rows];
        logger.log("chargers: ", this.rows);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getChargersByCompany() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedType) {
      filters.type = this.selectedType;
    }
    if (this.selectedStatus) {
      filters.status = this.selectedStatus;
    }
    if (this.selectedOcppProtocol) {
      filters.ocpp_protocol = this.selectedOcppProtocol;
    }
    if (this.selectedMaxVoltage) {
      filters.max_voltage = this.selectedMaxVoltage;
    }
    if (this.selectedPhase) {
      filters.phase = this.selectedPhase;
    }
    if (this.selectedPhaseRotation) {
      filters.phase_rotation = this.selectedPhaseRotation;
    }
    // this.chargerService.getChargerByCompany(this.company_id, filters).subscribe(
    //   (data) => {
    //     this.rows = data.charger.map((charger: any) => ({
    //       ...charger,
    //       valid: charger.valid === 1 ? 'No' : 'Yes',
    //     }));
    //     this.temp = [...this.rows];
    //     console.log(this.rows);

    //   },
    //   (error) => {
    //     this.errorMessage = error.message
    //     console.log(error);

    //   }
    // )
    this.chargerService.getChargerByCompany(this.company_id, filters).subscribe(
      (data) => {
        this.rows = data.charger.map((charger: any, index: number) => ({
          ...charger,
          id: index,
          valid: charger.valid === 1 ? 'No' : 'Yes',

          // Flatten connector fields for sorting
          connector1Type: charger.Connectors?.[0]?.standard || 'N/A',
          connector1Status: charger.Connectors?.[0]?.status || 'N/A',
          connector2Type: charger.Connectors?.[1]?.standard || 'N/A',
          connector2Status: charger.Connectors?.[1]?.status || 'N/A',
        }));

        this.temp = [...this.rows];
        logger.log(this.rows); // Now includes flattened connector fields
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );

  }
  getChargersByPartner() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedType) {
      filters.type = this.selectedType;
    }
    if (this.selectedStatus) {
      filters.status = this.selectedStatus;
    }
    if (this.selectedOcppProtocol) {
      filters.ocpp_protocol = this.selectedOcppProtocol;
    }
    if (this.selectedMaxVoltage) {
      filters.max_voltage = this.selectedMaxVoltage;
    }
    if (this.selectedPhase) {
      filters.phase = this.selectedPhase;
    }
    if (this.selectedPhaseRotation) {
      filters.phase_rotation = this.selectedPhaseRotation;
    }
    // this.chargerService.getChargerByPartner(this.partner_id, filters).subscribe(
    //   (data) => {
    //     this.rows = data.charger.map((charger: any) => ({
    //       ...charger,
    //       valid: charger.valid === 1 ? 'No' : 'Yes',
    //     }));
    //     this.temp = [...this.rows];
    //     console.log(this.rows);

    //   },
    //   (error) => {
    //     this.errorMessage = error.message
    //     console.log(error);

    //   }
    // )
    this.chargerService.getChargerByPartner(this.partner_id, filters).subscribe(
      (data) => {
        this.rows = data.charger.map((charger: any, index: number) => ({
          ...charger,
          id: index,
          valid: charger.valid === 1 ? 'No' : 'Yes',

          // Flatten connector fields for sorting
          connector1Type: charger.Connectors?.[0]?.standard || 'N/A',
          connector1Status: charger.Connectors?.[0]?.status || 'N/A',
          connector2Type: charger.Connectors?.[1]?.standard || 'N/A',
          connector2Status: charger.Connectors?.[1]?.status || 'N/A',
        }));

        this.temp = [...this.rows];
        logger.log(this.rows); // Confirm connector fields are present
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );

  }

  // Load companies for dropdown
  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company; // Adjust based on your API response
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // Load partners for dropdown
  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data.partners; // Adjust based on your API response
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  // Load partners for dropdown
  loadPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        this.partners = data.partner; // Adjust based on your API response
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // Export the relevant fields to PDF
  // exportToPDF() {
  //   const doc = new jsPDF();
  //   const tableData = this.rows.map(charger => [
  //     charger.charger_name,
  //     charger.current_type,
  //     charger.max_amperage,
  //     charger.max_power,
  //     charger.max_voltage,
  //     charger.no_of_connectors,
  //     charger.ocpp_id,
  //     charger.ocpp_protocol,
  //     charger.phase,
  //     charger.phase_rotation,
  //     charger.rate_power,
  //     charger.status,
  //     charger.type
  //   ]);

  //   autoTable(doc, {
  //     head: [['Charger Name', 'Current Type', 'Max Amperage', 'Max Power', 'Max Voltage', 'No of Connectors', 'OCPP ID', 'OCPP Protocol', 'Phase', 'Phase Rotation', 'Rate Power', 'Status', 'Type']],
  //     body: tableData
  //   });

  //   doc.save('chargers.pdf');
  // }
  exportToPDF() {
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF('l', 'mm', 'a4');  // 'l' for landscape, 'mm' for millimeters, 'a4' size

    // Data for the table (unchanged)
    const tableData = this.temp.map(charger => [
      charger?.charger_name || 'N/A',
      charger?.current_type || 'N/A',
      charger?.max_amperage || 'N/A',
      charger?.max_power || 'N/A',
      charger?.max_voltage || 'N/A',
      charger?.no_of_connectors || 'N/A',
      charger?.ocpp_id || 'N/A',
      charger?.ocpp_protocol || 'N/A',
      charger?.phase || 'N/A',
      charger?.phase_rotation || 'N/A',
      charger?.rate_power || 'N/A',
      charger?.status || 'N/A',
      charger?.type || 'N/A'
    ]);

    // Shortened column headers
    const headers = [
      'Charger Name',
      'Curr Type',
      'Max Amp',
      'Max Pow',
      'Max Volt',
      'Connectors',
      'OCPP ID',
      'OCPP Prot',
      'Phase',
      'Phase Rot',
      'Rate Pow',
      'Status',
      'Type'
    ];

    // Column widths, fixed values to avoid excessive space
    const columnWidths = [
      30, 20, 20, 20, 20, 25, 25, 30, 20, 20, 20, 20, 20  // Adjust these widths as per your needs
    ];

    // Set up autoTable with the column widths
    autoTable(doc, {
      head: [headers],
      body: tableData,
      columnStyles: {
        0: { cellWidth: columnWidths[0] },  // Charger Name
        1: { cellWidth: columnWidths[1] },  // Curr Type
        2: { cellWidth: columnWidths[2] },  // Max Amp
        3: { cellWidth: columnWidths[3] },  // Max Pow
        4: { cellWidth: columnWidths[4] },  // Max Volt
        5: { cellWidth: columnWidths[5] },  // Connectors
        6: { cellWidth: columnWidths[6] },  // OCPP ID
        7: { cellWidth: columnWidths[7] },  // OCPP Prot
        8: { cellWidth: columnWidths[8] },  // Phase
        9: { cellWidth: columnWidths[9] },  // Phase Rot
        10: { cellWidth: columnWidths[10] }, // Rate Pow
        11: { cellWidth: columnWidths[11] }, // Status
        12: { cellWidth: columnWidths[12] }, // Type
      },
      margin: { left: 5 },
    });

    // Save the PDF as 'chargers.pdf'
    doc.save('chargers.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    // 🆕 G/L accounts (BC) shfaqen VETEM per COMPANY_ADMIN + COMPANY_ANALYST.
    const canSeeGL = this.isCompanyAdmin || this.isCompanyAnalyst;
    const filteredData = this.temp.map(charger => {
      const row: any = {
        'Charger Name': charger.charger_name,
        'Type': charger.type,
        'Current Type': charger.current_type,
        'Status': charger.status,
        'Max Amperage': Number(charger.max_amperage), // Make sure these are numbers
        'Max Power (kW)': Number(charger.max_power),
        'Max Voltage (V)': Number(charger.max_voltage),
        'Rate Power (kW)': Number(charger.rate_power),
        'No. of Connectors': Number(charger.no_of_connectors),
        'OCPP ID': charger.ocpp_id,
        'OCPP Protocol': charger.ocpp_protocol,
        'Phase': charger.phase,
        'Phase Rotation': charger.phase_rotation,
        // 🆕 Rate i shitjes: perpiqe emrin, fallback te ID.
        'Sale Rate': charger.Rate?.rate_name || (charger.rate_id != null ? `#${charger.rate_id}` : ''),
        // 🆕 Rate i blerjes se energjise: perpiqe emrin, fallback te ID.
        'Energy Tariff Rate (Buy)': charger.EnergyTariffRate?.rate_name || (charger.energy_tariff_rate_id != null ? `#${charger.energy_tariff_rate_id}` : ''),
      };
      if (canSeeGL) {
        row['G/L Purchase'] = charger.g_l_purchase || '';
        row['G/L Earnings'] = charger.g_l_earnings || '';
      }
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    // Column widths per lexueshmeri me te mire.
    worksheet['!cols'] = [
      { wch: 22 }, // Charger Name
      { wch: 8 },  // Type
      { wch: 12 }, // Current Type
      { wch: 12 }, // Status
      { wch: 12 }, // Max Amperage
      { wch: 14 }, // Max Power
      { wch: 14 }, // Max Voltage
      { wch: 14 }, // Rate Power
      { wch: 16 }, // No. of Connectors
      { wch: 20 }, // OCPP ID
      { wch: 14 }, // OCPP Protocol
      { wch: 14 }, // Phase
      { wch: 14 }, // Phase Rotation
      { wch: 20 }, // Sale Rate
      { wch: 24 }, // Energy Tariff Rate (Buy)
      ...(canSeeGL ? [{ wch: 18 }, { wch: 18 }] : []),  // G/L Purchase + Earnings
    ];
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Chargers': worksheet },
      SheetNames: ['Chargers']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'chargers');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';