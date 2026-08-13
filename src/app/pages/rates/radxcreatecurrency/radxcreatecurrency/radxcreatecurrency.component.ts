import { Component, ViewChild } from '@angular/core';
import { CurrencyService } from "../../../../services/currencyService/currency.service";
import { CompanyService } from "../../../../services/companyService/company.service";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-radxcreatecurrency',
  templateUrl: './radxcreatecurrency.component.html',
  styles: [
  ]
})
export class RadxcreatecurrencyComponent {
  @ViewChild('currencyForm') currencyForm!: NgForm;
  currency = {
    currencyName: '',
  };

  companies = [];

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
  isRadXRole: boolean = false;
  // company_id: string;

  constructor(
    private currencyService: CurrencyService,
    private companyService: CompanyService,
    private router: Router
  ) { }

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
            this.isRadXRole = true;
            this.getCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
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
            // this.currency.companyId = company_id
            // this.getCompaniesById(company_id);
            // this.getCompaniesByCompany(company_id);
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

  onSubmit() {
    this.markFormGroupTouched(this.currencyForm);

    if (this.currencyForm.invalid) {
      // If the form is invalid, do not proceed with the submission
      return;
    }
    this.currencyService.addCurrency(this.currency).subscribe(
      (response) => {
        console.log('Currency created successfully:', response);
        this.router.navigate(['/rates/currency']);  // Adjust the navigation as needed
      },
      (error) => {
        console.error('Error creating currency:', error);
      }
    );
  }

  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
