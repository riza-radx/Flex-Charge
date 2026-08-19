import { logger } from '@core/logger';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { UserGroupMembersService } from '../../../../services/userGroupMembersService/user-group-members.service';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { NgForm } from '@angular/forms';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { RateService } from 'src/app/services/rateService/rate.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { CountryService } from 'src/app/services/country/country.service';


@Component({
  selector: 'app-usergroupmembers',
  templateUrl: './usergroupmembers.component.html',
  styles: [
  ]
})
export class UsergroupmembersComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
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
    allow_money_transfert: false,
    rate_id: null,
    created_date: '',
    customer_number:'',
    dimension_value: ''
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  userGroupId: string | null = null;  // Define a variable to hold userGroupId
  companyId: string | null = null;
  company: any;
  companies: any[] = [];
  errorMessage: string = '';
  companyName: string = '';
  rates = [];
  rateName: string = '';
  rate_id: any;
  customer_number: any;
  dimension_value: any;
  allowPayAsYouGo: any;
  send_invoice_by_email: any;
  isSplitWallet: boolean = false;
  constructor(
    private authService: AuthService,
    private userGroupMemberService: UserGroupMembersService,
    private rateService: RateService,
    private userGroupService: UserGroupService,
    private router: Router,
    private companyService: CompanyService,
    private countryService: CountryService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.companyId = parsedCugpCred.company_id;
      logger.log('Company ID:', this.companyId);
      this.getCompanyDetails(this.companyId);
      this.loadRatesbyCompany(this.companyId);

    }
    this.loadCompanies();
    // Retrieve userGroupId from the route
    this.route.paramMap.subscribe(params => {
      this.userGroupId = params.get('id');
      this.getUserGroupDetails(this.userGroupId)
      if (!this.userGroupId) {
        logger.error('User Group ID not found in the route');
      } else {
        logger.log('User Group ID:', this.userGroupId);
      }
    });
  }

  getCompanyDetails(companyId: string) {
    this.companyService.getCompany(companyId).subscribe(
      (company) => {
        logger.log('Company:', company);
        this.companyName = company.company.company_name;
      },
      (error) => {
        logger.error('Error fetching company details', error);
      }
    );
  }

  getUserGroupDetails(id: string): void {
    this.userGroupService.getUserGroup(id).subscribe({
      next: (response) => {
        logger.log('response:', response);
        this.rate_id = response.userGroup.rate_id;
        this.customer_number = response.userGroup.customer_number;
        this.dimension_value = response.userGroup.dimension_value;
        this.allowPayAsYouGo = response.userGroup.allow_pay_as_you_go	;
        this.send_invoice_by_email = response.userGroup.send_invoice_by_email;
        const splitWalletValue = response.userGroup.split_wallet;
        this.isSplitWallet = splitWalletValue === '1' || splitWalletValue === 'true'; 
        logger.log(" this.send_invoice_by_email", this.send_invoice_by_email)
        this.getRateNameById(this.rate_id);
      },
      error: (error) => {
        logger.error('Error fetching User details:', error);
      }
    });
  }

  loadRatesbyCompany(companyId: string) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        logger.log("Fetched rates:", data.rate);
        this.rates = data.rate;
        logger.log("Rates after loading:", this.rates);
        this.getRateNameById(this.rate_id);
      },
      (error) => {
        logger.log("Error fetching rates:", error);
      }
    );
  }


  getRateNameById(rateId: string): string {
    logger.log("Searching for rateId:", rateId);
    logger.log("Rates available:", this.rates);

    const rate = this.rates.find(r => r.rate_id === rateId);
    logger.log("Found rate:", rate);

    if (rate) {
      this.rateName = rate.rate_name;
    } else {
      this.rateName = 'No Rate Selected';
    }

    return this.rateName;
  }


  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        logger.log("Fetched companies:", data.company);
        this.companies = data.company.filter(company => company.is_whitelabel === 'false');
      },
      (error) => {
        logger.log("Error fetching companies:", error);
      }
    );
  }
  onSubmit() {
    this.markFormGroupTouched(this.userForm);

    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      return;
    }
    this.user.company = this.companyId;
    this.user.rate_id = this.rate_id;
    this.user.customer_number = this.customer_number;
    this.user.dimension_value = this.dimension_value;
    this.user.allowPayAsYouGo = this.allowPayAsYouGo;
    this.user.send_invoice_by_email = this.send_invoice_by_email;
    this.user.created_date = new Date().toISOString();
    logger.log('Submitting user registration:', this.user);

    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        logger.log('User created successfully', response);
        const userId = response.tokenUser?.userId;

        if (!userId) {
          this.errorMessage = 'Something went wrong. User ID was not created.';
          return;
        }

        if (!this.userGroupId) {
          logger.error('User Group ID not found');
          this.errorMessage = 'User Group ID is missing. Please try again.';
          return;
        }

        logger.log('User Group ID:', this.userGroupId); // Log the User Group ID
        const userGroupMember = {
          userGroupId: this.userGroupId,  // Use the userGroupId from the route
          userId: userId,
          type: this.user.role
        };

        logger.log('Creating user group member with data:', userGroupMember);

        this.userGroupMemberService.addUserGroupMember(userGroupMember).subscribe(
          (memberResponse) => {
            logger.log('User Group member created successfully', memberResponse);
            this.router.navigate([`/users/user/${userId}`]);
          },
          (error) => {
            logger.error('Error creating user group member', error);
            this.handleError(error);
          }
        );
      },
      (error) => {
        logger.error('Error creating user', error);
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
    } else if (error.status === 500) {
      this.errorMessage = 'A server error occurred. Please try again later.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again later.';
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