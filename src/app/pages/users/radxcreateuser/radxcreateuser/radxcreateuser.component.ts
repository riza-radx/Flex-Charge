import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { Router } from '@angular/router';
import { UserGroupMembersService } from '../../../../services/userGroupMembersService/user-group-members.service'
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { PartnerMemberService } from "../../../../services/partner-member.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { NgForm } from '@angular/forms';
import { CountryService } from 'src/app/services/country/country.service';
@Component({
  selector: 'app-radxcreateuser',
  templateUrl: './radxcreateuser.component.html',
  styles: [
  ]
})
export class RadxcreateuserComponent {
  @ViewChild('userForm') userForm!: NgForm;
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
  companyData: any;
  partnerData: any;
  userGroupData: any;
  phoneNumberError: string | null = null;
  emailError: string | null = null
  company: any;
  companies: any[] = [];
  errorMessage: string = '';
  user = {
    name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: '',
    company: '',
    allowPayAsYouGo: false,
    send_invoice_by_email: false,
    created_date: '',
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  constructor(private authService: AuthService, private router: Router, private companyMemberService: CompanyMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private companyService: CompanyService,
    private countryService: CountryService,
    private partnerMemberService: PartnerMemberService,) { }

  ngOnInit() {

    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
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
            this.loadCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.loadCompanies();
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
            this.isCompanyAdmin = true;
            this.isCompanyModerator = true;
            this.isCompanyOperator = true;
            this.isCompanyTechnicalOperator = true;
            this.isCompanyMaintenanceSpecialist = true;
            this.isCompanyCallCenter = true;
            this.isCompanyAnalyst = true;
            this.isUserGroupAdmin = true;
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':

            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
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

    // this.getUsers()
  }


  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        console.log("Fetched companies:", data.company);
        this.companies = data.company.filter(company => company.is_whitelabel === 'false');
      },
      (error) => {
        console.log("Error fetching companies:", error);
      }
    );
  }
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  onSubmit() {
    this.markFormGroupTouched(this.userForm);

    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      return;
    }
    this.user.created_date = new Date().toISOString();
    if (this.isFormValid()) {
      this.authService.userRegisterFromDashboard(this.user).subscribe(
        (response: any) => {
          console.log('User created successfully', response);
          const userId = response.tokenUser?.userId;

          if (!userId) {
            this.errorMessage = 'Something went wrong. User ID was not created.';
            return;
          }

          this.router.navigate([`/users/user/${userId}`]);
        },
        (error) => {
          console.error('Error creating user', error);
          this.handleError(error);
        }
      );
    }
  }

  companyonSubmit() {
    this.user.created_date = new Date().toISOString();
    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        console.log('User created successfully', response);

        this.companyMemberService.addCompanyMember(this.companyData).subscribe(
          (data) => {
            console.log('Company member added successfully', data);
            this.router.navigate(['/users/user']);
          },
          (error) => {
            console.error('Error adding company member', error);
            this.handleError(error);
          }
        );
      },
      (error) => {
        console.error('Error creating user', error);
        this.handleError(error);
      }
    );
  }

  partneronSubmit() {
    this.user.created_date = new Date().toISOString();
    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        console.log('User created successfully', response);

        this.partnerMemberService.addPartnerMember(this.partnerData).subscribe(
          (data) => {
            console.log('Partner member added successfully', data);
            this.router.navigate(['/users/user']);
          },
          (error) => {
            console.error('Error adding partner member', error);
            this.handleError(error);
          }
        );
      },
      (error) => {
        console.error('Error creating user', error);
        this.handleError(error);
      }
    );
  }

  userGrouponSubmit() {
    this.user.created_date = new Date().toISOString();
    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        console.log('User created successfully', response);

        this.userGroupMembersService.addUserGroupMember(this.userGroupData).subscribe(
          (data) => {
            console.log('User group member added successfully', data);
            this.router.navigate(['/users/user']);
          },
          (error) => {
            console.error('Error adding user group member', error);
            this.handleError(error);
          }
        );
      },
      (error) => {
        console.error('Error creating user', error);
        this.handleError(error);
      }
    );
  }

  handleError(error: any) {
    if (error.status === 400) {
      this.errorMessage = 'Invalid data. Please check your inputs and try again.';
    } else if (error.status === 409) {
      this.errorMessage = 'A user with this email already exists.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to perform this action.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again later.';
    }

    setTimeout(() => {
      this.errorMessage = '';
    }, 5000); // Clears message after 5 seconds
  }
  // Validate the form fields
  isFormValid(): boolean {
    if (!this.user.name || !this.user.username || !this.user.email || !this.user.phone_number || !this.user.password || !this.user.role || !this.user.company) {
      console.error('Some required fields are missing.');
      return false;
    }

    // Validate phone number format
    //    const phoneRegex = /^\+355(68|69)\d{7}$/; // Adjust this regex as needed
    //   if (!phoneRegex.test(this.user.phone_number)) {
    //   this.phoneNumberError = 'Invalid phone number format. Phone should start with : +355'; // Set error message
    //   console.error('Invalid phone number format.');
    //   return false;
    // }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
    if (!emailRegex.test(this.user.email)) {
      this.emailError = 'Invalid email format.'; // Set error message
      console.error('Invalid email format.');
      return false;
    }


    return true;
  }
  // This method is triggered when a country is selected from the dropdown
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
}
