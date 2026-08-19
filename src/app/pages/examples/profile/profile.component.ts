import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from "@angular/core";
import { AuthService } from "../../../services/authService/auth.service";
import { CardService } from "../../../services/cardService/card.service";
import { UserService } from "../../../services/userService/user.service";
import { ChargingHistoryService } from "../../../services/chargingHistoryService/charging-history.service";
import { ChargerLocationService } from "../../../services/chargerLocationService/charger-location.service";
import { Router } from '@angular/router';

import { UserGroupMembersService } from "../../../services/userGroupMembersService/user-group-members.service";
import { UserGroupService } from "../../../services/userGroupService/user-group.service";
import { CompanyMemberService } from "../../../services/companyMemberService/company-member.service";
import { CompanyService } from "../../../services/companyService/company.service";
import { PartnerMemberService } from "../../../services/partner-member.service";
import { PartnerService } from "../../../services/partnerService/partner.service";
import { RechargeService } from "src/app/services/rechargeService/recharge.service";


@Component({
  selector: "app-profile",
  templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {
  errorMessage: any;
  user: any;
  card: any;
  
  // cardId: any;
  // chargingHistory: any;
  chargingHistory: any[] = [];
  totalPower: number = 0;
  chargerLocation: any[] = [];
  recharges: any[] = [];
  tempRecharges = [];
  userGroupName: string | null = null;
  companyName: string | null = null;
  partnerName: string | null = null;
  user_id: any;
  entries: number = 10;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  activeRow: any;
  selected: any[] = [];
  usergr_id: any;
  userRole: string | null = null;
  isUserGroupAdmin: boolean = false;
  isUserGroupRole: boolean = false;
  isSplitWallet: boolean = false;
  userGroups: any;
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
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cardService: CardService,
    private chargingHistoryService: ChargingHistoryService,
    private chargerLocationService: ChargerLocationService,
    private userGroupMemberService: UserGroupMembersService,
    private userGroupService: UserGroupService,
    private companyMemberService: CompanyMemberService,
    private companyService: CompanyService,
    private partnerMemberService: PartnerMemberService,
    private partnerService: PartnerService,
    private router: Router,
    private rechargeService: RechargeService,
  ) { }

  ngOnInit() {
    const cugpCred = localStorage.getItem('cugpCred');
    const parsedCugpCred = JSON.parse(cugpCred);
    this.userRole = localStorage.getItem('userRole');
    this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.usergr_id = parsedCugpCred.usergr_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            logger.log("isUserGroupAdmin",this.isUserGroupAdmin)
            this.getUserGroupDetails(this.usergr_id);
            this.getCurrentUser();
            this.getChargingHistory();
            break;
            case 'USER_GROUP_USER':
              this.isUserGroupRole = true;
              this.getUserGroupDetails(this.usergr_id);
         break;
        }
      } else {
        logger.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      logger.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    this.getCurrentUser();
    this.getChargingHistory();

  }

  entriesChange($event: any) {
    this.entries = $event.target.value;
  }
  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      (data) => {
        if(!this.isUserGroupRole){
          this.isSplitWallet = true
        }
        logger.log("Current User", data.user.userId);
        this.getUser(data.user.userId)
        this.getRFIDCard(data.user.userId)
        this.checkMembership(data.user.userId)
        this.getRecharges(data.user.userId)
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getUser(userId: number) {
    logger.log("User Id On getUser Function", userId)
    this.userService.getUserById(userId).subscribe(
      (data) => {
        logger.log("User Details", data)
        this.user = data;
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getRFIDCard(userId: number) {
    this.cardService.getCardUser(userId).subscribe(
      (data) => {
        logger.log("RFID Card", data);
  
        // Kontrollojmë nëse `data.card` ekziston dhe ka të paktën një element
        if (data?.card?.length) {
          this.card = data.card[0];
          logger.log("RFID Card ID:", this.card?.card_id ?? 'No Card Available');
  
          this.getChargingHistory();
          // this.redirectToRecharge(this.card?.card_id)
        } else {
          logger.warn("No RFID Card found for this user.");
          this.card = null; // Vendosim `null` nëse nuk ka kartë
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error("Error fetching RFID Card:", error);
      }
    );
  }
  
  // checkMembership(userId: number) {
  //   // Check if the user is a User Group Member
  //   this.userGroupMemberService.getUserGroupMemberByUser(userId).subscribe(
  //     (response) => {
  //       console.log(response)
  //       if (response && response.userGroupMembers) {
  //         console.log(response.userGroupMembers);
  //         this.userGroupService.getUserGroup(response.userGroupMembers[0].usergr_id).subscribe(
  //           (userGroupData) => {
  //             this.userGroupName = userGroupData.userGroup.usergr_name;
  //             console.log('User belongs to User Group:', userGroupData);
  //           },
  //           (error) => console.log(error)
  //         );
  //       }
  //     },
  //     (error) => console.log(error)
  //   );

  //   // Check if the user is a Company Member
  //   this.companyMemberService.getCompanyMemberByUser(userId).subscribe(
  //     (response) => {
  //       console.log(response)
  //       if (response && response.company_member) {
  //         console.log(response.company_member);
  //         this.companyService.getCompany(response.company_member[0].company_id).subscribe(
  //           (companyData) => {
  //             this.companyName = companyData.company.company_name;
  //             console.log('User belongs to Company:', companyData);
  //           },
  //           (error) => console.log(error)
  //         );
  //       }
  //     },
  //     (error) => console.log(error)
  //   );

  //   // Check if the user is a Partner Member
  //   this.partnerMemberService.getPartnerMemberByUser(userId).subscribe(
  //     (response) => {
  //       console.log(response);
  //       if (response && response.partnerMembers) {
  //         console.log(response.partnerMembers)
  //         this.partnerService.getPartner(response.partnerMembers[0].partner_id).subscribe(
  //           (partnerData) => {
  //             this.partnerName = partnerData.partner.partner_name;
  //             console.log('User belongs to Partner:', partnerData.partner.partner_name);
  //           },
  //           (error) => console.log(error)
  //         );
  //       }
  //     },
  //     (error) => console.log(error)
  //   );
  // }

  checkMembership(userId: number) {
    // Reset values to avoid displaying old data
    this.userGroupName = null;
    this.companyName = null;
    this.partnerName = null;
  
    // Check if the user is a User Group Member
    this.userGroupMemberService.getUserGroupMemberByUser(userId).subscribe(
      (response) => {
        logger.log(response);
        if (response?.userGroupMembers?.length) {
          const userGroupId = response.userGroupMembers[0]?.usergr_id;
          if (userGroupId) {
            this.userGroupService.getUserGroup(userGroupId).subscribe(
              (userGroupData) => {
                this.userGroupName = userGroupData?.userGroup?.usergr_name ?? null;
                logger.log('User belongs to User Group:', this.userGroupName);
              },
              (error) => logger.error('UserGroup Error:', error)
            );
          }
        }
      },
      (error) => logger.error('UserGroupMember Error:', error)
    );
  
    // Check if the user is a Company Member
    this.companyMemberService.getCompanyMemberByUser(userId).subscribe(
      (response) => {
        logger.log(response);
        if (response?.company_member?.length) {
          const companyId = response.company_member[0]?.company_id;
          if (companyId) {
            this.companyService.getCompany(companyId).subscribe(
              (companyData) => {
                this.companyName = companyData?.company?.company_name ?? null;
                logger.log('User belongs to Company:', this.companyName);
              },
              (error) => logger.error('Company Error:', error)
            );
          }
        }
      },
      (error) => logger.error('CompanyMember Error:', error)
    );
  
    // Check if the user is a Partner Member
    this.partnerMemberService.getPartnerMemberByUser(userId).subscribe(
      (response) => {
        logger.log(response);
        if (response?.partnerMembers?.length) {
          const partnerId = response.partnerMembers[0]?.partner_id;
          if (partnerId) {
            this.partnerService.getPartner(partnerId).subscribe(
              (partnerData) => {
                this.partnerName = partnerData?.partner?.partner_name ?? null;
                logger.log('User belongs to Partner:', this.partnerName);
              },
              (error) => logger.error('Partner Error:', error)
            );
          }
        }
      },
      (error) => logger.error('PartnerMember Error:', error)
    );
  }
  
  getChargingHistory() { 
    this.chargingHistoryService.getChargingByCurrentUser().subscribe(
      (data) => {
        logger.log("Current User", data)
        this.chargingHistory = data.chargingHistory;
        this.calculateTotalPower();
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getChargerLocation(chargerId: number) {
    this.chargerLocationService.getChargerLocationByCharger(chargerId).subscribe(
      (data) => {
        logger.log("Charger Location", data)
        this.chargingHistory = data.chargingHistory;
        // this.calculateTotalPower();
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }

  getRecharges(userId: number) {
    this.rechargeService.getRechargesByUserId(userId).subscribe(
      (response) => {
        logger.log('API response:', response); // Log the entire response object

        if (response.success && Array.isArray(response.recharge)) {
          this.recharges = response.recharge;
          logger.log("recharers", this.recharges);
          this.tempRecharges = [...this.recharges]; // Make a copy for filtering
          logger.log("Fetched recharges:", this.recharges); // Log the actual recharges
        } else {
          this.recharges = [];
          logger.log("No recharges available or response format is incorrect.");
        }
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load recharges';
        logger.log('Error:', error); // Log any errors that occur
      }
    );
  }
  // calculateTotalPower() {
  //   this.totalPower = this.chargingHistory.reduce((sum, history) => sum + history.total_power, 0);
  //   console.log("Total Power:", this.totalPower);
  // }
  calculateTotalPower() {
    this.totalPower = this.chargingHistory.reduce((sum, history) => {
      const power = Number(history.total_power) || 0; // Convert to a number and handle invalid cases
      return sum + power;
    }, 0);
    logger.log("Total Power:", this.totalPower);
  }


  redirectToRecharge(cardId: number) {
    this.router.navigate([`/rfid-cards/recharge`, cardId]);
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

  onActivate(event: any) {
    this.activeRow = event.row;
    // if (event.type === 'click') {
    //   this.router.navigate([`/rfid-cards/rfidcard/${this.activeRow.usergr_id}`]);
    // }
  }

  onSelect({ selected }: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  
  getUserGroupDetails(id: number): void {
    this.userGroupService.getUserGroup(id).subscribe({
      next: (response) => {
        logger.log('response:', response);
        this.userGroups = response.userGroup;
        // Normalize split_wallet to a boolean
        const splitWalletValue = response.userGroup.split_wallet;
        this.isSplitWallet = splitWalletValue === '1' || splitWalletValue === 'true';
  
        logger.log('this.isSplitWallet (boolean):', this.isSplitWallet);
        logger.log('this.isUserGroupAdmin:', this.isUserGroupAdmin);
        if (this.userGroups.company_id) {
          this.companyService.getCompany(this.userGroups.company_id).subscribe(
            (companyData) => {
              logger.log("Company data:", companyData);
              this.userGroups.company_name = companyData.company.company_name;
              logger.log(" this.userGroups.company_name:", this.userGroups.company_name);
            },
            (error) => {
              logger.log("Error fetching company data:", error);
            }
          );
        }
        // Now you can safely use this.isSplitWallet as a boolean in the template
      }
    });
  }

}
