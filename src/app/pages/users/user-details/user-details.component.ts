// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { UserService } from "../../../services/userService/user.service";
// import { CardService } from "../../../services/cardService/card.service";
// import { ChargingHistoryService } from "../../../services/chargingHistoryService/charging-history.service";

// import { UserGroupMembersService } from "../../../services/userGroupMembersService/user-group-members.service";
// import { UserGroupService } from "../../../services/userGroupService/user-group.service";
// import { CompanyMemberService } from "../../../services/companyMemberService/company-member.service";
// import { CompanyService } from "../../../services/companyService/company.service";
// import { PartnerMemberService } from "../../../services/partner-member.service";
// import { PartnerService } from "../../../services/partnerService/partner.service";

// import { TabsetComponent } from 'ngx-bootstrap/tabs';

// export enum SelectionType {
//   single = "single",
//   multi = "multi",
//   multiClick = "multiClick",
//   cell = "cell",
//   checkbox = "checkbox"
// }

// @Component({
//   selector: 'app-user-details',
//   templateUrl: './user-details.component.html'
// })
// export class UserDetailsComponent {
//   errorMessage: any;
//   userDetails: any;
//   rfidCard: any;
//   card: any;
//   chargingHistory: any;
//   tempChargingHistory = [];
//   cardId: number | null = null;
//   id: string;
//   userGroupName: string | null = null;
//   companyName: string | null = null;
//   partnerName: string | null = null;

//   activeRow: any;
//   selected: any[] = [];
//   entries: number = 10;
//   SelectionType = SelectionType;

//   constructor(
//     private userService: UserService, 
//     private cardService: CardService, 
//     private chargingHistoryService: ChargingHistoryService, 
//     private router: Router,
//     private route: ActivatedRoute,
//     private userGroupMemberService: UserGroupMembersService,
//     private userGroupService: UserGroupService,
//     private companyMemberService: CompanyMemberService,
//     private companyService: CompanyService,
//     private partnerMemberService: PartnerMemberService,
//     private partnerService: PartnerService
//   ) {}

//   ngOnInit() {
//     this.id = this.route.snapshot.paramMap.get('id') as string;
//     this.getUser();
//     this.getRFID();
//     this.checkMembership();
//     // this.getChargingHistory();
//   }

//   entriesChange($event) {
//     this.entries = $event.target.value;
//   }


//   onSelect({ selected }) {
//     this.selected.splice(0, this.selected.length);
//     this.selected.push(...selected);
//   }

//   onActivate(event) {
//     this.activeRow = event.row;
//     if (event.type === 'click') {
//       this.router.navigate([`/rfid-cards/rfidcard/${this.activeRow.usergr_id}`]);
//     }
//   }

//   getUser() {
//     this.userService.getUserById(this.id).subscribe(
//       (data) => {
//         this.userDetails = data;
//         console.log(data.user);

//       },
//       (error) => {
//         this.errorMessage = error.message
//         console.log(error);

//       }
//     )
//   }
//   getRFID() {
//     this.cardService.getCardUser(this.id).subscribe(
//       (data) => {
//         this.rfidCard = data;
//         this.card = this.rfidCard.card[0];
//         console.log(data);
//         if (data && data.card && data.card.length > 0) {
//           this.cardId = data.card[0].card_id;  // Extract card_id from the first card in the array
//           console.log('Card ID:', this.cardId);
//           this.getChargingHistory(data.card[0].card_id);  // Call getChargingHistory with the card_id
//         }

//       },
//       (error) => {
//         this.errorMessage = error.message
//         console.log(error);

//       }
//     )
//   }
//   getChargingHistory(id: string) {
//     this.chargingHistoryService.getChargingByCard(this.cardId).subscribe(
//       (data: any) => {
//         console.log("Charging History", data);
//         if (data && Array.isArray(data.chargingHistory)) {
//           this.chargingHistory = data.chargingHistory;
//           this.tempChargingHistory = [...this.chargingHistory];
//         } else {
//           console.error('Expected an array but got:', data);
//         }
//       },
//       (error) => {
//         this.errorMessage = error.message
//         console.log(error);

//       }
//     )
//   }

//   checkMembership() {
//     // Check if the user is a User Group Member
//     this.userGroupMemberService.getUserGroupMemberByUser(this.id).subscribe(
//       (response) => {
//         console.log(response)
//         if (response && response.userGroupMembers) {
//           console.log(response.userGroupMembers);
//           this.userGroupService.getUserGroup(response.userGroupMembers[0].usergr_id).subscribe(
//             (userGroupData) => {
//               this.userGroupName = userGroupData.userGroup.usergr_name;
//               console.log('User belongs to User Group:', userGroupData);
//             },
//             (error) => console.log(error)
//           );
//         }
//       },
//       (error) => console.log(error)
//     );

