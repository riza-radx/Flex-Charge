import { Component, OnInit, ViewChild } from '@angular/core';
import { CardService } from "../../../../services/cardService/card.service";
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserService } from 'src/app/services/userService/user.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/auth.service';
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-radxcreaterfidcard',
  templateUrl: './radxcreaterfidcard.component.html',
  styles: [
  ]
})
export class RadxcreaterfidcardComponent implements OnInit {
  @ViewChild('cardForm') cardForm!: NgForm;
  @ViewChild('userForm') userForm!: NgForm;
  @ViewChild('userGroupForm') userGroupForm!: NgForm;
  card: any = {
    serialNo: '',
    blockNo: '',
    balance: 0,
    userId: '',
    companyId: '',
    usergrId: '',
    status: '',
    expiryDate: '',
    multiple_charging_session: "false",
    is_distributor_card: false,
    distributor_id: null,
    distributor_name: ''
  };
  user = {
    id: '',
    name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: '',
    company: '',
    allowPayAsYouGo: false,
    send_invoice_by_email: false,
    rate_id: null,
    created_date: '',

  };

  userGroup = {
    id: '',
    usergr_name: '',
    usergr_description: '',
    usergr_addres: '',
    usergr_city: '',
    usergr_country: '',
    usergr_phone_no: '',
    usergr_email: '',
    allow_pay_as_you_go: false,
    usergrLogoURL: '',
    company_id: '',
    rate_id: null
  };

  countries: any[] = [];
  selectedCountryCode: string = '';
  rates = [];
  createFor = 'user';
  users = [];
  companies = [];
  userGroups = [];
  partners = [];
  minDate: string;
  company: any;
  filteredRates: any[] = [];
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
  phoneNumberError: string | null = null;
  emailError: string | null = null;
  userSearchTerm: string = '';
  filteredUsersFiltered = [];
  filteredUsers: any[] = [];  // Lista e përdoruesve të filtruar
  filteredUserGroups: any[] = [];  // Lista e grupeve të përdoruesve të filtruar
  // 🆕 Distributor (partner) dropdown me search — shfaqet vetem kur user-i eshte
  // COMPANY_ADMIN dhe check-on "Karte Distributori". Ruan partner_id ne
  // card.distributor_id dhe partner_name ne card.distributor_name.
  partnerSearchTerm: string = '';
  filteredPartners: any[] = [];
  showUserPopup: boolean = false;
  showUserGroupPopup: boolean = false;
  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(
    private cardService: CardService,
    private companyService: CompanyService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private userGroupMembersService: UserGroupMembersService,
    private partnerService: PartnerService,
    private rateService: RateService,
    private companyMemberService: CompanyMemberService,
    private authService: AuthService,
    private countryService: CountryService,
    private router: Router) { }

  // users = [];
  // companies = [];
  // userGroups = [];

  ngOnInit() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    // Calculate today's date in the format YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero to month if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero to day if necessary

