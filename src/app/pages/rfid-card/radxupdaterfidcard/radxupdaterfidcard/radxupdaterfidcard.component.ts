import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from 'src/app/services/cardService/card.service';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';

@Component({
  selector: 'app-radxupdaterfidcard',
  templateUrl: './radxupdaterfidcard.component.html',
  styles: []
})
export class RadxupdaterfidcardComponent implements OnInit {
  rfidCardForm: FormGroup;
  rfidCardId: number;
  users = [];
  companyUsers = [];
  companies = [];
  userGroups = [];
  statusOptions = ['active', 'expired', 'lost', 'pending'];
  userSearchControl = new FormControl('');
  filteredUsersFiltered: any[] = [];
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
  errorMessage: string = '';
  successMessage: string = '';
  minDate: string;
  // 🆕 Partner (distributor) dropdown me search — vetem COMPANY_ADMIN.
  partners: any[] = [];
  filteredPartners: any[] = [];
  partnerSearchTerm: string = '';
  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private companyService: CompanyService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private companyMemberService: CompanyMemberService,
    private partnerService: PartnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.rfidCardForm = this.fb.group({
      serialNo: ['', Validators.required],
      blockNo: ['', Validators.required],
      balance: ['', Validators.required],
      userId: [null],
      companyId: [''],
      usergrId: [null],
      status: ['', Validators.required],
      expiryDate: ['', Validators.required],
      multiple_charging_session: ["false"],
      is_distributor_card: [false],
      distributor_id: [null],
      distributor_name: ['']
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.rfidCardId = this.route.snapshot.params['id'];
    this.getCardById(this.rfidCardId);

    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isAble = true;
            this.loadUsers();
            this.loadCompanies();
            this.loadUserGroups();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isAble = true;
            this.loadUsers();
            this.loadCompanies();
            this.loadUserGroups();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isAble = true;
            this.loadCompanyMembers(company_id);
            this.loadCompanyUsers(company_id);
            this.loadCompaniesByID(company_id);
            this.loadUserGroupsByCompany(company_id);
            this.loadPartnersByCompany(company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            // this.getCompaniesById(company_id);
            this.isAble = true;
            this.loadCompanyMembers(company_id);
            this.loadCompanyUsers(company_id);
            this.loadCompaniesByID(company_id);
            this.loadUserGroupsByCompany(company_id);
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
    // this.loadUsers();
    // this.loadCompanies();
    // this.loadUserGroups();

  }


  loadUsers() {
    this.userService.getAllUsers().subscribe(
      response => this.users = response.users,
      error => logger.error('Error fetching users', error)
    );
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => logger.error('Error fetching companies', error)
    );
  }

  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data: any) => {
        this.userGroups = data.userGroup;
        // console.log("this.userGroups", this.userGroups);
      },
      error => {
        logger.error('Error fetching user groups:', error);
      }
    );
  }

  loadCompanyMembers(companyId: number) {
    this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
      (data) => {
        // console.log(data);

        // Ensure that data contains the company_member array
        if (data && Array.isArray(data.company_member)) {
          // Reset the users array
          this.users = [];

          // Iterate over company_member array and push the `User` objects to the `users` array
          data.company_member.forEach((member) => {
            if (member.User) {
              this.users.push(member.User);  // Add the `User` object to `users` array
            }
          });

          // console.log('Extracted Users:', this.users);
        } else {
          logger.error('Unexpected response structure:', data);
        }
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }
  loadCompanyUsers(companyId: number) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        this.companyUsers = data.users;
        this.filteredUsersFiltered = [...this.companyUsers];
        this.userSearchControl.valueChanges.subscribe(term => {
          const searchTerm = (term || '').toLowerCase();
          this.filteredUsersFiltered = this.companyUsers.filter(user =>
            user.name?.toLowerCase().includes(searchTerm)
          );
        });
        logger.log("this.filteredUsersFiltered in loadCompanyUsers", this.filteredUsersFiltered)
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }

  loadCompaniesByID(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      response => this.companies = [response.company],
      error => logger.error('Error fetching companies', error)
    );
  }

  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data: any) => {
        this.userGroups = data.userGroup;
        // console.log('Companies:', this.userGroups);
      },
      error => {
        logger.error('Error fetching companies:', error);
      }
    );
  }

  // 🆕 Ngarko partneret e kompanise per dropdown-in e distributorit (vetem COMPANY_ADMIN).
  loadPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data: any) => {
        this.partners = data.partner || [];
        this.filteredPartners = [...this.partners];
      },
      error => {
        logger.error('Error fetching partners:', error);
      }
    );
  }

  filterPartners() {
    const term = (this.partnerSearchTerm || '').toLowerCase();
    this.filteredPartners = (this.partners || []).filter((p: any) =>
      (p.partner_name || '').toLowerCase().includes(term)
    );
  }

  onDistributorSelectChange(_event: Event) {
    // Mos lexo event.target.value — per select-in me [ngValue] Angular vendos aty
    // nje ID te brendshem (psh "0", "1"), jo partner_id-ne aktuale.
    // FormControl e ka tashme vleren e sakte (numer) — lexojme nga form-i.
    const selectedId = this.rfidCardForm.value.distributor_id;
    const partner = (this.partners || []).find((p: any) => p.partner_id == selectedId);
    this.rfidCardForm.patchValue({
      distributor_name: partner ? partner.partner_name : ''
    }, { emitEvent: false });
  }

  onDistributorToggle() {
    const on = this.rfidCardForm.value.is_distributor_card;
    if (!on) {
      this.rfidCardForm.patchValue({ distributor_id: null, distributor_name: '' });
      this.partnerSearchTerm = '';
      this.filteredPartners = [...(this.partners || [])];
    }
  }

  onSubmit() {
    if (this.rfidCardForm.invalid) {
      logger.log('Submitting this.rfidCardForm.invalid:', this.rfidCardForm.invalid);
      this.rfidCardForm.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }


    const rfidCardData = this.rfidCardForm.value;
    if (rfidCardData.userId !== null) {
      rfidCardData.userId = parseInt(rfidCardData.userId, 10);
    }
    if (rfidCardData.usergrId !== null) {
      rfidCardData.usergrId = parseInt(rfidCardData.usergrId, 10);
    }

    logger.log('Submitting rfidCardData:', rfidCardData);
    rfidCardData.multiple_charging_session =
      rfidCardData.multiple_charging_session ? 'true' : 'false';
    this.cardService.updateCard(this.rfidCardId, rfidCardData).subscribe({
      next: (response) => {
        logger.log('Card updated successfully:', response);

        if (!response.success) {
          // Backend returned success: false, show error message
          this.errorMessage = 'Failed to update RFID card.';
          setTimeout(() => (this.errorMessage = ''), 5000);
          return;
        }

        // If successful, show success message and navigate
        this.successMessage = 'RFID Card updated successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/rfid-cards/rfidcard']);
        }, 3000);
      },
      error: (error) => {
        logger.error('Error updating RFID card:', error);
        this.handleError(error);
      }
    });
  }

  handleError(error: any) {
    if (error.status === 400) {
      this.errorMessage = 'Invalid data. Please check your inputs and try again.';
    } else if (error.status === 404) {
      this.errorMessage = 'RFID Card not found. It may have been deleted.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to update this RFID Card.';
    } else if (error.status === 500) {
      this.errorMessage = 'A server error occurred. Please try again later.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again.';
    }

    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  getCardById(id: number): void {
    this.cardService.getCard(id).subscribe({
      next: (response) => {
        const card = response.card;
        // console.log("card", card)
        // Ensure the response data matches the form structure
        this.rfidCardForm.patchValue({
          serialNo: card.serial_no,
          blockNo: card.block_no,
          balance: card.balance,
          userId: card.user_id || null,
          companyId: card.company_id || null,
          usergrId: card.usergr_id || null,
          status: card.status,
          expiryDate: card.expiry_date,
          multiple_charging_session: card.multiple_charging_session === 'true',
          is_distributor_card: !!card.is_distributor_card,
          distributor_id: card.distributor_id != null ? card.distributor_id : null,
          distributor_name: card.distributor_name || ''
        });
      },
      error: (error) => {
        logger.error('Error fetching card details:', error);
      }
    });
  }

  // onSearchInput(event: any) {
  //   console.log('Input value:', event.target.value);  // Confirm value is typed
  //   this.userSearchTerm = event.target.value;
  //   this.filterUsers();
  // }
  // filterUsers() {
  //   const term = (this.userSearchTerm || '').toLowerCase();
  //   console.log('Filtering users with term:', term);

  //   this.filteredUsersFiltered = this.companyUsers.filter(user => {
  //     const name = typeof user.name === 'string' ? user.name.toLowerCase() : '';
  //     return name.includes(term);
  //   });

  //   console.log('Filtered users count:', this.filteredUsersFiltered.length);
  // }
}
