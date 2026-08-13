import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../../../services/cardService/card.service'
import { RechargeService } from "../../../services/rechargeService/recharge.service";
import { TransactionService } from "../../../services/transactionService/transaction.service";
import { UserService } from "../../../services/userService/user.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ChargingHistoryService } from 'src/app/services/chargingHistoryService/charging-history.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
@Component({
  selector: 'app-rfid-card-details',
  templateUrl: './rfid-card-details.component.html',
  styles: [
  ]
})
export class RfidCardDetailsComponent {
  errorMessage: any;
  id: string;
  rfidCard: any[] = [];
  card: any;
  recharges: any[] = [];
  transactions: any[] = [];
  tempRfidCard = [];
  tempRecharges = [];
  tempTransactions = [];
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;
  user: any;
  isExpired: boolean = false;

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

  isAble: boolean = false;
  chargingHistory: any = [];
  tempChargingHistory = [];
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
    private cardService: CardService,
    private rechargeService: RechargeService,
    private transactionService: TransactionService,
    private userService: UserService,
    private chargingHistoryService: ChargingHistoryService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isAble = true;
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isAble = true;
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
            // this.getVehiclesByCompany(company_id);
            this.isAble = true;
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            // this.loadCompaniesByUserGroup(usergroup_id);
            this.isAble = false;
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isAble = false;
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            // this.getVehiclesByUser(user_id);
            this.isAble = false;
            //     this.loadCompaniesByUser(user_id);
            // this.loadUsersByUser(user_id);
            // this.loadUserGroupsByUser(user_id);
            // this.getCurrencies(company_id);
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
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getCard();
    this.getRecharges();
    this.getTransactions();
    this.getchargingHistory(this.id);

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
    // if (event.type === 'click') {
    //   this.router.navigate([`/users/usergroup/${this.activeRow.usergr_id}`]);
    // }
  }

  // getCard() {
  //   this.cardService.getCard(this.id).subscribe(
  //     (data) => {
  //       this.rfidCard = data;
  //       this.tempRfidCard = [...this.rfidCard];
  //       console.log(data);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }

  // getRecharges() {
  //   this.rechargeService.getRechargeByCard(this.id).subscribe(
  //     (data) => {
  //       this.recharges = data;
  //       this.tempRecharges = [...this.recharges];
  //       console.log(data);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }

  // getTransactions() {
  //   this.transactionService.getTransactionByCard(this.id).subscribe(
  //     (data) => {
  //       this.transactions = data;
  //       this.tempTransactions = [...this.transactions];
  //       console.log(data);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }
  getCard() {
    this.cardService.getCard(this.id).subscribe(
      (response) => {
        if (response.success && response.card) {
          this.rfidCard = response.card;
          this.card = this.rfidCard;
          console.log(this.card.status)
          if (this.card && this.card.status) {
            this.isExpired = ['active',].includes(this.card.status);
            console.log('Card Status:', this.card.status);
            console.log('Is Expired:', this.isExpired);
          }
        } else {
          this.rfidCard = [];
        }
        this.cd.detectChanges();
        console.log(this.rfidCard);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getRecharges() {
    this.rechargeService.getRechargeByCard(this.id).subscribe(
      (response) => {
        if (response.success && Array.isArray(response.recharge)) {
          this.recharges = response.recharge;
        } else {
          this.recharges = [];
        }
        this.tempRecharges = [...this.recharges];
        console.log(response.recharge);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getTransactions() {
    this.transactionService.getTransactionByCard(this.id).subscribe(
      (response) => {
        if (response.success && Array.isArray(response.tansaction)) {
          this.transactions = response.tansaction;
        } else {
          this.transactions = [];
        }
        this.tempTransactions = [...this.transactions];
        console.log(response.tansaction);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  redirectToRecharge(cardId: number) {
    this.router.navigate([`/rfid-cards/recharge`, cardId]);
  }

  getchargingHistory(id: string) {
    this.chargingHistoryService.getChargingByCard(id).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.chargingHistory)) {
          console.log(data.chargingHistory)
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