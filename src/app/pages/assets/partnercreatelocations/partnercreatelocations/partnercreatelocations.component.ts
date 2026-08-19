import { logger } from '@core/logger';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { NgForm } from '@angular/forms';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-partnercreatelocations',
  templateUrl: './partnercreatelocations.component.html',
  styles: [
  ]
})
export class PartnercreatelocationsComponent {
  @ViewChild('locationForm') locationForm!: NgForm;
  @ViewChild('partnerForm') partnerForm!: NgForm;
  location: any = {
    id: '',
    locationName: '',
    address: '',
    city: '',
    country: '',
    companyId: null,
    partnerId: null,
    latitude: null,
    longitude: null,
    // 🆕 Vendor Number OSHEE — vetem COMPANY_ADMIN/COMPANY_ANALYST i vendosin (kontrolli behet ne template).
    vendor_number_oshee: ''
  };
  partner = {
    id: '',
    partnerName: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    nipt: '',
    companyId: '',
    monthlyPlatformFee: null,
    monthly_platform_fee_per_charge_point: null,
    monthly_platform_fee_per_charge_point_ac: null,
    monthly_platform_fee_per_charge_point_dc: null,
    ac_split_percentage: null,
    dc_split_percentage: null,
    allow_pay_as_you_go: false,
    splitPercentage: null,
    partnerLogoURL: '',  // Added partner_logo field
  };
  countries: any[] = [];
  selectedCountryCode: string = '';

  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null;
  companies = [];
  partners = [];
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
  company_id: any;
  partner_id: any;
  showPopup: boolean = false;
  constructor(private locationService: ChargerLocationService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private countryService: CountryService,
    private router: Router) { }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      logger.log("this.company_id", this.company_id)
      this.partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.loadCompanies();
            this.loadPartners();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.loadCompanies();
            this.loadPartners();
            break;
          case 'COMPANY_ADMIN':
            // 🆕 Set isCompanyAdmin qe fusha Vendor Number OSHEE te aktivizohet ne template.
            this.isCompanyAdmin = true;
            this.loadCompaniesByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            break;
          case 'COMPANY_ANALYST':
            // 🆕 Set isCompanyAnalyst qe fusha Vendor Number OSHEE te aktivizohet ne template.
            this.isCompanyAnalyst = true;
            this.loadCompaniesByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.loadCompaniesByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);

            // this.getCurrencies(company_id);
            break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getTaxesByByUserGroup(usergroup_id);
          //   break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            // this.loadCompaniesByPartner(partner_id);
            this.loadPartnersByPartner(this.partner_id);
            break;
          // case 'USER':
          case 'COMPANY_USER':
          // case 'SUPER_USER':
          // this.getTaxesByByUser(user_id);
          // // this.getCurrencies(company_id);
          // break;
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
    // this.loadPartners();
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => logger.error('Error fetching companies', error)
    );
  }

  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      response => this.partners = response.partners,
      error => logger.error('Error fetching partners', error)
    );
  }
  loadCompaniesByCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      response => this.company = response.company,
      error => logger.error('Error fetching companies', error)
    );
  }

  loadPartnersByCompany(partnerId: number) {
    this.partnerService.getPartnerByCompany(partnerId).subscribe(
      response => this.partners = response.partner,
      error => logger.error('Error fetching partners', error)
    );
  }
  loadPartnersByPartner(partnerId: number) {
    this.partnerService.getPartner(partnerId).subscribe(
      response => { this.partners = [response.partner]; this.loadCompaniesByCompany(response.partner.company_id); },
      error => logger.error('Error fetching partners', error)
    );
  }

  onSubmit() {
    this.markFormGroupTouched(this.locationForm);
    this.location.companyId = this.company.company_id;

    if (this.locationForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }

    // Ensure companyId is set before submission


    this.locationService.createChargerLocation(this.location).subscribe({
      next: (response) => {
        logger.log('Location created successfully:', response);

        if (!response.success) {
          this.errorMessage = response.message || 'Failed to create location.';
          setTimeout(() => (this.errorMessage = ''), 5000);
          return;
        }

        this.successMessage = 'Location created successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/assets/locations']);
        }, 3000);
      },
      error: (error) => {
        logger.error('Error creating location:', error);
        this.handleError(error);
      }
    });
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
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onPartnerSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue === 'create') {
      this.openPopup(); // Open the popup to create a new location
    } else {
      // Handle selecting an existing location (if needed)
      const selectedLocationId = selectedValue;
      logger.log('Selected Location ID:', selectedLocationId);
      // You can add additional logic here for using the selected location ID
    }
  }
  onSubmitPartner() {
    this.partner.companyId = this.company.company_id;

    this.markFormGroupTouched(this.partnerForm);
    if (this.partnerForm.invalid) {
      return;
    }

    this.partner.monthlyPlatformFee = this.partner.monthlyPlatformFee || 0;
    this.partner.splitPercentage = this.partner.splitPercentage || 0;
    this.partner.monthly_platform_fee_per_charge_point = this.partner.monthly_platform_fee_per_charge_point || 0;
    this.partner.monthly_platform_fee_per_charge_point_ac = this.partner.monthly_platform_fee_per_charge_point_ac || 0;
    this.partner.monthly_platform_fee_per_charge_point_dc = this.partner.monthly_platform_fee_per_charge_point_dc || 0;
    this.partner.ac_split_percentage = this.partner.ac_split_percentage || 0;
    this.partner.dc_split_percentage = this.partner.dc_split_percentage || 0;

    const formData = new FormData();
    formData.append('partnerName', this.partner.partnerName);
    formData.append('address', this.partner.address);
    formData.append('city', this.partner.city);
    formData.append('phoneNumber', this.partner.phoneNumber);
    formData.append('email', this.partner.email);
    formData.append('nipt', this.partner.nipt);
    formData.append('companyId', this.partner.companyId);
    formData.append('monthlyPlatformFee', this.partner.monthlyPlatformFee.toString());
    formData.append('splitPercentage', this.partner.splitPercentage.toString());
    formData.append('monthly_platform_fee_per_charge_point', this.partner.monthly_platform_fee_per_charge_point.toString());
    formData.append('monthly_platform_fee_per_charge_point_ac', this.partner.monthly_platform_fee_per_charge_point_ac.toString());
    formData.append('monthly_platform_fee_per_charge_point_dc', this.partner.monthly_platform_fee_per_charge_point_dc.toString());
    formData.append('ac_split_percentage', this.partner.ac_split_percentage.toString());
    formData.append('dc_split_percentage', this.partner.dc_split_percentage.toString());
    formData.append('allow_pay_as_you_go', JSON.stringify(this.partner.allow_pay_as_you_go));

    if (this.selectedFile) {
      formData.append('partner_logo', this.selectedFile);
    }

    this.partnerService.createPartner(formData).subscribe(
      response => {
        logger.log('Partner created successfully!', response);
        const newPartner = response.partner;

        // Add the new partner to the partners list
        this.partners.push(newPartner);

        // Set the new partner as the selected partner in the location form
        this.location.partnerId = newPartner.partner_id;

        // Close the popup
        this.closePopup();
      },
      error => {
        logger.error('Error creating partner:', error);
      }
    );
  }

  openPopup(): void {
    this.showPopup = true;
    setTimeout(() => {
      const firstInput = document.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
  closePopup(): void {
    this.showPopup = false;
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size < 5 * 1024 * 1024 && ['image/png', 'image/jpeg'].includes(file.type)) {
      this.selectedFile = file;
    } else {
      logger.error('Invalid file type or size exceeds the limit.');
      this.selectedFile = null; // Reset if invalid
    }
  }

  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (!this.partner.phoneNumber.startsWith(this.selectedCountryCode)) {
      this.partner.phoneNumber = this.selectedCountryCode + this.partner.phoneNumber.replace(/^\+\d+/, '');
    }
  }

  formatPhoneNumber() {
    if (!this.partner.phoneNumber.startsWith(this.selectedCountryCode)) {
      this.partner.phoneNumber = this.selectedCountryCode + this.partner.phoneNumber.replace(/^\+\d+/, '');
    }
  }

}
