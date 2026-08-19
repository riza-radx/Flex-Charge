import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { PromoService } from 'src/app/services/promoService/promo.service';
import { RateService } from 'src/app/services/rateService/rate.service';

@Component({
  selector: 'app-radxupdatepromo',
  templateUrl: './radxupdatepromo.component.html',
  styles: [
  ]
})
export class RadxupdatepromoComponent implements OnInit {
  promoForm: FormGroup;
  promoId: number;
  companies = [];
  company: any;
  rates = [];
  company_name: string = '';
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
  company_id: any;
  constructor(
    private fb: FormBuilder,
    private promoService: PromoService,
    private companyService: CompanyService,
    private rateService: RateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.promoForm = this.fb.group({
      promoName: ['', Validators.required],
      promoCode: ['', Validators.required],
      percentage: [0],
      amount: [0],
      companyId: ['', Validators.required],
      rateId: ['', Validators.required],
      userRole: ['', Validators.required], // COMPANY_USER | USER_GROUP_USER | PARTNER_USER
      offerChargingCount: [0, [Validators.min(0)]],
      offerChargingEnergy: [0, [Validators.min(0)]],
      timePeriod: ['', Validators.required], // daily, weekly, monthly, yearly
      isEnabled: [false, Validators.required],
      madeBy: [''],
      modifiedBy: ['']
    });
  }

  ngOnInit(): void {
    this.promoId = this.route.snapshot.params['id'];
    this.getPromoById(this.promoId);

    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
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
            // this.getCompaniesById(company_id);
            this.loadCompaniesById(this.company_id);
            this.loadRatesbyCompany(this.company_id);
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

    // this.loadCompanies();
    // console.log('this.promoId:',this.promoId);
    // throw new Error('Method not implemented.');
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => logger.error('Error fetching companies', error)
    );
  }
  loadCompaniesById(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data: any) => {
        this.company = data.company;
        this.company_name = this.company.company_name
        logger.log('Companies:', this.companies);
      },
      error => {
        logger.error('Error fetching companies:', error);
      }
    );
  }

  loadRatesbyCompany(companyId: number) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        logger.log("Fetched rates:", data.rate);
        this.rates = data.rate;
      },
      (error) => {
        logger.log("Error fetching rates:", error);
      }
    );
  }
  // onSubmit() {
  //   if (this.promoForm.invalid) {
  //     // If the form is invalid, mark all fields as touched to show error messages
  //     this.promoForm.markAllAsTouched();
  //     this.errorMessage = 'Please fill in all required fields.';
  //     setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
  //     return;
  //   }

  //   const promoData = {
  //     ...this.promoForm.value,
  //     isEnabled: this.promoForm.value.isEnabled ? 'true' : 'false' // Convert boolean back to string for submission
  //   };
  //   console.log('Submitting promoData:', promoData);

  //   this.promoService.updatePromo(this.promoId, promoData).subscribe({
  //     next: (response) => {
  //       if (response) {
  //         console.log('Promo updated successfully:', response);
  //         this.router.navigate(['/rates/promo']);
  //       } else {
  //         console.error('Failed to update promo:', response);
  //         this.errorMessage = 'Failed to update promo. Please try again later.';
  //         setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error updating promo:', error);
  //       this.errorMessage = error.message || 'An error occurred while updating the promo.';
  //       setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
  //     }
  //   });
  // }
  onSubmit() {
    if (this.promoForm.invalid) {
      // Show validation errors
      this.promoForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }

    // Prepare promo data for submission
    const promoData = {
      promoName: this.promoForm.value.promoName,
      promoCode: this.promoForm.value.promoCode,
      percentage: this.promoForm.value.percentage,
      amount: this.promoForm.value.amount || 0,
      companyId: this.promoForm.value.companyId,
      rateId: this.promoForm.value.rateId,
      userRole: this.promoForm.value.userRole,
      offerChargingCount: this.promoForm.value.offerChargingCount,
      offerChargingEnergy: this.promoForm.value.offerChargingEnergy,
      timePeriod: this.promoForm.value.timePeriod,
      isEnabled: this.promoForm.value.isEnabled, // ✅ Convert boolean to DB format
      // made_by: this.promoForm.value.madeBy || '',
      // modified_by: this.promoForm.value.modifiedBy || ''
    };

    logger.log('Submitting promoData:', promoData);

    // Send update request
    this.promoService.updatePromo(this.promoId, promoData).subscribe({
      next: (response) => {
        if (response) {
          logger.log('✅ Promo updated successfully:', response);
          this.router.navigate(['/rates/promo', this.promoId]);
        } else {
          logger.error('❌ Failed to update promo:', response);
          this.errorMessage = 'Failed to update promo. Please try again later.';
          setTimeout(() => (this.errorMessage = ''), 5000);
        }
      },
      error: (error) => {
        logger.error('❌ Error updating promo:', error);
        this.errorMessage = error.message || 'An error occurred while updating the promo.';
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }


  getPromoById(id: number): void {
    this.promoService.getPromo(id).subscribe({
      next: (response) => {
        logger.log('ID:', id);
        logger.log('API response:', response);

        const promo = response.promo;

        // ✅ Convert DB value (varchar) to boolean safely
        const isEnabled = promo.is_enabled === 1 || promo.is_enabled === true;

        // ✅ Patch all form fields
        this.promoForm.patchValue({
          promoName: promo.promo_name,
          promoCode: promo.promo_code,
          percentage: promo.discount_percentage || 0,
          amount: promo.amount || 0,
          companyId: promo.company_id || '',
          rateId: promo.rate_id || '',
          userRole: promo.user_role || '',
          offerChargingCount: promo.offer_charging_count || 0,
          offerChargingEnergy: promo.offer_charging_energy || 0,
          timePeriod: promo.time_period || '',
          isEnabled: isEnabled,
          madeBy: promo.made_by || '',
          modifiedBy: promo.modified_by || ''
        });
      },
      error: (error) => {
        logger.error('❌ Error fetching promo details:', error);
      }
    });
  }

}
