import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerLocationService } from 'src/app/services/chargerLocationService/charger-location.service';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-companyupdatepartner',
  templateUrl: './companyupdatepartner.component.html',
  styles: [
  ]
})
export class CompanyupdatepartnerComponent implements OnInit {
  partnerForm: FormGroup;
  partnerId: number;
  companies = [];
  partnerLogo: File | null = null;
  currentLogoName: any;
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
  countries: any[] = [];
  selectedCountryCode: string = '';
  constructor(
    private fb: FormBuilder,
    private partnerService: PartnerService,
    private partnerMemberService: PartnerMemberService,
    private chargerLocationService: ChargerLocationService,
    private chargerService: ChargerService,
    private userService: UserService,
    private companyService: CompanyService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.partnerForm = this.fb.group({
      partnerLogo: [''],
      partnerName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, Validators.required],
      nipt: [null, Validators.required],
      companyId: [null, Validators.required],
      monthlyPlatformFee: [null],
      monthly_platform_fee_per_charge_point: [null],
      monthly_platform_fee_per_charge_point_ac: [null],
      monthly_platform_fee_per_charge_point_dc: [null],
      ac_split_percentage: [null],
      dc_split_percentage: [null],
      splitPercentage: [null],
      allow_pay_as_you_go: [false, Validators.required],
      // 🆕 Burimi i faturimit te energjise. Dropdown me: OSHEE/PARTNER/INDIPENDENT/null.
      // Default 'OSHEE' sepse shumica e pikave faturohen nga OSHEE.
      energy_invoicing_source: ['OSHEE'],
      // 🆕 Fusha per integrim me BC / financat (opsionale). Partneri = VENDOR ne BC.
      vendor_number: [''],
    });
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    this.partnerId = this.route.snapshot.params['id'];
    this.getPartnerById(this.partnerId);

    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

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
            this.isCompanyAdmin = true;
            this.loadCompaniesById(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.loadCompaniesById(company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
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
    // console.log('this.partnerId:',this.partnerId);
    // throw new Error('Method not implemented.');
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe({
      next: (response) => {
        this.companies = response.company;
      },
      error: (error) => {
        logger.error('Error fetching companies', error);
      }
    });
  }

  // loadCompaniesById(companyId: number) {
  //   this.companyService.getCompany(companyId).subscribe(
  //     response => this.companies = response.company,
  //     error => console.error('Error fetching companies', error)
  //   );
  // }
  // Method to load a specific company by ID
  loadCompaniesById(companyId: number) {
    this.companyService.getCompany(companyId).subscribe({
      next: (response) => {
        this.companies = [response.company];
      },
      error: (error) => {
        logger.error('Error fetching company by ID', error);
      }
    });
  }

  onSubmit() {
    // Mark all form fields as touched to trigger validation errors
    if (this.partnerForm.invalid) {
      this.partnerForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => this.errorMessage = '', 5000); // Clear error message after 5 seconds
      return;
    }

    // Get form data
    const partnerData = this.partnerForm.value;

    // Set defaults for empty fields
    partnerData.monthlyPlatformFee = partnerData.monthlyPlatformFee || 0;
    partnerData.monthly_platform_fee_per_charge_point = partnerData.monthly_platform_fee_per_charge_point || 0;
    partnerData.monthly_platform_fee_per_charge_point_ac = partnerData.monthly_platform_fee_per_charge_point_ac || 0;
    partnerData.monthly_platform_fee_per_charge_point_dc = partnerData.monthly_platform_fee_per_charge_point_dc || 0;
    partnerData.ac_split_percentage = partnerData.ac_split_percentage || 0;
    partnerData.dc_split_percentage = partnerData.dc_split_percentage || 0;
    partnerData.splitPercentage = partnerData.splitPercentage || 0;

    // 🆕 Konverto null (opsioni "-- Not set --") ne string bosh perpara FormData.append,
    // sepse FormData e kthen null ne stringun literal "null" — backend-i pastaj do ta
    // interpretonte gabim. String bosh -> normalizuesi ne backend -> NULL ne DB.
    if (partnerData.energy_invoicing_source == null) {
      partnerData.energy_invoicing_source = '';
    }


    if (!this.partnerForm.get('allow_pay_as_you_go').value) {
      partnerData.allow_pay_as_you_go = false;
    }

    // Create FormData object for file upload
    const formData = new FormData();
    Object.keys(partnerData).forEach(key => {
      if (key !== 'partnerLogo') {
        formData.append(key, partnerData[key]);
      }
    });

    // Append the logo file to the form data
    if (this.partnerLogo) {
      formData.append('partnerLogo', this.partnerLogo, this.partnerLogo.name);
    }

    // Send to the service
    this.partnerService.updatePartner(this.partnerId, formData).subscribe({
      next: (response) => {
        if (response) {
          logger.log('Partner updated successfully:', response);
          this.router.navigate(['/partners/partner']);  // Navigate on success
        } else {
          logger.error('Failed to update partner:', response);
          this.errorMessage = 'Failed to update partner. Please try again later.';
          setTimeout(() => this.errorMessage = '', 5000); // Clear error message after 5 seconds
        }
      },
      error: (error) => {
        logger.error('Error updating partner:', error);
        this.errorMessage = error.message || 'An error occurred while updating the partner.';
        setTimeout(() => this.errorMessage = '', 5000); // Clear error message after 5 seconds
      }
    });
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.partnerLogo = file;
      logger.log('File selected:', file);
    }
  }

  async getPartnerById(id: number): Promise<void> {
    try {
      // Fetch the partner details
      const response = await this.partnerService.getPartner(id).toPromise();
      logger.log('ID:', id);
      logger.log('API response:', response);

      const partner = response.partner;
      logger.log(partner);

      // Set allowPayAsYouGo checkbox based on the API response
      const allow_pay_as_you_go = partner.allow_pay_as_you_go;
      const allowPayAsYouGoChecked = allow_pay_as_you_go === '1' || allow_pay_as_you_go === true || allow_pay_as_you_go === 'true';
      const logoUrl = partner.partner_logo;
      const logoFileName = logoUrl ? logoUrl.split('/').pop() : 'No logo available';
      this.currentLogoName = logoFileName;

      // Ensure the response data matches the form structure
      this.partnerForm.patchValue({
        partnerLogo: logoUrl,
        partnerName: partner.partner_name,
        address: partner.address,
        city: partner.city,
        phoneNumber: partner.phone_number,
        email: partner.email,
        nipt: partner.nipt,
        companyId: partner.company_id,
        monthlyPlatformFee: partner.monthly_platform_fee,
        monthly_platform_fee_per_charge_point: partner.monthly_platform_fee_per_charge_point,
        monthly_platform_fee_per_charge_point_ac: partner.monthly_platform_fee_per_charge_point_ac,
        monthly_platform_fee_per_charge_point_dc: partner.monthly_platform_fee_per_charge_point_dc,
        ac_split_percentage: partner.ac_split_percentage,
        dc_split_percentage: partner.dc_split_percentage,
        // 🆕 Burimi i faturimit — fusha e re string; nese eshte null perdor 'OSHEE' si default vizual.
        energy_invoicing_source: partner.energy_invoicing_source || 'OSHEE',
        // 🆕 Load fushat e integrimit BC. Partneri = VENDOR.
        vendor_number: partner.vendor_number || '',
        splitPercentage: partner.split_percentage,
        allow_pay_as_you_go: allowPayAsYouGoChecked,
        // userId: partner.user_id,
      });


    } catch (error) {
      logger.error('Error fetching partner or related details:', error);
    }
  }

  // Method to handle checkbox change
  onAllowPayAsYouGoChange(isChecked: boolean) {
    this.partnerForm.patchValue({
      allow_pay_as_you_go: isChecked
    });
  }

  // Change the country code when the country is selected
  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;
    const currentValue = this.partnerForm.get('phoneNumber')?.value;

    // Ensure the phone number starts with the selected country code
    if (currentValue && !currentValue.startsWith(this.selectedCountryCode)) {
      this.partnerForm.get('phoneNumber')?.setValue(this.selectedCountryCode + currentValue.replace(/^\+\d+/, ''));
    }
  }

  // Format the phone number when the user types
  formatPhoneNumber() {
    const currentValue = this.partnerForm.get('phoneNumber')?.value;

    if (currentValue && !currentValue.startsWith(this.selectedCountryCode)) {
      this.partnerForm.get('phoneNumber')?.setValue(this.selectedCountryCode + currentValue.replace(/^\+\d+/, ''));
    }
  }

}
