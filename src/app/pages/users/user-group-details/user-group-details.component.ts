import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/userService/user.service';
import { UserGroupService } from '../../../services/userGroupService/user-group.service';
import { UserGroupMembersService } from '../../../services/userGroupMembersService/user-group-members.service';
import { ChargingHistoryService } from "../../../services/chargingHistoryService/charging-history.service";
import { CardService } from "../../../services/cardService/card.service";
import { VehicleService } from "../../../services/vehicleService/vehicle.service";
import { ReportService } from "../../../services/reportService/report.service";
import { RechargeService } from 'src/app/services/rechargeService/recharge.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { DocumentService } from 'src/app/services/documentService/document.service';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { TransactionService } from 'src/app/services/transactionService/transaction.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}


@Component({
  selector: 'app-user-group-details',
  templateUrl: './user-group-details.component.html'
})
export class UserGroupDetailsComponent {
  isRadXRole: boolean = false;
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
  user_id: any;
  usergr_id: any;
  partner_id: any;
  isAble: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  entries: number = 10;
  selected: any[] = [];
  tempUserGroups = [];
  tempUserGroupMembers = [];
  tempChargingHistory = [];
  tempRfidCards = [];
  tempVehicles = [];
  tempReports = [];
  tempDocuments = [];
  activeRow: any;
  errorMessage: any;
  userGroups: any = [];
  chargingHistory: any = [];
  rfidCards: any = [];
  vehicles: any = [];
  reports: any = [];
  documents: any = [];
  SelectionType = SelectionType;
  userGroupMembers: any[] = [];
  id: string;
  recharges: any[] = [];
  tempRecharges = [];
  tempTransactions = [];
  transactions: any[] = [];
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.isSmallScreen = event.target.innerWidth < 768;
  //   if (this.isSmallScreen) {
  //     this.isInputVisible = false;
  //   }
  // }
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  toggleSearchInput() {
    this.isInputVisible = !this.isInputVisible;
  }
  get isAdminUser(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'radxadmin' || role === 'companyadmin';
  }

