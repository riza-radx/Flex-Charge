import { logger } from '@core/logger';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { NgForm } from '@angular/forms';
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';
// 🆕 Per dropdown-in e Partner (grupi mund t'i perkase nje partneri opsionalisht).
import { PartnerService } from 'src/app/services/partnerService/partner.service';

@Component({
  selector: 'app-radxcreateusergroup',
  templateUrl: './radxcreateusergroup.component.html',
  styles: [
  ]
})
export class RadxcreateusergroupComponent implements OnInit {
  companies = [];
  @ViewChild('userForm') userForm!: NgForm;
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
  errorMessage: string = '';
  company: any;
  userGroup = {
    usergr_name: '',
    usergr_description: '',
    usergr_addres: '',
    usergr_city: '',
    usergr_country: '',
    usergr_phone_no: '',
    usergr_email: '',
    allow_pay_as_you_go: false,
    split_wallet: false,
    send_invoice_by_email: false,
    company_id: '',  // This should be set from local storage
    rate_id: null,
    // 🆕 partner_id: opsional. NULL = grupi s'i perket asnje partneri.
    partner_id: null,
    customer_number: '',
    dimension_value: '',
    check_fisk: true,
    // 🆕 Vega Staff flag — vetem admin/analyst mund ta aktivizojne (kontrolli behet ne template).
    is_vega_staff: false
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  selectedFile: File | null = null;
  rates = [];
  // 🆕 Partner dropdown me search — shfaqet vetem per COMPANY_ADMIN/COMPANY_ANALYST/RadX.
  // partners: lista e plote e partnereve aktive te kompanise.
  // filteredPartners: e filtruar sipas termi te kerkimit (perdoret ne <option *ngFor>).
  partners: any[] = [];
  filteredPartners: any[] = [];
  partnerSearchTerm: string = '';

  get isAdminUser(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'radxadmin' || role === 'companyadmin';
  }

  // 🆕 Kontroll roli per fushen `is_vega_staff` — vetem admin dhe analyst.
  get canManageVegaStaff(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'radxadmin'
      || role === 'radxmoderator'
      || role === 'companyadmin'
      || role === 'superuser'
      || role === 'companyanalyst';
  }
  constructor(
    private userGroupService: UserGroupService,
    private companyService: CompanyService,
    private rateService: RateService,
    private countryService: CountryService,
    private partnerService: PartnerService,
    private router: Router) {
    // Get company ID from local storage
    const companyId = localStorage.getItem('company_id');
    if (companyId) {
      this.userGroup.company_id = companyId;
    }
  }

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
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.loadRatesbyCompany(company_id);
      // 🆕 Ngarko partneret e kompanise per dropdown-in (te gjithe rolet qe krijojne UG).
      this.loadPartnersByCompany(company_id);
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
            this.loadCompaniesByCompanyId(company_id);
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
    // throw new Error('Method not implemented.');
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

  loadRatesbyCompany(companyId: string) {
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

  // 🆕 Ngarko partneret aktive te kompanise per dropdown-in me search.
  loadPartnersByCompany(companyId: string | number) {
    this.partnerService.getPartnerByCompany(companyId as any).subscribe(
      (data: any) => {
        // Sipas backend-it: data.partner (aktive), fallback te data.partners.
        const raw = data?.partner ?? data?.partners ?? [];
        // Filtron vetem partneret aktive nese status vjen ne payload; perndryshe merret gjithcka.
        this.partners = raw.filter((p: any) =>
          p?.partner_status === 'true' || p?.partner_status === true || p?.partner_status === undefined
        );
        this.filteredPartners = [...this.partners];
      },
      (error) => {
        logger.log("Error fetching partners:", error);
      }
    );
  }

  // 🆕 Filtron partneret sipas termit te kerkimit — case-insensitive.
  filterPartners() {
    const term = (this.partnerSearchTerm || '').toLowerCase();
    if (!term) {
      this.filteredPartners = [...this.partners];
      return;
    }
    this.filteredPartners = this.partners.filter(p =>
      (p?.partner_name || '').toLowerCase().includes(term)
    );
  }
  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => logger.error('Error fetching companies', error)
    );
  }
  loadCompaniesByCompanyId(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      response => {
        logger.log(response.company);
        this.company = response.company;
      },
      error => logger.error('Error fetching companies', error)
    );
  }
  // onSubmit() {
  //   if (this.isFormValid()) {
  //     this.userGroupService.addUserGroup(this.userGroup).subscribe(
  //       response => {
  //         console.log('this.userGroup', this.userGroup);
  //         console.log('User group created successfully', response);
  //         // Navigate to another page or display a success message
  //         this.router.navigate(['/users/usergroup']);
  //       },
  //       error => {
  //         console.error('Error creating user group', error);
  //       }
  //     );
  //   }
  // }
  onSubmit() {
    this.userGroup.company_id = this.company.company_id;

    this.markFormGroupTouched(this.userForm);

    // Conditional requirement: customer_number and dimension_value are mandatory when check_fisk is enabled.
    if (this.userGroup.check_fisk &&
        (!this.userGroup.customer_number?.toString().trim() ||
         !this.userGroup.dimension_value?.toString().trim())) {
      this.errorMessage = 'When Check Fiscalization is enabled, Customer Number and Dimension KLIENT/FURNITOR are required.';
      return;
    }

    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly before submitting.';
      return;
    }

    this.errorMessage = null;

    if (this.isFormValid()) {
      logger.log('Before submitting - userGroup values:', { ...this.userGroup });
      logger.log(this.userGroup.rate_id)
      const formData = new FormData();
      formData.append('usergr_name', this.userGroup.usergr_name);
      formData.append('usergr_description', this.userGroup.usergr_description);
      formData.append('usergr_addres', this.userGroup.usergr_addres);
      formData.append('usergr_city', this.userGroup.usergr_city);
      formData.append('usergr_country', this.userGroup.usergr_country);
      formData.append('usergr_phone_no', this.userGroup.usergr_phone_no);
      formData.append('usergr_email', this.userGroup.usergr_email);
      formData.append('allow_pay_as_you_go', JSON.stringify(this.userGroup.allow_pay_as_you_go));
      formData.append('split_wallet', JSON.stringify(this.userGroup.split_wallet));
      formData.append('send_invoice_by_email', JSON.stringify(this.userGroup.send_invoice_by_email));
      formData.append('company_id', this.userGroup.company_id);
      formData.append('rate_id', this.userGroup.rate_id);
      // 🆕 partner_id: dergohet '' nese s'ka partner te zgjedhur; backend e trajton si NULL.
      formData.append('partner_id', this.userGroup.partner_id ? String(this.userGroup.partner_id) : '');
      formData.append('customer_number', this.userGroup.customer_number);
      formData.append('dimension_value', this.userGroup.dimension_value);
      formData.append('check_fisk', JSON.stringify(this.userGroup.check_fisk));
      // 🆕 is_vega_staff: dergohet vetem nese thirresi ka lejen (admin/analyst).
      // Perndryshe backend-i e injoron edhe pse eshte pjese e payload-it.
      if (this.canManageVegaStaff) {
        formData.append('is_vega_staff', JSON.stringify(this.userGroup.is_vega_staff));
      }

      if (this.selectedFile) {
        formData.append('user_group_logo', this.selectedFile);
      }

      // Cast FormData to any and use entries()
      logger.log('Before submitting - formData values:');
      for (const pair of (formData as any).entries()) {
        logger.log(pair[0], pair[1]);
      }

      this.userGroupService.addUserGroup(formData).subscribe({
        next: (response) => {
          logger.log('User group created successfully!', response);

          if (response.success === false) {
            this.errorMessage = response.message || 'Failed to create the User Group. Please try again.';
            return;
          }

          this.router.navigate(['/users/usergroup']);
        },
        error: (error) => {
          logger.error('Error creating user group:', error);

          if (error.status === 400) {
            this.errorMessage = 'Invalid user group details. Please check your inputs and try again.';
          } else if (error.status === 403) {
            this.errorMessage = 'You do not have permission to create a user group.';
          } else if (error.status === 409) {
            this.errorMessage = 'A user group with this name already exists.';
          } else {
            this.errorMessage = 'Failed to create the user group. Please try again later.';
          }
        }
      });
    }
  }





  getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Invalid input. Please check your form and try again.';
    } else if (error.status === 401) {
      return 'Unauthorized access. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'User group not found.';
    } else if (error.status === 409) {
      return 'A conflict occurred. The user group may already exist.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }


  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Validate the form fields
  isFormValid(): boolean {
    this.phoneNumberError = null; // Reset the error message

    if (!this.userGroup.usergr_name || !this.userGroup.usergr_addres ||
      !this.userGroup.usergr_email || !this.userGroup.usergr_city ||
      !this.userGroup.usergr_country || !this.userGroup.usergr_description) {
      logger.error('Some required fields are missing.');
      return false;
    }
    return true;
  }

  // This method is triggered when a country is selected from the dropdown
  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (this.userGroup.usergr_phone_no && !this.userGroup.usergr_phone_no.startsWith(this.selectedCountryCode)) {
      this.userGroup.usergr_phone_no = this.selectedCountryCode + this.userGroup.usergr_phone_no.replace(/^\+\d+/, '');
    }
  }

  // This method formats the phone number to ensure it always has the selected country code
  formatPhoneNumber() {
    if (this.userGroup.usergr_phone_no && !this.userGroup.usergr_phone_no.startsWith(this.selectedCountryCode)) {
      this.userGroup.usergr_phone_no = this.selectedCountryCode + this.userGroup.usergr_phone_no.replace(/^\+\d+/, '');
    }
  }

}
