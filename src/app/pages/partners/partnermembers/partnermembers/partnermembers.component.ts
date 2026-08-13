import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { PartnerMemberService } from '../../../../services/partner-member.service';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { NgForm } from '@angular/forms';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';
@Component({
  selector: 'app-partnermembers',
  templateUrl: './partnermembers.component.html',
  styles: [
  ]
})
export class PartnermembersComponent {
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
    rate_id: null,
    created_date: '',
    customer_number: ''
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  partnerId: string | null = null;  // Define a variable to hold partnerId
  company: any;
  companies: any[] = [];
  errorMessage: string = '';
  companyName: string = '';
  companyId: string | null = null;
  rates = [];
  constructor(
    private authService: AuthService,
    private partnerMemberService: PartnerMemberService,
    private router: Router,
    private companyService: CompanyService,
    private rateService: RateService,
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
      console.log('Company ID:', this.companyId);
      this.getCompanyDetails(this.companyId);
    }
    this.loadCompanies();
    this.loadRatesbyCompany(this.companyId);
    // Retrieve partnerId from the route
    this.route.paramMap.subscribe(params => {
      this.partnerId = params.get('id');
      if (!this.partnerId) {
        console.error('Partner ID not found in the route');
      } else {
        console.log('Partner ID:', this.partnerId);
      }
    });
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
  loadRatesbyCompany(companyId: string) {
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
  getCompanyDetails(companyId: string) {
    this.companyService.getCompany(companyId).subscribe(
      (company) => {
        console.log('Company:', company);
        this.companyName = company.company.company_name;
      },
      (error) => {
        console.error('Error fetching company details', error);
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
    this.user.rate_id = this.user.rate_id === 0 ? null : this.user.rate_id;
    this.user.created_date = new Date().toISOString();
    console.log('this.user', this.user);
    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        console.log('User created successfully', response);
        // const userId = response.id;  // Assume the API returns the user ID in the response
        const userId = response.tokenUser.userId;

        if (!userId) {
          this.errorMessage = 'Something went wrong. User  was not created.';
          return;
        }


        if (!this.partnerId) {
          this.errorMessage = 'Partner is missing. Please select a partner before proceeding.';
          return;
        }

        const partnerMember = {
          partnerId: this.partnerId,  // Use the partnerId from the route
          userId: userId,
          type: this.user.role
        };

        this.partnerMemberService.addPartnerMember(partnerMember).subscribe(
          (memberResponse) => {
            console.log('Partner member created successfully', memberResponse);
            this.router.navigate([`/users/user/${userId}`]);
          },
          (error) => {
            console.error('Error creating partner member', error);

            // Custom error messages based on possible cases
            if (error.status === 400) {
              this.errorMessage = 'Invalid partner details. Please check and try again.';
            } else if (error.status === 403) {
              this.errorMessage = 'You do not have permission to add this partner member.';
            } else {
              this.errorMessage = 'Failed to add partner member. Please try again later.';
            }
          }
        );
      },
      (error) => {
        console.error('Error creating user', error);

        // Custom frontend error messages (ignoring backend response)
        if (error.status === 400) {
          this.errorMessage = 'Invalid user details. Please check your inputs and try again.';
        } else if (error.status === 409) {
          this.errorMessage = 'A user with this email already exists.';
        } else {
          this.errorMessage = 'User registration failed. Please try again later.';
        }
      }
    );
  }
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;
    const currentValue = this.user.phone_number;

    // Ensure the phone number starts with the selected country code
    if (currentValue && !currentValue.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + currentValue.replace(/^\+\d+/, '');
    }
  }

  formatPhoneNumber() {
    const currentValue = this.user.phone_number;

    // Check if the phone number starts with the selected country code, if not, add it
    if (currentValue && !currentValue.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + currentValue.replace(/^\+\d+/, '');
    }
  }

}