  // 🆕 Kontroll roli per fushen `is_vega_staff` — vetem admin dhe analyst mund ta shohin.
  get canViewVegaStaff(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'radxadmin'
      || role === 'radxmoderator'
      || role === 'companyadmin'
      || role === 'superuser'
      || role === 'companyanalyst';
  }
  constructor(
    private userService: UserService,
    private userGroupService: UserGroupService,
    private userGroupMembersService: UserGroupMembersService,
    private chargingHistoryService: ChargingHistoryService,
    private cardService: CardService,
    private vehicleService: VehicleService,
    private reportService: ReportService,
    private companyService: CompanyService,
    private documentService: DocumentService,
    private chargerService: ChargerService,
    private router: Router,
    private route: ActivatedRoute,
    private rechargeService: RechargeService,
    private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    console.log('ngOnInit user group details');
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergr_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.isAble = true;
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.isAble = true;
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            console.log("this.isCompanyAdmin", this.isCompanyAdmin)
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.isCompanyRole = true;
            this.isAble = true;
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            this.isAble = false;
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.isAble = false;
            // this.getPartnerMembers(partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isUserRole = true;
            this.isAble = false;
            this.isUser = true;
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
    console.log(' this.id', this.id);
    console.log('getUserGroup');
    this.getUserGroup();
    console.log('getUserGroupMembers');
    this.getUserGroupMembers();
    console.log('getCards');
    this.getCards();
    console.log('getVehicles');
    this.getVehicles();
    console.log('getVReports');
    this.getVReports();
    this.getchargingHistory(this.id);
    this.getDocuments(this.id);
    this.getRecharges();
    this.getTransactionsByUserGroup();
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
      if (this.activeRow.reports_id) {
        this.router.navigate([`/reports/financial/${this.activeRow.reports_id}`]);
      } else if (this.activeRow.card_id) {
        this.router.navigate([`/rfid-cards/rfidcard/${this.activeRow.card_id}`]);
      } else if (this.activeRow.vehicle_id) {
        this.router.navigate([`/assets/vehicle/${this.activeRow.vehicle_id}`]);
      } else if (this.activeRow.user_id) {
        this.router.navigate([`/users/user/${this.activeRow.user_id}`]);
      }

      console.log('activeRow', this.activeRow);
    }
  }

  openDocument(row: any) {
    const documentUrl = row.file_path;
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      console.error('Document URL is not available');
    }
  }

  onActivateDoc(event) {
    if (event.type === 'dblclick') {
      this.openDocument(event.row);
    }
  }

  filterMemberTable($event: any) {
    const val = $event.target.value.toLowerCase();

    if (!val) {
      this.tempUserGroupMembers = [...this.userGroupMembers];
      return;
    }

    this.tempUserGroupMembers = this.userGroupMembers.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  filterRFIDCardTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempRfidCards = [...this.rfidCards];
      return;
    }

    this.tempRfidCards = this.rfidCards.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  filterVehiclesTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempVehicles = [...this.vehicles];
      return;
    }

    this.tempVehicles = this.vehicles.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  filterReportsTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempReports = [...this.reports];
      return;
    }

    this.tempReports = this.reports.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  getchargingHistory(id: string) {
    this.chargingHistoryService.getChargingByUserGroup(id).subscribe(
      async (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.chargingHistory)) {
          this.chargingHistory = data.chargingHistory;

          this.tempChargingHistory = [...this.chargingHistory];
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  filterChargingHistoryTable($event: any) {
    const val = ($event?.target?.value || '').toLowerCase();
    if (!val) {
      this.tempChargingHistory = [...this.chargingHistory];
      return;
    }
    this.tempChargingHistory = this.chargingHistory.filter((d: any) =>
      Object.keys(d).some((key) => {
        const v = d[key];
        return typeof v === 'string' && v.toLowerCase().includes(val);
      })
    );
  }

  onChargingRowSelect(event: { selected: any[] }) {
    const row = event?.selected?.[0];
    if (!row) return;
    const id = row.charging_history_id;
    if (id) {
      this.router.navigate([`/assets/charinghistory/${id}`]);
    }
  }

  getDocuments(id: string) {
    this.documentService.getDocumentByUserGroup(id).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.documents)) {
          this.documents = data.documents;
          this.tempDocuments = [...this.documents];
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getVReports() {
    this.reportService.getAllReportByUserGroup(this.id).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.report is an array
          this.reports = data.reports;
        } else if (data && data.reports && typeof data.reports === 'object') {
          // If data.report is a single object
          this.reports = [data.reports];
        } else {
          console.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  getVehicles() {
    this.vehicleService.getVehicleByUserGroup(this.id).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.vehicles)) {
          this.vehicles = data.vehicles;
          this.tempVehicles = [...this.vehicles];
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getCards() {
    this.cardService.getCardByUserGroup(this.id).subscribe(
      (data: any) => {
        console.log('API response:', data);

        // Check if the response contains the 'card' array
        if (data && data.success && Array.isArray(data.card)) {
          this.rfidCards = data.card;
          this.tempRfidCards = [...this.rfidCards]; // Create a shallow copy for the table
          console.log('RFID Cards:', this.tempRfidCards);
        } else {
          console.error('Unexpected data format:', data);
          this.tempRfidCards = []; // Ensure the table is empty if data format is incorrect
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching card data:', error);
        this.tempRfidCards = []; // Ensure the table is empty on error
      }
    );
  }

  getCard() {
    this.cardService.getCardByUserGroup(this.id).subscribe(
      (data) => {
        console.log(data);
        if (Array.isArray(data.card)) {
          this.rfidCards = data.card;
          this.rfidCards.forEach((card) => {
            console.log('Card Id', card.card_id);
          });
        } else if (data.card) {
          this.rfidCards = [data.card];
          this.tempRfidCards = [...this.rfidCards];
          console.log('Single Card Id', data.card.card_id);
        } else {
          console.error('Unexpected data format:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log('Error fetching card data:', error);
      }
    );
  }

  getUserGroup() {
    console.log("getUserGroup method called")
    this.userGroupService.getUserGroup(this.id).subscribe(
      (data) => {
        console.log(data.userGroup);
        this.userGroups = data.userGroup;
        console.log("data", data);
        // Fetch the company details using company_id from userGroup data
        if (this.userGroups.company_id) {
          this.companyService.getCompany(this.userGroups.company_id).subscribe(
            (companyData) => {
              console.log("Company data:", companyData);
              this.userGroups.company_name = companyData.company.company_name;
              console.log(" this.userGroups.company_name:", this.userGroups.company_name);
            },
            (error) => {
              console.log("Error fetching company data:", error);
            }
          );
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getUserGroupMembers() {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(this.id).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.userGroupMembers)) {
          this.tempUserGroupMembers = await Promise.all(data.userGroupMembers.map(async (member: any) => {
            const user = await this.userService.getUserById(member.user_id).toPromise();
            // Combine member and user into a single object
            return { ...member, user };
          }));
          console.log('User Group Members with Users:', this.tempUserGroupMembers);
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log('Error fetching user group members:', error);
      }
    );
  }

  getRecharges() {
    this.rechargeService.getRechargesByUserGroup(this.id).subscribe(
      (response) => {
        console.log('API response:', response); // Log the entire response object

        if (response.success && Array.isArray(response.recharges)) {
          this.recharges = response.recharges;
          this.tempRecharges = [...this.recharges];
          console.log("Fetched recharges:", this.tempRecharges); // Log the actual recharges
        } else {
          this.recharges = [];
          console.log("No recharges available or response format is incorrect.");
        }
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load recharges';
        console.log('Error:', error); // Log any errors that occur
      }
    );
  }

  getTransactionsByUserGroup() {
    this.transactionService.getTransactionByUserGroup(this.id).subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.transactions)) { // <--- transactions me 's'
          this.transactions = response.transactions;
          this.tempTransactions = [...this.transactions]; // Kopje për filter
        } else {
          this.transactions = [];
          console.log("No transactions available or response format is incorrect.");
        }
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load transactions';
        console.log('Error:', error);
      }
    );
  }

  filterDocumentsTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      // If the search input is cleared, reset tempDocuments to original documents
      this.tempDocuments = [...this.documents];
      return;
    }

    this.tempDocuments = this.documents.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  filterRechargersTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempRecharges = [...this.recharges];
      return;
    }
    this.tempRecharges = this.recharges.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
}
