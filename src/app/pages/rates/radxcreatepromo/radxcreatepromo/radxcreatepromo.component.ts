import { Component, OnInit, ViewChild } from '@angular/core';
import { PromoService } from "../../../../services/promoService/promo.service";
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { NgForm } from '@angular/forms';
import { RateService } from 'src/app/services/rateService/rate.service';

@Component({
  selector: 'app-radxcreatepromo',
  templateUrl: './radxcreatepromo.component.html',
  styles: [
  ]
})
export class RadxcreatepromoComponent implements OnInit {

  @ViewChild('promoForm') promoForm!: NgForm;
  // promo = {
  //   promoName: '',
  //   promoCode: '',
  //   percentage: 0,
  //   amount: 0,
  //   companyId: '',
  //   isEnabled: false
  // };
  promo = {
    promoName: '',
    promoCode: '',
    percentage: 0,
    amount: 0,
    companyId: '',
    rateId: '',
    userRole: '',
    offerChargingCount: 0,
    offerChargingEnergy: 0,
    timePeriod: '',
    isEnabled: false,
    madeBy: '',
    modifiedBy: ''
  };
  companies = [];
  useAmount: boolean = false;
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
  errorMessage: string = '';
  company_name: string = '';
  company_id: any;
  rates = [];
  constructor(
    private promoService: PromoService,
    private companyService: CompanyService,
    private rateService: RateService,
    private router: Router) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
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
            this.getCompaniesById(this.company_id);
            this.loadRatesbyCompany(this.company_id);
            // this.getPromoByCompanyID(company_id);
            break
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
  getCompaniesById(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data: any) => {
        this.company = data.company;
        this.company_name = this.company.company_name
        console.log('Companies:', this.companies);
      },
      error => {
        console.error('Error fetching companies:', error);
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
  getPromoByCompanyID(companyId: number) {
    this.promoService.getPromoByCompany(companyId).subscribe(
      (data: any) => {
        this.promo = data.promo;

        console.log('promo data:', data);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  onSubmit() {
    this.promo.companyId = this.company.company_id;

    this.markFormGroupTouched(this.promoForm);

    if (this.promoForm.invalid) {
      // If the form is invalid, mark all fields as touched and show an error message
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
      return;
    }

    this.promoService.addPromo(this.promo).subscribe(
      (response) => {
        console.log('Promo created successfully', response);
        this.router.navigate(['/rates/promo']);  // Redirect to promos list or another page
      },
      (error) => {
        console.error('Error creating promo', error);
        this.errorMessage = error.message || 'An error occurred while creating the promo.';
        setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
      }
    );
  }

  toggleUseAmount() {
    if (this.useAmount) {
      this.promo.percentage = 0;  // Clear percentage if using amount
    } else {
      this.promo.amount = 0;  // Clear amount if using percentage
    }
  }

  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }


}
