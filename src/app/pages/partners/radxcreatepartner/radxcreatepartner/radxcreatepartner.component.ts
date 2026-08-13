import { Component, OnInit, ViewChild } from '@angular/core';
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { NgForm } from '@angular/forms';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-radxcreatepartner',
  templateUrl: './radxcreatepartner.component.html',
  styles: [
  ]
})
export class RadxcreatepartnerComponent implements OnInit {
  @ViewChild('partnerForm') partnerForm!: NgForm;
  partner = {
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
    // 🆕 Burimi i faturimit te energjise. Dropdown me: OSHEE/PARTNER/INDIPENDENT/null.
    // Default 'OSHEE' sepse shumica e pikave faturohen nga OSHEE.
    energy_invoicing_source: 'OSHEE',
    // 🆕 Fusha per integrim me BC / financat (opsionale). Vetem COMPANY_ADMIN/COMPANY_ANALYST i editojne.
    // Partneri eshte VENDOR (furnitor) ne BC — prandaj `vendor_number`, jo `customer_number`.
    vendor_number: '',
    // userId: ''
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  selectedFile: File | null = null; // To store the uploaded file
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
  phoneNumberError: string | null = null;
  emailError: string | null = null;
  errorMessage: string = '';
  constructor(
    private partnerService: PartnerService,
    private companyService: CompanyService,
    private countryService: CountryService,
    private router: Router) { }


  ngOnInit() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
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
            this.isCompanyAdmin = true;
            this.getCompaniesById(company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getCompaniesById(company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'USER':
case 'COMPANY_USER':
          case 'SUPER_USER':
            this.getCompaniesById(company_id);
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size < 5 * 1024 * 1024 && ['image/png', 'image/jpeg'].includes(file.type)) {
      this.selectedFile = file;
    } else {
      console.error('Invalid file type or size exceeds the limit.');
      this.selectedFile = null; // Reset if invalid
    }
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
        console.log('Companies:', this.companies);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
  // onSubmit() {
  //   if (this.isFormValid()) {
  //     this.partnerService.createPartner(this.partner).subscribe(
  //       response => {
  //         console.log('Partner created successfully!', response);
  //         this.router.navigate(['/partners/partner']);
  //       },
  //       error => {
  //         console.error('Error creating partner:', error);
  //       }
  //     );
  //   }
  // }
  onSubmit() {
    this.partner.companyId = this.company.company_id;

    this.markFormGroupTouched(this.partnerForm);
  
    if (this.partnerForm.invalid) {
      // If the form is invalid, mark all fields as touched to show error messages
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => this.errorMessage = '', 5000); // Clear error message after 5 seconds
      return;
    }
  
    if (this.isFormValid()) {
      // Set empty fields to 0 if they are not filled in
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
  
      // Append all fields to formData (if they have values)
      formData.append('monthlyPlatformFee', this.partner.monthlyPlatformFee.toString());
      formData.append('splitPercentage', this.partner.splitPercentage.toString());
      formData.append('monthly_platform_fee_per_charge_point', this.partner.monthly_platform_fee_per_charge_point.toString());
      formData.append('monthly_platform_fee_per_charge_point_ac', this.partner.monthly_platform_fee_per_charge_point_ac.toString());
      formData.append('monthly_platform_fee_per_charge_point_dc', this.partner.monthly_platform_fee_per_charge_point_dc.toString());
      formData.append('ac_split_percentage', this.partner.ac_split_percentage.toString());
      formData.append('dc_split_percentage', this.partner.dc_split_percentage.toString());
  
      // Handle optional fields like `allow_pay_as_you_go`
      formData.append('allow_pay_as_you_go', JSON.stringify(this.partner.allow_pay_as_you_go));

      // 🆕 Energy invoicing source (string) — 'OSHEE'/'PARTNER'/'INDIPENDENT' ose bosh.
      formData.append('energy_invoicing_source', this.partner.energy_invoicing_source || '');

      // 🆕 Vendor number (bosh nese s'e ka vendosur user-i). Partneri = VENDOR ne BC.
      formData.append('vendor_number', this.partner.vendor_number || '');
  
      // Append the file if selected
      if (this.selectedFile) {
        formData.append('partner_logo', this.selectedFile);
      }
  
      // Call the service to create the partner
      this.partnerService.createPartner(formData).subscribe(
        response => {
          console.log('Partner created successfully!', response);
          this.router.navigate(['/partners/partner']); // Navigate on success
        },
        error => {
          console.error('Error creating partner:', error);
          this.errorMessage = error.message || 'An error occurred while creating the partner.';
          setTimeout(() => this.errorMessage = '', 5000); // Clear error message after 5 seconds
        }
      );
    }
  }
  
  isFormValid(): boolean {
    if (!this.partner.city || !this.partner.email || !this.partner.nipt || !this.partner.partnerName || !this.partner.phoneNumber || !this.partner.address ) {
      console.error('Some required fields are missing.');
      return false;
    }

    // Validate phone number format
    //   const phoneRegex = /^\+355(68|69)\d{7}$/; // Adjust this regex as needed
    //   if (!phoneRegex.test(this.partner.phoneNumber)) {
    //   this.phoneNumberError = 'Invalid phone number format. Phone should start with : +355'; // Set error message
    //   console.error('Invalid phone number format.');
    //   return false;
    // }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
    if (!emailRegex.test(this.partner.email)) {
      this.emailError = 'Invalid email format.'; // Set error message
      console.error('Invalid email format.');
      return false;
    }

    return true;
  }
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
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
