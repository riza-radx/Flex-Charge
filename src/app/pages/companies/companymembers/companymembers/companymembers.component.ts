import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { CompanyMemberService } from '../../../../services/companyMemberService/company-member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';
@Component({
  selector: 'app-companymembers',
  templateUrl: './companymembers.component.html',
  styles: []
})
export class CompanymembersComponent {
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
    customer_number: '',
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  rates = [];
  companyId: string | null = null;  // Initialize companyId
  company: any;
  companies: any[] = [];
  errorMessage: string = '';
  companyName: string = '';
  constructor(
    private authService: AuthService,
    private companyMemberService: CompanyMemberService,
    private router: Router,
    private companyService: CompanyService,
    private rateService: RateService,
    private countryService: CountryService,
    private route: ActivatedRoute  // Inject ActivatedRoute to access route parameters
  ) { }

  ngOnInit() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    // Get companyId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
    });
    if (this.companyId) {
      this.user.company = this.companyId;
    }
    this.getCompanyDetails(this.companyId);
    this.loadRatesbyCompany(this.companyId);
    console.log("company id", this.companyId);
    console.log("this.user.company", this.user.company);
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

  onSubmit() {
    this.markFormGroupTouched(this.userForm);

    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      return;
    }
    this.user.created_date = new Date().toISOString();
    console.log("this.user", this.user)

    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        console.log('User created successfully', response);
        const userId = response.tokenUser?.userId;

        if (!userId) {
          this.errorMessage = 'Something went wrong. User ID was not created.';
          return;
        }

        this.user.company = this.companyId;

        const companyMember = {
          companyId: this.companyId,
          userId: userId,
          type: this.user.role
        };

        this.companyMemberService.addCompanyMember(companyMember).subscribe(
          (memberResponse) => {
            console.log('Company member created successfully', memberResponse);
            this.router.navigate([`/users/user/${userId}`]);
          },
          (error) => {
            console.error('Error creating company member', error);

            // Custom error messages based on possible cases
            if (error.status === 400) {
              this.errorMessage = 'Invalid company details. Please check and try again.';
            } else if (error.status === 403) {
              this.errorMessage = 'You do not have permission to add this company member.';
            } else {
              this.errorMessage = 'Failed to add company member. Please try again later.';
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

    // Ensure the phone number field starts with the selected country code
    if (!this.user.phone_number.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + this.user.phone_number.replace(/^\+\d+/, '');
    }
  }

  formatPhoneNumber() {
    if (!this.user.phone_number.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + this.user.phone_number.replace(/^\+\d+/, '');
    }
  }

}
