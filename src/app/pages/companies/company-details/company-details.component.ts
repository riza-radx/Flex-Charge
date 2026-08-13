import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from "../../../services/companyService/company.service";
import { CompanyMemberService } from "../../../services/companyMemberService/company-member.service";
import { ChargerService } from "../../../services/chargerService/charger.service";
import { PartnerService } from "../../../services/partnerService/partner.service";
import { UserService } from '../../../services/userService/user.service';
import { UserGroupService } from '../../../services/userGroupService/user-group.service';
import { CardService } from "../../../services/cardService/card.service";
import { ChargingHistoryService } from "../../../services/chargingHistoryService/charging-history.service";
import { VehicleService } from "../../../services/vehicleService/vehicle.service";
import { ReportService } from "../../../services/reportService/report.service";
import { DocumentService } from "../../../services/documentService/document.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html'
})
export class CompanyDetailsComponent {
  // companyDetails: any;
  // companyMembers: any;
  // chargers: any;
  // partners: any;
  // rfidCards: any;
  // chargingHistory: any;
  // vehicles: any;
  // userGroup: any;
  // errorMessage: any;
  // id: string;
  companyDetails: any;
  companyMembers: any[] = [];
  chargers: any[] = [];
  partners: any[] = [];
  userGroups: any[] = [];
  chargingHistory: any[] = [];
  rfidCards: any[] = [];
  vehicles: any[] = [];
  reports: any[] = [];
  documents: any[] = [];
  errorMessage: string;
  id: string;
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;
  tempCompanyMembers = [];
  tempChargers = [];
  tempPartners = [];
  tempUserGroups = [];
  tempChargingHistory = [];
  tempRfidCards = [];
  tempVehicles = [];
  tempReports = [];
  tempDocuments = [];
  SelectionType = SelectionType;
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
    private companyService: CompanyService,
    private companyMemberService: CompanyMemberService,
    private chargerService: ChargerService,
    private partnerService: PartnerService,
    private userGroupService: UserGroupService,
    private chargingHistoryService: ChargingHistoryService,
    private cardService: CardService,
    private vehicleService: VehicleService,
    private reportService: ReportService,
    private userService: UserService,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    // this.id = localStorage.getItem('userRole');
    this.getCompany();
    this.getUserGroup();
    this.getCompanyMembers();
    this.getChargers();
    this.getPartners();
    this.getVehicles();
    this.getCards();
    this.getVReports();
    this.getchargingHistory(this.id);
    this.getDocuments(this.id);
    // this.getCard();

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
      }else if (this.activeRow.user_id) {
        this.router.navigate([`/users/user/${this.activeRow.user_id}`]);
      } else if (this.activeRow.usergr_id) {
        this.router.navigate([`/users/usergroup/${this.activeRow.usergr_id}`]);
      } else if (this.activeRow.charger_id) {
        this.router.navigate([`/assets/chargers/${this.activeRow.charger_id}`]);
      }
      else if (this.activeRow.partner_id) {
        this.router.navigate([`/partners/partner/${this.activeRow.partner_id}`]);
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

  getDocuments(id: string) {
    this.documentService.getDocumentByCompany(id).subscribe(
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

  getCompany() {
    this.companyService.getCompany(this.id).subscribe(
      async (data) => {
        this.companyDetails = data;

        console.log("companydettails", data);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getCompanyMembers() {
    this.companyMemberService.getCompanyMemberByCompany(this.id).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.company_member)) {
          this.tempCompanyMembers = await Promise.all(data.company_member.map(async (member: any) => {
            const userResponse = await this.userService.getUserById(member.user_id).toPromise();
            const user = userResponse.user; // Access the user from the response
            // Combine member and user into a single object
            return {
              ...member,
              user: user // Directly include the user data
            };
          }));
        } else {
          console.error('Expected an array but got:', data);
          this.tempCompanyMembers = [];
        }
        console.log(this.tempCompanyMembers);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log('Error fetching company members:', error);
      }
    );
  }



  getChargers() {
    this.chargerService.getChargerByCompany(this.id).subscribe(
      (data) => {
        // this.chargers = data;
        console.log(data);
        // console.log(data);
        if (data && Array.isArray(data.charger)) {
          this.chargers = data.charger;
          this.tempChargers = [...this.chargers];
        } else {
          console.error('Expected an array but got:', data);
        }

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getPartners() {
    this.partnerService.getPartnerByCompany(this.id).subscribe(
      (data) => {
        // this.partners = data;
        console.log(data);
        if (data && Array.isArray(data.partner)) {
          this.partners = data.partner;
          this.tempPartners = [...this.partners];
        } else {
          console.error('Expected an array but got:', data);
        }

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getUserGroup() {
    this.userGroupService.getUserGroupByCompany(this.id).subscribe(
      (data) => {
        // this.userGroups = data;
        console.log(data);
        if (data && Array.isArray(data.userGroup)) {
          this.userGroups = data.userGroup;
          this.tempUserGroups = [...this.userGroups];
        } else {
          console.error('Expected an array but got:', data);
        }

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  // getchargingHistory(id: string) {
  //   this.chargingHistoryService.getChargingByCard(id).subscribe(
  //     (data) => {
  //       this.chargingHistory = data;
  //       this.tempChargingHistory = [...this.chargingHistory];
  //       console.log(data);
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  getchargingHistory(id: string) {
    this.chargingHistoryService.getChargingByCompany(id).subscribe(
      // (data) => {
      //   if (Array.isArray(data)) {
      //     this.chargingHistory = data;
      //     this.tempChargingHistory = [...this.chargingHistory];
      //   } else {
      //     console.error('Charging History data is not an array:', data);
      //     this.chargingHistory = []; // Set to empty array if data is not valid
      //     this.tempChargingHistory = [];
      //   }
      //   console.log(data);
      // },
      // (error) => {
      //   this.errorMessage = error.message;
      //   console.log(error);
      // }
      (data: any) => {
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

  getVehicles() {
    this.vehicleService.getVehicleByCompany(this.id).subscribe(
      // (data) => {
      //   if (Array.isArray(data)) {
      //     this.vehicles = data;
      //     this.tempVehicles = [...this.vehicles];
      //   } else {
      //     console.error('Vehicles data is not an array:', data);
      //     this.vehicles = []; // Set to empty array if data is not valid
      //     this.tempVehicles = [];
      //   }
      //   console.log(data);
      // },
      // (error) => {
      //   this.errorMessage = error.message;
      //   console.log(error);
      // }
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
  getVReports() {
    this.reportService.getAllReportByCompany(this.id).subscribe(
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

  getCards() {
    this.cardService.getCardByCompany(this.id).subscribe(
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
    this.cardService.getCardByCompany(this.id).subscribe(
      (data) => {
        console.log(data);
        if (Array.isArray(data.card)) {
          this.rfidCards = data.card;
          this.rfidCards.forEach((card) => {
            console.log('Card Id', card.card_id);
            // this.getchargingHistory(card.card_id);
          });
        } else if (data.card) {
          this.rfidCards = [data.card];
          this.tempRfidCards = [...this.rfidCards];
          console.log('Single Card Id', data.card.card_id);
          // this.getchargingHistory(data.card.card_id);
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

  filterMemberTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempCompanyMembers = [...this.companyMembers];
      return;
    }

    this.tempCompanyMembers = this.companyMembers.filter((d) => {
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
  filterUserGroupTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempUserGroups = [...this.userGroups];
      return;
    }

    this.tempUserGroups = this.userGroups.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  filterPartnerTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempPartners = [...this.partners];
      return;
    }

    this.tempPartners = this.partners.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  filterChargersTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempChargers = [...this.chargers];
      return;
    }

    this.tempChargers = this.chargers.filter((d) => {
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
}