    // Set minDate to today’s date in 'YYYY-MM-DD' format
    this.minDate = `${year}-${month}-${day}`;

    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.loadUsers();
            this.loadCompanies();
            this.loadUserGroups();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.loadUsers();
            this.loadCompanies();
            this.loadUserGroups();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.loadCompanyMembers(company_id);
            this.loadCompaniesByID(company_id);
            this.loadUserGroupsByCompany(company_id);
            this.loadPartnersGroupsByCompany(company_id);
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
            this.loadCompanyMembers(company_id);
            this.loadCompaniesByID(company_id);
            this.loadUserGroupsByCompany(company_id);
            this.loadPartnersGroupsByCompany(company_id);
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
    //   this.loadUsers();
    // this.loadCompanies();
    // this.loadUserGroups();
    // this.loadPartners();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      response => this.users = response.users,
      error => console.error('Error fetching users', error)
    );
  }

  // loadCompanyMembers(companyId: number) {
  //   this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
  //     (data) => {
  //       console.log(data);
  //       // if (data && Array.isArray(data.company_member)) {
  //         this.users = data.company_member.User;
  //         console.log(data.company_member)

  //         // Filter out any null entries from the result in case of errors
  //         // this.companyMembers = this.companyMembers.filter(member => member !== null);
  //       // } else {
  //       //   console.error('Expected an array but got:', data);
  //       //   // this.companyMembers = [];
  //       // }
  //     },
  //     error => {
  //       console.error('Error fetching company members:', error);
  //       // this.companyMembers = []; // Clear company members in case of error
  //     }
  //   );
  // }

  loadCompanyMembers(companyId: number) {

    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        this.filteredUsers = data.users;
        this.filteredUsersFiltered = this.filteredUsers;
        this.loadRatesbyCompany(companyId);
      },
      (error) => {
        console.error('Error fetching company members:', error);
      }
    );
  }

  loadUserGroupMembers(userGroupIdId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupIdId).subscribe(
      (data) => {
        console.log(data);

        // Ensure that data contains the company_member array
        if (data && Array.isArray(data.userGroupMembers)) {
          // Reset the users array
          this.users = [];

          // Iterate over userGroupMembers array and push the `User` objects to the `users` array
          data.userGroupMembers.forEach((member) => {
            if (member.User) {
              this.users.push(member.User);  // Add the `User` object to `users` array
            }
          });

          console.log('Extracted Users:', this.users);
        } else {
          console.error('Unexpected response structure:', data);
        }
      },
      (error) => {
        console.error('Error fetching company members:', error);
      }
    );
  }



  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => console.error('Error fetching companies', error)
    );
  }

  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data: any) => {
        this.filteredUserGroups = data.userGroup;
        console.log('Companies:', this.userGroups);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
  // Company Loads
  // loadUsersByCompany(companyId: number) {
  //   this.userService.getAllUsers().subscribe(
  //     response => this.users = response.users,
  //     error => console.error('Error fetching users', error)
  //   );
  // }

  loadCompaniesByID(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      response => this.company = response.company,
      error => console.error('Error fetching companies', error)
    );
  }

  loadUserGroupsByCompany(companyId: number) {

    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data: any) => {
        this.filteredUserGroups = data.userGroup;
        console.log('Companies:', this.userGroups);
        this.loadRatesbyCompany(companyId);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
  loadPartnersGroupsByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data: any) => {
        this.partners = data.partner || [];
        this.filteredPartners = [...this.partners];
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  // 🆕 Filter partners per dropdown-in search-able te "Emri i Distributorit".
  filterPartners() {
    const term = (this.partnerSearchTerm || '').toLowerCase();
    this.filteredPartners = (this.partners || []).filter((p: any) =>
      (p.partner_name || '').toLowerCase().includes(term)
    );
  }

  // 🆕 Kur user-i zgjedh nje partner nga dropdown-i, mbush distributor_name.
  // distributor_id vendoset automatikisht nga [(ngModel)] ne select. Nuk lexojme
  // event.target.value — per [ngValue] me primitive Angular vendos aty ID te
  // brendshem, jo vleren aktuale.
  onDistributorSelectChange(_event: Event) {
    const selectedId = this.card.distributor_id;
    const partner = (this.partners || []).find((p: any) => p.partner_id == selectedId);
    this.card.distributor_name = partner ? partner.partner_name : '';
  }

  // 🆕 Kur checkbox-i "Karte Distributori" behet uncheck, pastro dropdown-in.
  onDistributorToggle() {
    if (!this.card.is_distributor_card) {
      this.card.distributor_id = null;
      this.card.distributor_name = '';
      this.partnerSearchTerm = '';
      this.filteredPartners = [...(this.partners || [])];
    }
  }

  onSubmit() {
    this.card.companyId = this.company.company_id;

    this.markFormGroupTouched(this.cardForm);

    if (this.cardForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }

    if (this.createFor !== 'userGroup') {
      this.card.usergrId = null;
    }
    if (this.createFor !== 'user') {
      this.card.userId = null;
    }

    this.card.multiple_charging_session = this.card.multiple_charging_session ? 'true' : 'false';

    console.log('this.isFormValid()', this.isFormValid());
    if (this.isFormValid()) {
      console.log('this.card', this.card);
      this.cardService.addCard(this.card).subscribe({
        next: (response) => {
          console.log('RFID Card creation response:', response);

          if (!response.success) {
            this.errorMessage = 'Failed to create RFID card.';
            setTimeout(() => (this.errorMessage = ''), 5000);
            return;
          }

          this.successMessage = 'RFID Card created successfully!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/rfid-cards/rfidcard']);
          }, 3000);
        },
        error: (error) => {
          console.error('Error creating RFID Card:', error);
          this.handleError(error);
        }
      });
    }
  }

  handleError(error: any) {
    if (error.status === 400) {
      this.errorMessage = 'Invalid data. Please check your inputs and try again.';
    } else if (error.status === 409) {
      this.errorMessage = 'This card already exists.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to create this card.';
    } else if (error.status === 500) {
      this.errorMessage = 'A server error occurred. Please try again later.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again.';
    }

    setTimeout(() => {
      this.errorMessage = '';
    }, 5000); // Clears message after 5 seconds
  }
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  // Method to handle dropdown change
  onCreateForChange(selectedOption: string) {
    this.createFor = selectedOption;
  }

  isFieldDisabled(field: string): boolean {
    if (this.createFor === 'userGroup' && field !== 'usergrId') return true;
    if (this.createFor === 'user' && field !== 'userId') return true;
    return false;
  }

  isFormValid(): boolean {
    if (!this.card.serialNo || !this.card.blockNo || !this.card.expiryDate || !this.card.status) {
      console.error('Some required fields are missing.');
      return false;
    }

    if (this.createFor === 'user' && !this.card.userId) {
      console.error('User is required when creating for a user.');
      return false;
    }

    if (this.createFor === 'userGroup' && !this.card.usergrId) {
      console.error('User Group is required when creating for a user group.');
      return false;
    }

    return true;
  }

  // onCompanyChange() {
  //   this.card.companyId = this.company?.company_id;
  //   if (this.card.companyId) {
  //     console.log("this.card.companyId", this.card.companyId);
  //     // Merrni përdoruesit për kompaninë e zgjedhur
  //     this.userService.getUserByCompany(this.company.companyId).subscribe(users => {
  //       console.log("users", users);
  //       this.filteredUsers = users.users;
  //     });
  //     console.log("this.filteredUsers", this.filteredUsers);
  //     // Merrni grupet e përdoruesve për kompaninë e zgjedhur
  //     this.userGroupService.getUserGroupByCompany(this.card.companyId).subscribe(userGroups => {
  //       this.filteredUserGroups = userGroups.userGroup;
  //       console.log("users", userGroups);
  //     });
  //     console.log("this.filteredUserGroups", this.filteredUserGroups);
  //   }
  // }



  onSubmitUser() {

    // Ensure companyId is set before submitting
    this.user.company = this.company.company_id;
    this.markFormGroupTouched(this.userForm);

    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      return;
    }


    if (!this.user.company) {
      console.error('Company ID is missing');
      this.errorMessage = 'Company ID is required.';
      return;
    }
    this.user.created_date = new Date().toISOString();
    this.user.rate_id = (this.user.rate_id === "" || this.user.rate_id === null || isNaN(Number(this.user.rate_id)) || this.user.rate_id === 0)
      ? null : Number(this.user.rate_id);
    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        console.log('User created successfully', response);

        const userId = response.tokenUser?.userId;
        const userName = response.tokenUser?.name;

        if (!userId) {
          console.error('User ID not found in the response');
          this.errorMessage = 'An error occurred: User ID is missing.';
          return;
        }

        const companyMember = {
          companyId: this.user.company,
          userId: userId,
          type: this.user.role
        };

        console.log('Creating company member:', companyMember);

        this.companyMemberService.addCompanyMember(companyMember).subscribe(
          (memberResponse) => {
            console.log('Company member created successfully', memberResponse);

            const newUser = { id: userId, name: userName };
            this.filteredUsers.push(newUser);

            this.card.userId = userId;

            console.log('New user added to dropdown:', newUser);
            this.successMessage = 'User successfully added to company.';
            setTimeout(() => (this.successMessage = ''), 5000);
          },
          (error) => {
            console.error('Error creating company member', error);
            this.handleUserError(error);
          }
        );

        this.closeUserPopup();
      },
      (error) => {
        console.error('Error creating user', error);
        this.handleUserError(error);
      }
    );
  }

  loadRatesbyCompany(companyId: number) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        console.log("Fetched rates:", data.rate);
        this.rates = data.rate;
      },
      (error) => {
        console.log("Error fetching rates:", error);
      }
    );
  }

  handleUserError(error: any) {
    if (error.status === 400) {
      this.errorMessage = 'Invalid data. Please check your inputs and try again.';
    } else if (error.status === 409) {
      this.errorMessage = 'This user already exists in the system.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to create this user.';
    } else if (error.status === 500) {
      this.errorMessage = 'A server error occurred. Please try again later.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again.';
    }

    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  onUserSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'create') {
      this.openUserPopup(); // Open the popup to create a new location
    } else {
      // Handle selecting an existing location (if needed)
      const selectedLocationId = selectedValue;
      console.log('Selected Location ID:', selectedLocationId);
      // You can add additional logic here for using the selected location ID
    }
  }
  openUserPopup(): void {
    this.showUserPopup = true;
    console.log(this.showUserPopup);
  }

  // To close the popup
  closeUserPopup(): void {
    this.showUserPopup = false;
  }
  isUserGroupFormValid(): boolean {
    this.phoneNumberError = null; // Reset the error message

    if (!this.userGroup.usergr_name || !this.userGroup.usergr_addres ||
      !this.userGroup.usergr_email || !this.userGroup.usergr_city ||
      !this.userGroup.usergr_country || !this.userGroup.usergr_description) {
      console.error('Some required fields are missing.');
      return false;
    }

    // Validate phone number format
    // const phoneRegex = /^\+355(68|69)\d{7}$/; // Adjust this regex as needed
    // if (!phoneRegex.test(this.userGroup.usergr_phone_no)) {
    //   this.phoneNumberError = 'Invalid phone number format. Phone should start with : +355'; // Set error message
    //   console.error('Invalid phone number format.');
    //   return false;
    // }

    return true;
  }
  onSubmitUserGroup() {
    console.log('Company ID:', this.card.companyId);
    this.userGroup.company_id = this.company.company_id;

    this.markFormGroupTouched(this.userGroupForm);

    if (this.userGroupForm.invalid) {
      console.error('User group form is invalid!');
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      return;
    }

    if (this.isUserGroupFormValid()) {
      const formData = new FormData();

      formData.append('usergr_name', this.userGroup.usergr_name);
      formData.append('usergr_description', this.userGroup.usergr_description);
      formData.append('usergr_addres', this.userGroup.usergr_addres);
      formData.append('usergr_city', this.userGroup.usergr_city);
      formData.append('usergr_country', this.userGroup.usergr_country);
      formData.append('usergr_phone_no', this.userGroup.usergr_phone_no);
      formData.append('usergr_email', this.userGroup.usergr_email);
      formData.append('allow_pay_as_you_go', JSON.stringify(this.userGroup.allow_pay_as_you_go));
      formData.append('company_id', this.userGroup.company_id);
      formData.append('rate_id', this.userGroup.rate_id);
      // Append the file if selected
      if (this.selectedFile) {
        formData.append('user_group_logo', this.selectedFile);
      }

      console.log('Submitting user group data:', formData);

      // Call the userGroupService to create the user group
      this.userGroupService.addUserGroup(formData).subscribe(
        (response: any) => {
          console.log('User group created successfully!', response);

          // Ensure response contains user group details
          if (!response?.userGroup?.usergr_id) {
            console.error('User group ID is missing from the response');
            this.errorMessage = 'An error occurred: User group ID is missing.';
            return;
          }

          const newUserGroup = {
            usergr_id: response.userGroup.usergr_id,
            usergr_name: response.userGroup.usergr_name,
          };

          this.filteredUserGroups.push(newUserGroup);
          this.card.usergrId = newUserGroup.usergr_id;
          this.successMessage = 'User group created successfully!';

          setTimeout(() => (this.successMessage = ''), 5000); // Auto-hide success message
          this.closeUserGroupPopup();
        },
        (error) => {
          console.error('Error creating user group:', error);
          this.handleUserGroupError(error);
        }
      );
    }
  }
  handleUserGroupError(error: any) {
    if (error.status === 400) {
      this.errorMessage = 'Invalid data. Please check your inputs and try again.';
    } else if (error.status === 409) {
      this.errorMessage = 'This user group already exists.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to create this user group.';
    } else if (error.status === 500) {
      this.errorMessage = 'A server error occurred. Please try again later.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again.';
    }

    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
  onUserGroupSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'create') {
      this.openUserGroupPopup();
    } else if (selectedValue) {
      this.card.usergrId = selectedValue;
      console.log('Selected User Group ID:', selectedValue);
    } else {
      console.warn('No valid user group selected.');
    }
  }
  openUserGroupPopup(): void {
    this.showUserGroupPopup = true;
    console.log(this.showUserGroupPopup);
    setTimeout(() => {
      const firstInput = document.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  // To close the popup
  closeUserGroupPopup(): void {
    this.showUserGroupPopup = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.userGroup.usergrLogoURL = reader.result as string; // Store the file as a base64 URL or upload it.
      };
      reader.readAsDataURL(file);
    }
  }

  // This method is triggered when a country is selected from the dropdown
  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (this.user.phone_number && !this.user.phone_number.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + this.user.phone_number.replace(/^\+\d+/, '');
    }
  }

  // This method formats the phone number to ensure it always has the selected country code
  formatPhoneNumber() {
    if (this.user.phone_number && !this.user.phone_number.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + this.user.phone_number.replace(/^\+\d+/, '');
    }
  }
  // This method is triggered when a country is selected from the dropdown
  onCountryChangeUserGroup(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (this.userGroup.usergr_phone_no && !this.userGroup.usergr_phone_no.startsWith(this.selectedCountryCode)) {
      this.userGroup.usergr_phone_no = this.selectedCountryCode + this.userGroup.usergr_phone_no.replace(/^\+\d+/, '');
    }
  }

  // This method formats the phone number to ensure it always has the selected country code
  formatPhoneNumberUserGroup() {
    if (this.userGroup.usergr_phone_no && !this.userGroup.usergr_phone_no.startsWith(this.selectedCountryCode)) {
      this.userGroup.usergr_phone_no = this.selectedCountryCode + this.userGroup.usergr_phone_no.replace(/^\+\d+/, '');
    }
  }

filterUsers() {
  const term = this.userSearchTerm.toLowerCase();
  this.filteredUsersFiltered = this.filteredUsers.filter(user =>
    user.name.toLowerCase().includes(term)
  );
}
}