//     // Check if the user is a Company Member
//     this.companyMemberService.getCompanyMemberByUser(this.id).subscribe(
//       (response) => {
//         console.log(response)
//         if (response && response.company_member) {
//           console.log(response.company_member);
//           this.companyService.getCompany(response.company_member[0].company_id).subscribe(
//             (companyData) => {
//               this.companyName = companyData.company.company_name;
//               console.log('User belongs to Company:', companyData);
//             },
//             (error) => console.log(error)
//           );
//         }
//       },
//       (error) => console.log(error)
//     );

//     // Check if the user is a Partner Member
//     this.partnerMemberService.getPartnerMemberByUser(this.id).subscribe(
//       (response) => {
//         console.log(response);
//         if (response && response.partnerMembers) {
//           console.log(response.partnerMembers)
//           this.partnerService.getPartner(response.partnerMembers[0].partner_id).subscribe(
//             (partnerData) => {
//               this.partnerName = partnerData.partner.partner_name;
//               console.log('User belongs to Partner:', partnerData.partner.partner_name);
//             },
//             (error) => console.log(error)
//           );
//         }
//       },
//       (error) => console.log(error)
//     );
//   }

// }


import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../../../services/userService/user.service";
import { CardService } from "../../../services/cardService/card.service";
import { ChargingHistoryService } from "../../../services/chargingHistoryService/charging-history.service";
import { UserGroupMembersService } from "../../../services/userGroupMembersService/user-group-members.service";
import { UserGroupService } from "../../../services/userGroupService/user-group.service";
import { CompanyMemberService } from "../../../services/companyMemberService/company-member.service";
import { CompanyService } from "../../../services/companyService/company.service";
import { PartnerMemberService } from "../../../services/partner-member.service";
import { PartnerService } from "../../../services/partnerService/partner.service";
import { DocumentService } from "../../../services/documentService/document.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { RechargeService } from 'src/app/services/rechargeService/recharge.service';
import { AuthService } from 'src/app/services/authService/auth.service';
import { TransactionService } from 'src/app/services/transactionService/transaction.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
  errorMessage: string | null = null;
  userDetails: any = null;
  logedInUser: any = null;
  logedInUserId: any = null;
  allowTransfer: any = null;
  rfidCard: any = null;
  card: any = null;
  isDistributorCard: boolean = false;
  distributorName: string | null = null;
  chargingHistory: any[] = [];
  documents: any[] = [];
  tempChargingHistory: any[] = [];
  tempDocuments: any[] = [];
  cardId: number | null = null;
  id: string = '';
  userGroupName: string | null = null;
  companyName: string | null = null;
  partnerName: string | null = null;
  madeBy: string | null = null;
  modifiedBy: string | null = null;
  rows: any = [];
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;
  SelectionType = SelectionType;
  tempRecharges = [];
  tempTransactions = [];
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
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  recharges: any[] = [];
  transactions: any[] = [];
  userGroups = [];
  showRechargeButtonForUserGroup: boolean = false;
  isSplitWallet: boolean = false;
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
    private userService: UserService,
    private cardService: CardService,
    private chargingHistoryService: ChargingHistoryService,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private userGroupMemberService: UserGroupMembersService,
    private userGroupService: UserGroupService,
    private companyMemberService: CompanyMemberService,
    private companyService: CompanyService,
    private partnerMemberService: PartnerMemberService,
    private partnerService: PartnerService,
    private rechargeService: RechargeService,
    private authService: AuthService,
    private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergr_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred?.user_id || parsedCugpCred?.id || null;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            // this.isRadXRole =  true;
            this.isAble = true;
            break;
          case 'RADX_MODERATOR':
            // this.isRadXRole =  true;
            this.isAble = true;
            break;
          case 'COMPANY_ADMIN':
            // this.isCompanyRole = true
            this.isCompanyAdmin = true;
          // console.log("this.isCompanyAdmin", this.isCompanyAdmin)
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.isAble = true;
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isAble = false;
            // console.log("isUserGroupAdmin", this.isUserGroupAdmin)
            this.getUserGroupDetails(this.usergr_id);
            break;
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            this.isAble = false;
            break;
          case 'PARTNER_ADMIN':
            this.isAble = false;
            this.isPartnerAdmin = true;
            break;
          case 'PARTNER_MODERATOR':
            this.isAble = false;
            // this.getPartnerMembers(partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isAble = false;
            this.isUser = true;
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
    this.getUser();
    this.getRFID();
    this.checkMembership();
    this.getDocuments(this.id);
    this.getChargingHistory()
    this.getRecharges();
    this.getCurrentUserDetail();
    this.getTransactionsByUser();
  }

  entriesChange($event: any) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  openDocument(row: any) {
    const documentUrl = row.file_path;
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      logger.error('Document URL is not available');
    }
  }
  onActivate(event: any) {
    this.activeRow = event.row;
    // if (event.type === 'click') {
    //   this.router.navigate([`/rfid-cards/rfidcard/${this.activeRow.usergr_id}`]);
    // }
  }

  onActivateDoc(event) {
    if (event.type === 'dblclick') {
      this.openDocument(event.row);
    }
  }

  getDocuments(id: string) {
    this.documentService.getDocumentByUser(id).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.documents)) {
          this.documents = data.documents;
          this.tempDocuments = [...this.documents];
        } else {
          logger.error('Expected an array but got:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getUser() {
    this.userService.getUserById(this.id).subscribe(
      (data) => {
        this.userDetails = data && data.user ? data.user : null;
        // console.log("this.userDetails", this.userDetails)
        // if (!this.userDetails) {
        //   console.log('No user details available');
        // } else {
        //   console.log('User Details:', this.userDetails);
        //   if (this.userDetails.role === 'RadX_Admin' || this.userDetails.role === 'RADX_MODERATOR') {
        //     this.isRadXRole = true;
        //     console.log('Radx Role', this.isRadXRole);
        //   }
        //   else if (this.userDetails.role === 'USER' || this.userDetails.role === 'SUPER_USER') {
        //     this.isUserRole = true;
        //     console.log('User Role', this.isUserRole);
        //   }
        // }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log('Error fetching user details:', error);
      }
    );
  }

  getCurrentUserDetail() {
    this.authService.getCurrentUserDetails().subscribe(
      (data) => {
        // console.log(data);
        this.logedInUser = data.user;
        this.logedInUserId = data.user.id;
        this.allowTransfer = data.user.allow_money_transfert;
        logger.log("data.user", data.user)
      },
      error => {
        logger.log(error);
      }
    )
  }

  // getRFID() {
  //   this.cardService.getCardUser(this.id).subscribe(
  //     (data) => {
  //       this.rfidCard = data;
  //       this.card = (data && data.card && data.card.length > 0) ? data.card[0] : null;
  //       console.log(this.card);
  //       if (this.card) {
  //         this.cardId = this.card.card_id;
  //         console.log('Card ID:', this.cardId);
  //         this.getChargingHistory(this.cardId);
  //       } else {
  //         console.log('No RFID card available for this user.');
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log('Error fetching RFID card:', error);
  //     }
  //   );
  // }
  getRFID() {
    this.cardService.getCardUser(this.id).subscribe(
      (data) => {
        this.rfidCard = data;
        if (data && data.card && data.card.length > 0) {
          const activeCard = data.card.find(
            (c: any) => (c.status || '').toString().toLowerCase() === 'active'
          );
          this.card = activeCard || data.card[0];
          this.cardId = this.card.card_id;
          // 🆕 Detect distributor card (per badge te admin/analyst)
          const distributorCard = data.card.find((c: any) => !!c.is_distributor_card);
          this.isDistributorCard = !!distributorCard;
          this.distributorName = distributorCard?.distributor_name || null;
        } else {
          this.card = null;
          this.cardId = null;
          this.isDistributorCard = false;
          this.distributorName = null;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }


  getChargingHistory() {
    this.chargingHistoryService.getChargingByUser(this.id).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.chargingHistory)) {
          this.chargingHistory = data.chargingHistory;
          this.tempChargingHistory = [...this.chargingHistory];
          // console.log('Charging History:', this.chargingHistory);
        } else {
          // console.log('No charging history available.');
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log('Error fetching charging history:', error);
      }
    );
  }

  getRecharges() {
    this.rechargeService.getRechargesByUserId(this.id).subscribe(
      (response) => {
        // console.log('API response:', response); // Log the entire response object

        if (response.success && Array.isArray(response.recharge)) {
          this.recharges = response.recharge;
          this.tempRecharges = [...this.recharges]; // Make a copy for filtering
          // console.log("Fetched recharges:", this.recharges); // Log the actual recharges
        } else {
          this.recharges = [];
          // console.log("No recharges available or response format is incorrect.");
        }
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load recharges';
        logger.log('Error:', error); // Log any errors that occur
      }
    );
  }

  getTransactionsByUser() {
    this.transactionService.getTransactionByUser(this.id).subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.transactions)) { // <--- transactions me 's'
          this.transactions = response.transactions;
          this.tempTransactions = [...this.transactions]; // Kopje për filter
        } else {
          this.transactions = [];
          logger.log("No transactions available or response format is incorrect.");
        }
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load transactions';
        logger.log('Error:', error);
      }
    );
  }


  checkMembership() {
    // Check User Group Membership First
    this.userGroupMemberService.getUserGroupMemberByUser(this.id).subscribe(
      (response) => {
        if (response && response.userGroupMembers && response.userGroupMembers.length > 0) {
          // console.log("response", response)
          const userGroupId = response.userGroupMembers[0].usergr_id;
          this.userGroupService.getUserGroup(userGroupId).subscribe(
            (userGroupData) => {
              this.userGroupName = userGroupData.userGroup ? userGroupData.userGroup.usergr_name : null;
              // console.log('User belongs to User Group:', this.userGroupName);
              this.isUserGroupRole = true;
              // console.log('User Group role:', this.isUserGroupRole);
            },
            (error) => logger.log('Error fetching user group:', error)
          );
          return; // Stop execution if user is in a User Group
        }

        // If not in a User Group, check Partner Membership
        this.partnerMemberService.getPartnerMemberByUser(this.id).subscribe(
          (response) => {
            if (response && response.partnerMembers && response.partnerMembers.length > 0) {
              // console.log("response", response)
              const partnerId = response.partnerMembers[0].partner_id;
              this.partnerService.getPartner(partnerId).subscribe(
                (partnerData) => {
                  this.partnerName = partnerData.partner ? partnerData.partner.partner_name : null;
                  // console.log('User belongs to Partner:', this.partnerName);
                  this.isPartnerRole = true;
                  // console.log('Partner Role:', this.isPartnerRole);
                },
                (error) => logger.log('Error fetching partner:', error)
              );
              return; // Stop execution if user is in a Partner
            }

            // If not in User Group and not in Partner, check Company Membership
            this.companyMemberService.getCompanyMemberByUser(this.id).subscribe(
              (response) => {
                if (response && response.company_member && response.company_member.length > 0) {
                  const companyId = response.company_member[0].company_id;

                  // console.log("response companyMemberService", response)
                  this.madeBy = response.company_member[0].madeBy;
                  this.modifiedBy = response.company_member[0].modifiedBy;
                  this.companyService.getCompany(companyId).subscribe(
                    (companyData) => {
                      this.companyName = companyData.company ? companyData.company.company_name : null;

                      // console.log('User belongs to Company:', this.companyName);

                      if (this.isRadXRole === false) {
                        this.isCompanyRole = true;
                        // console.log('this.isCompanyRole = true', this.isCompanyRole);
                      } else {
                        this.isCompanyRole = false;
                      }

                      // console.log('Company role:', this.isCompanyRole, this.isRadXRole, this.isUserRole);
                    },
                    (error) => logger.log('Error fetching company:', error)
                  );
                } else {
                  // console.log('User is not part of any Company.');
                }
              },
              (error) => logger.log('Error checking company membership:', error)
            );
          },
          (error) => logger.log('Error checking partner membership:', error)
        );
      },
      (error) => logger.log('Error checking user group membership:', error)
    );
  }


  filterChargingHistoryTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    // console.log('Search Value:', val);  // Debug log

    if (!val) {
      // If the search input is cleared, reset temp to original rows
      this.tempChargingHistory = [...this.chargingHistory];
      return;
    }

    this.tempChargingHistory = this.chargingHistory.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          const match = d[key].toLowerCase().includes(val); // Check if the property contains the search value
          if (match) logger.log(`Matched: ${d[key]} for ${key}`); // Debug log for matching values
          return match;
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

  getUserGroupDetails(id: number): void {
    this.userGroupService.getUserGroup(id).subscribe({
      next: (response) => {
        // console.log('response:', response);

        // Normalize split_wallet to a boolean
        const splitWalletValue = response.userGroup.split_wallet;
        this.isSplitWallet = splitWalletValue === '1' || splitWalletValue === 'true';

        // console.log('this.isSplitWallet (boolean):', this.isSplitWallet);
        // console.log('this.isUserGroupAdmin:', this.isUserGroupAdmin);

        // Now you can safely use this.isSplitWallet as a boolean in the template
      }
    });
  }
  onChargingHistoryActivate(event) {
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/assets/charinghistory/${this.activeRow.charging_history_id}`]);
    }
  }

  onRowSelect(event: { selected: any[] }) {
    const row = event.selected[0];
    if (!row) { return; }

    // defensive: some back‑end rows can be null if empty‑state rows are rendered
    const id = row.charging_history_id;
    if (id) {
      // prefer path segments – avoids manual string interpolation mistakes
      this.router.navigate([`/assets/charinghistory/${id}`]);
    }
  }

}
