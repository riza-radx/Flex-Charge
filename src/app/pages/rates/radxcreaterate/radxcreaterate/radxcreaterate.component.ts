import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RateService } from "../../../../services/rateService/rate.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-radxcreaterate',
  templateUrl: './radxcreaterate.component.html',
  styles: []
})
export class RadxcreaterateComponent implements OnInit {
  @ViewChild('rateForm') rateForm!: NgForm;
  companies = [];
  company: any;
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

  rate: any = {
    name: '',
    companyId: '',
    defaultPrice: 0,
    percentage: 0,
    isDefault: false,   // 🆕 Set rate si default per kompani
    // 🆕 'sale' (default = Rate Shitje) | 'purchase' (Rate Blerje)
    rate_type: 'sale',
    // 🆕 Vetem kur rate_type='purchase': 'ACTIVE' | 'PIK'
    purchase_category: null,
  };
  errorMessage: string | null = null;

  constructor(
    private rateService: RateService,
    private companyService: CompanyService,
    private router: Router) { }

  ngOnInit() {
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
            this.getCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.getCompanies();
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
            // this.getCompaniesById(company_id);
            this.getCompaniesByCompany(company_id);
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

    // this.getCompanies();
  }

  getCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data: any) => {
        this.companies = data.company;
        console.log('Companies:', this.companies);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
  getCompaniesByCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data: any) => {
        this.company = data.company;
        console.log('Companies:', this.companies);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.rate.companyId = this.company.company_id;

    this.markFormGroupTouched(this.rateForm);
  
    // Check if the form is invalid
    if (this.rateForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return; // Prevent form submission if invalid
    }
  
    // Attempt to add the rate by calling the service
    this.rateService.addRate(this.rate).subscribe(
      (response) => {
        if (response) {
          console.log('Rate created successfully', this.rate);
          // Redirect to the rate details page
          this.router.navigate([`/rates/rate`]);
        } else {
          // If the response is empty or unexpected
          this.errorMessage = 'Failed to create rate. No response from server.';
        }
      },
      (error) => {
        // If an error occurs during the API call
        this.errorMessage = error.message || 'An unexpected error occurred while creating the rate.';
        console.error('Error creating rate:', error);
      }
    );
  }
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
