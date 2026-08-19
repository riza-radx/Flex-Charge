import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CardService } from 'src/app/services/cardService/card.service';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { LocalListService } from 'src/app/services/localList/local-list.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';
function normalize(str: string | undefined | null): string {
  return (str ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}
@Component({
  selector: 'app-local-list',
  templateUrl: './local-list.component.html',
  styles: [
  ]
})
export class LocalListComponent {
  id: any;
  rows: any = [];
  temp = [];
  // createFor = 'card';
  rfidCards: any[] = [];
  localList: any = {};
  selectedCard: number | 'all' | null = null;
  selectedUser: number | 'all' | null = null;
  selectedItems: { name: string; card_id?: number; user_id?: number }[] = [];
  serial_no: any;
  username: any;
  availableCards: any[] = []; // Will be populated based on company selection
  availableUsers: any[] = []; // Will be populated based on company or user group selection
  company: any = {}; // To store the current company data
  errorMessage: string = '';
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
  companies = [];
  userGroups: any[] = [];
  company_id: any;
  userId: any;
  card_id: any;
  cardSearch = '';
  userSearch = '';
  filteredCards: any[] = [];
  filteredUsers: any[] = [];
  constructor(
    private localListService: LocalListService,
    private companyService: CompanyService,
    private userGroupService: UserGroupService,
    private userGroupMembersService: UserGroupMembersService,
    private cardService: CardService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.userRole = localStorage.getItem('userRole');

    this.id = this.route.snapshot.paramMap.get('id');
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      logger.log(" this.company_id", this.company_id)
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.getCompanies();
            this.getUserGroups(this.company_id);
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.getCompanies();
            this.getUserGroups(this.company_id);
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.getCompaniesById(this.company_id);
            this.getUserGroups(this.company_id);
            break
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


  }

  // live‑filtered arrays

  applyCardFilter(term: string): void {
    this.cardSearch = term;
    const q = normalize(term);
    this.filteredCards = this.availableCards.filter(c =>
      normalize(c.serial_no).includes(q)
    );
  }

  applyUserFilter(term: string): void {
    this.userSearch = term;
    const q = normalize(term);
    this.filteredUsers = this.availableUsers.filter(u => {
      const haystack = [
        u.username,
        u.firstName,   // adjust field names if needed
        u.lastName
      ].map(normalize).join('');
      return haystack.includes(q);
    });
  }
  onBelongsToChange(value: string): void {
    this.localList.belongsTo = value;
    logger.log("this.localList.belongsTo", this.localList.belongsTo)
    if (value === 'company' && this.company?.company_id) {
      logger.log("this.company?.company_id", this.company?.company_id)
      this.fetchCompanyData(this.company.company_id);
    }
  }

  onCreateForChange(value: string): void {
    this.localList.createFor = value;
    logger.log("Selected createFor:", this.localList.createFor);
    if (this.localList.belongsTo === 'company') {
      this.fetchCompanyData(this.company.company_id);
    }
    if (this.localList.belongsTo === 'userGroupId') {
      this.fetchUserGroupData(this.localList.userGroupId);
    }
  }

  onUserGroupChange(userGroupId: string): void {
    this.localList.userGroupId = userGroupId;
    logger.log("Selected User Group ID:", userGroupId);

    if (userGroupId) {
      this.fetchUserGroupData(userGroupId);
    }
  }
  fetchUserGroupData(id: any): void {
    if (this.localList.createFor === 'card') {
      this.getCardsByUserGroup(id);
    }
    if (this.localList.createFor === 'user') {
      this.getUserGroupMembers(id);
    }

  }
  fetchCompanyData(id: string): void {
    if (this.localList.createFor === 'card') {
      this.getCards(id);
    }
    if (this.localList.createFor === 'user') {
      this.getUsersByCompany(id);
    }

  }
  getCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data: any) => {
        this.companies = data.company;
        logger.log('Companies:', this.companies);
      },
      error => {
        logger.error('Error fetching companies:', error);
      }
    );
  }
  getUserGroups(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data) => {
        logger.log(data);
        this.userGroups = data.userGroup;
        logger.log(this.userGroups);
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

  // getUserGroupMembers(usergr_id: number) {
  //   this.userGroupMembersService.getUserGroupMemberByUserGroup(usergr_id).subscribe(
  //     (response: any) => {
  //       if (response && response.success && Array.isArray(response.userGroupMembers)) {
  //         this.rows = [];
  //         response.userGroupMembers.forEach(member => {
  //           this.userService.getUserById(member.user_id).subscribe(
  //             (userData) => {
  //               // console.log(userData.user);
  //               this.rows.push(userData.user);
  //               this.availableUsers = [...this.rows];
  //               console.log("getUserGroupMembers", this.availableUsers);
  //             },
  //             (error) => {
  //               console.error(`Error fetching user with ID ${member.user_id}:`, error);
  //             }
  //           );
  //         });
  //       } else {
  //         console.error('Unexpected response structure:', response);
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }

  getUserGroupMembers(usergr_id: number) {
  this.userGroupMembersService
      .getUserGroupMemberByUserGroup(usergr_id)
      .subscribe(
        async res => {
          if (!res?.success || !Array.isArray(res.userGroupMembers)) {
            logger.error('Unexpected response structure:', res);
            this.availableUsers = [];
            this.applyUserFilter(this.userSearch);  // 🔹 keep list in sync
            return;
          }

          /* gather all user requests in parallel */
          const memberRequests = res.userGroupMembers.map(m =>
            this.userService.getUserById(m.user_id).toPromise()
          );

          try {
            const userResponses = await Promise.all(memberRequests);
            this.availableUsers = userResponses
              .map(u => u?.user)
              .filter(Boolean);                   // remove nulls
          } catch (fetchErr) {
            logger.error('Error fetching individual users:', fetchErr);
            this.availableUsers = [];
          }

          /* 🔹 NOW update filteredUsers so the dropdown refreshes */
          this.applyUserFilter(this.userSearch);
        },
      );
}
  getCompaniesById(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data: any) => {
        this.company = data.company;
        logger.log('Companies:', this.companies);
      },
      error => {
        logger.error('Error fetching companies:', error);
      }
    );
  }

  getCards(id: string) {
    this.cardService.getCardByCompany(id).subscribe(
      (data: any) => {
        logger.log('API response:', data);

        // Check if the response contains the 'card' array
        if (data && data.success && Array.isArray(data.card)) {
          this.rfidCards = data.card;
          this.availableCards = [...this.rfidCards]; // Create a shallow copy for the table
          logger.log('RFID Cards:', this.availableCards);
          this.applyCardFilter(this.cardSearch);
        } else {
          logger.error('Unexpected data format:', data);
          this.availableCards = []; // Ensure the table is empty if data format is incorrect
          this.filteredCards = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching card data:', error);
        this.availableCards = []; // Ensure the table is empty on error
      }
    );
  }

  getUsersByCompany(companyId: any) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        this.availableUsers = data.users;
        this.applyUserFilter(this.userSearch);
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }

  getCardsByUserGroup(usergr_id: number) {
    this.cardService.getCardByUserGroup(usergr_id).subscribe(
      (data: any) => {
        logger.log('API response getCardsByUserGroup:', data);
        // this.availableCards = data.card;
        this.availableCards = data?.card ?? data?.cards ?? [];

        this.applyCardFilter(this.cardSearch);

      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching card data:', error);
      }
    );
  }


  async addSelectedCardOrUser(): Promise<void> {
    if (this.localList.createFor === 'card' && this.selectedCard) {
      logger.log('Fetching card details for ID:', this.selectedCard);
      if (this.selectedCard === 'all') {
        this.availableCards.forEach(c => {
          const alreadyAdded = this.selectedItems.some(si => si.card_id === c.card_id);
          if (!alreadyAdded) {
            this.selectedItems.push({ name: c.serial_no, card_id: c.card_id });
          }
        });
        return;                    // nothing more to do
      }
      if (this.selectedCard) {
        try {
          const cardData = await this.getCard(this.selectedCard);
          logger.log('Fetched card data:', cardData);
          if (cardData && cardData.card) {
            this.selectedItems.push({ name: cardData.card.serial_no, card_id: cardData.card.card_id });
            logger.log('Updated selectedItems:', this.selectedItems);
          }
        } catch (error) {
          logger.error('Error fetching card:', error);
        }
      }
    }
    //   else if (this.localList.createFor === 'user' && this.selectedUser) {
    //     console.log('Fetching user details for ID:', this.selectedUser);

    //     try {
    //       const userData = await this.getUserById(this.selectedUser);
    //       console.log('Fetched user data:', userData);
    //       if (userData && userData.user) {
    //         this.selectedItems.push({ name: userData.user.username, user_id: userData.user.id });
    //         console.log('Updated selectedItems:', this.selectedItems);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching user:', error);
    //     }
    //   }
    // }
    else if (this.localList.createFor === 'user') {

      /* 🔹 NEW branch for “All Users” */
      if (this.selectedUser === 'all') {
        this.availableUsers.forEach(u => {
          const exists = this.selectedItems.some(si => si.user_id === u.id);
          if (!exists) {
            this.selectedItems.push({ name: u.username, user_id: u.id });
          }
        });
        return; // finished with “all”, no further work
      }

      /* --- existing single‑user code (unchanged) --- */
      if (this.selectedUser) {
        try {
          const userData = await this.getUserById(this.selectedUser);
          if (userData?.user) {
            this.selectedItems.push({
              name: userData.user.username,
              user_id: userData.user.id
            });
          }
        } catch (err) {
          logger.error('Error fetching user:', err);
        }
      }
    }
  }
  getCard(id: any): Promise<any> {
    return firstValueFrom(this.cardService.getCard(id));
  }


  getUserById(id: number): Promise<any> {
    return firstValueFrom(this.userService.getUserById(id));
  }

  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
  }
  onSubmit(): void {
    // if (!this.localList.status) {
    //   this.errorMessage = 'Status must be selected.';
    //   return;
    // }
    let itemsToSend = this.selectedItems;
    if (
      this.localList.createFor === 'card' &&
      this.selectedCard === 'all' &&
      itemsToSend.length === 0
    ) {
      itemsToSend = this.availableCards.map(c => ({
        name: c.serial_no,
        card_id: c.card_id
      }));
    }
    if (this.localList.createFor === 'user' &&
      this.selectedUser === 'all' &&
      itemsToSend.length === 0) {
      itemsToSend = this.availableUsers.map(u => ({
        name: u.username,
        user_id: u.id
      }));
    }


    // Transform data to match API expectations
    const formattedData = this.selectedItems.map(item => ({
      userId: item.user_id ?? null,
      cardId: item.card_id ?? null,
      // status: this.localList.status
    }));

    logger.log("Submitting Data:", this.id, formattedData);

    this.localListService.addChargerLocalList(this.id, [...formattedData]).subscribe(
      response => {
        logger.log('Successfully submitted:', response);
        this.router.navigate([`/assets/chargers/${this.id}`]);
      },
      error => {
        this.errorMessage = 'Failed to submit the local list.';
        logger.error(error);
      }
    );
  }

}
