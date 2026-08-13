import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { RatePerDaysService } from 'src/app/services/ratePerDaysService/rate-per-days.service';
import { RateService } from 'src/app/services/rateService/rate.service';

@Component({
  selector: 'app-radxupdaterate',
  templateUrl: './radxupdaterate.component.html',
  styles: [
  ]
})
export class RadxupdaterateComponent implements OnInit {
  rateForm: FormGroup;
  rateId: number;
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
  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private rateService: RateService,
    private ratePerDayService: RatePerDaysService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.rateForm = this.fb.group({
      name: ['', Validators.required],
      companyId: ['', Validators.required],
      defaultPrice: ['', Validators.required],
      percentage: [null, Validators.required],
      isDefault: [false],   // 🆕 Set rate si default per kompani (single-default i menaxhuar nga backend)
      // 🆕 'sale' (default = Rate Shitje) | 'purchase' (Rate Blerje)
      rate_type: ['sale'],
      // 🆕 'ACTIVE' | 'PIK' — vetem kur rate_type='purchase'
      purchase_category: [null],
      // ratePerDays: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.rateId = this.route.snapshot.params['id'];
    this.getRateById(this.rateId);

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
            // this.getCompaniesById(company_id);
            this.loadCompaniesById(company_id);
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

    // this.loadCompanies();
    console.log('this.rateId:', this.rateId);
    // throw new Error('Method not implemented.');
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => console.error('Error fetching companies', error)
    );
  }
  loadCompaniesById(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      response => this.companies = [response.company],
      error => console.error('Error fetching companies', error)
    );
  }
  // get ratePerDays(): FormArray {
  //   return this.rateForm.get('ratePerDays') as FormArray;
  // }

  // createRatePerDayGroup(ratePerDay: any = {}): FormGroup {
  //   return this.fb.group({
  //     day: [ratePerDay.day || '', Validators.required],
  //     time: [ratePerDay.time || '', Validators.required],
  //     month: [ratePerDay.month || '', Validators.required],
  //     year: [ratePerDay.year || null, Validators.required],
  //     dayCreated: [ratePerDay.dayCreated || '', Validators.required],
  //     createdBy: [ratePerDay.createdBy || null, Validators.required]
  //   });
  // }

  // 🆕 Kur user-i nderron rate_type, sinkronizoj purchase_category:
  //   → Sale: pastro kategorine (s'ka kuptim).
  //   → Purchase: nese s'ka vlere te vjeter, default 'ACTIVE'.
  onRateTypeChange() {
    const type = this.rateForm.get('rate_type')?.value;
    if (type === 'sale') {
      this.rateForm.patchValue({ purchase_category: null });
    } else if (type === 'purchase' && !this.rateForm.get('purchase_category')?.value) {
      this.rateForm.patchValue({ purchase_category: 'ACTIVE' });
    }
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.rateForm.markAllAsTouched();
  
    // Check if the form is invalid
    if (this.rateForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return; // Prevent form submission if invalid
    }
  
    // Prepare the rate data for submission
    const rateData = this.rateForm.value;
    console.log('Submitting rate data:', rateData);
  
    // Attempt to update the rate by calling the service
    this.rateService.updateRate(this.rateId, rateData).subscribe({
      next: (response) => {
        if (response) {
          console.log('Rate updated successfully:', response);
          // Redirect to the rate details page with the updated rate ID
          this.router.navigate([`/rates/rate/${this.rateId}`]);
        } else {
          // If the response is empty or unexpected
          this.errorMessage = 'Failed to update rate. No response from server.';
          console.error('Failed to update rate:', response);
        }
      },
      error: (error) => {
        // If an error occurs during the API call
        this.errorMessage = error.message || 'An unexpected error occurred while updating the rate.';
        console.error('Error updating rate:', error);
      }
    });
  }
  

  async getRateById(id: number): Promise<void> {
    try {
      // Fetch the rate details
      const response = await this.rateService.getRate(id).toPromise();
      console.log('ID:', id);
      console.log('API response getRateById:', response);

      const rate = response.rate;

      // Ensure the response data matches the form structure
      this.rateForm.patchValue({
        name: rate.rate_name,
        companyId: rate.company_id,
        defaultPrice: rate.default_price,
        percentage: rate.percentage,
        isDefault: rate.is_default === true || rate.is_default === 1,   // 🆕 Sync me DB
        // 🆕 Load tipin dhe kategorine
        rate_type: rate.rate_type === 'purchase' ? 'purchase' : 'sale',
        purchase_category: rate.purchase_category || null
      });

      // // Fetch rate per days
      // const rateDaysResponse = await this.ratePerDayService.getRatePerDayByRate(id).toPromise();
      // console.log('Rate Days Response:', rateDaysResponse);
      // const rateDays = rateDaysResponse.ratePerDay || [];

      // // Clear existing rateDays
      // this.ratePerDays.clear();

      // // Patch the FormArray with rate per days details
      // rateDays.forEach((rateDay: any) => {
      //   const rateDayGroup = this.createRatePerDayGroup();
      //   rateDayGroup.patchValue({
      //     day: rateDay.day,
      //     time: rateDay.time,
      //     month: rateDay.month,
      //     year: rateDay.year,
      //     dayCreated: rateDay.date_created,
      //     createdBy: rateDay.created_by
      //   });
      //   this.ratePerDays.push(rateDayGroup);
      // });
    } catch (error) {
      console.error('Error fetching rate or rate days:', error);
    }
  }


}
