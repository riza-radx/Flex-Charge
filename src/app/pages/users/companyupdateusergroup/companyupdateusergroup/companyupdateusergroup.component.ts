import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from 'src/app/services/cardService/card.service';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { CountryService } from 'src/app/services/country/country.service';
import { RateService } from 'src/app/services/rateService/rate.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
// 🆕 Per dropdown-in e Partner ne update form (grupi mund t'i perkase nje partneri).
import { PartnerService } from 'src/app/services/partnerService/partner.service';

@Component({
  selector: 'app-companyupdateusergroup',
  templateUrl: './companyupdateusergroup.component.html',
  styles: []
})
export class CompanyupdateusergroupComponent implements OnInit {
  userGroupForm: FormGroup;
  usergrId: number;
  companies = [];
  userGroupLogo: File | null = null;
  rates = [];
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
  // 🆕 Partner dropdown — lista e plote + e filtruar per search.
  partners: any[] = [];
  filteredPartners: any[] = [];
  partnerSearchTerm: string = '';

  get isAdminUser(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'radxadmin' || role === 'companyadmin';
  }

  // 🆕 Kontroll roli per fushen `is_vega_staff` — vetem admin dhe analyst mund
  // ta shohin/ndryshojne. Perfshin RadX super-admins, admin-et e kompanise, dhe analistin.
  get canManageVegaStaff(): boolean {
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    return role === 'radxadmin'
      || role === 'radxmoderator'
      || role === 'companyadmin'
      || role === 'superuser'
      || role === 'companyanalyst';
  }

  constructor(
    private fb: FormBuilder,
    private userGroupService: UserGroupService,
    private companyService: CompanyService,
    private rateService: RateService,
    private router: Router,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
  ) {
    this.userGroupForm = this.fb.group({
      usergr_name: ['', Validators.required],
      usergr_description: ['', Validators.required],
      usergr_addres: ['', Validators.required],
      usergr_city: [null, Validators.required],
      usergr_country: [null, Validators.required],
      usergr_phone_no: ['', [Validators.required]],
      usergr_email: ['', [Validators.required, Validators.email]],
      allow_pay_as_you_go: [false, Validators.required],
      split_wallet: [false, Validators.required],
      send_invoice_by_email: [false],
      company_id: [null, Validators.required],
      rate_id: [null],
      // 🆕 partner_id: opsional (grupi mund t'i perkase nje partneri ose te jete i pavarur).
      partner_id: [null],
      customer_number: [''],
      dimension_value: [''],
      check_fisk: [true],
      // 🆕 Toggle Vega Staff — vetem admin/analyst mund ta ndryshojne (kontrolli behet ne template).
      is_vega_staff: [false],
    });

    // customer_number and dimension_value are required only when check_fisk is true
    this.applyCheckFiskValidators(this.userGroupForm.get('check_fisk').value);
    this.userGroupForm.get('check_fisk').valueChanges.subscribe((checked: boolean) => {
      this.applyCheckFiskValidators(checked);
    });
  }

  private applyCheckFiskValidators(checked: boolean): void {
    const customerCtrl = this.userGroupForm.get('customer_number');
    const dimensionCtrl = this.userGroupForm.get('dimension_value');
    if (checked) {
      customerCtrl.setValidators([Validators.required]);
      dimensionCtrl.setValidators([Validators.required]);
    } else {
      customerCtrl.clearValidators();
      dimensionCtrl.clearValidators();
    }
    customerCtrl.updateValueAndValidity({ emitEvent: false });
    dimensionCtrl.updateValueAndValidity({ emitEvent: false });
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    this.usergrId = this.route.snapshot.params['id'];
    this.getUserGroupById(this.usergrId);
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.loadRatesbyCompany(company_id);
      // 🆕 Ngarko partneret e kompanise per dropdown-in (opsional).
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
            this.isCompanyAdmin = true;
            this.loadCompaniesByCompanyId(company_id);
            break;
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
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => console.error('Error fetching companies', error)
    );
  }
  loadRatesbyCompany(companyId: string) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        console.log("Fetched rates:", data.rate);
        this.rates = data.rate.map(rate => ({
          ...rate,
          rate_id: Number(rate.rate_id) // Ensure it's a number
        }));
      },
      (error) => {
        console.log("Error fetching rates:", error);
      }
    );
  }
  loadCompaniesByCompanyId(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      response => {
        console.log(response.company);
        this.companies = [response.company];
      },
      error => console.error('Error fetching companies', error)
    );
  }

  // 🆕 Ngarko partneret aktive te kompanise per dropdown-in me search.
  loadPartnersByCompany(companyId: string | number) {
    this.partnerService.getPartnerByCompany(companyId as any).subscribe(
      (data: any) => {
        const raw = data?.partner ?? data?.partners ?? [];
        this.partners = raw.filter((p: any) =>
          p?.partner_status === 'true' || p?.partner_status === true || p?.partner_status === undefined
        );
        this.filteredPartners = [...this.partners];
      },
      (error) => {
        console.log("Error fetching partners:", error);
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

  onSubmit() {
    if (this.userGroupForm.invalid) {
      this.userGroupForm.markAllAsTouched();
      const checkFisk = this.userGroupForm.get('check_fisk').value;
      const customerMissing = this.userGroupForm.get('customer_number').hasError('required');
      const dimensionMissing = this.userGroupForm.get('dimension_value').hasError('required');
      if (checkFisk && (customerMissing || dimensionMissing)) {
        this.errorMessage = 'When Check Fiscalization is enabled, Customer Number and Dimension KLIENT/FURNITOR are required.';
      } else {
        this.errorMessage = 'Please correct the errors before submitting.';
      }
      return;
    }

    this.errorMessage = null;

    if (this.userGroupForm.valid) {
      const userGroupData = this.userGroupForm.value;

      userGroupData.rate_id = userGroupData.rate_id && !isNaN(userGroupData.rate_id) ? Number(userGroupData.rate_id) : null;
      console.log('userGroupData.rate_id', userGroupData.rate_id);

      console.log('Submitting userGroupData before :', userGroupData);
      if (!this.userGroupForm.get('allow_pay_as_you_go').value) {
        userGroupData.allow_pay_as_you_go = false;
      }
      if (!this.userGroupForm.get('split_wallet').value) {
        userGroupData.split_wallet = false;
      }
      // 🆕 Normalizim partner_id: null nga dropdown "-- Not linked --" -> string bosh ne FormData,
      // sepse FormData.append(key, null) e kthen ne string literal "null" — backend do e
      // interpretonte gabim. Backend-i pastaj bosh -> NULL ne DB.
      if (userGroupData.partner_id == null) {
        userGroupData.partner_id = '';
      }

      // 🆕 Kur thirresi s'ka lejen (jo admin/analyst), heq is_vega_staff nga payload
      // qe te mos rishkruaje vleren ekzistuese ne DB. Backend gjithashtu e strip.
      if (!this.canManageVegaStaff) {
        delete userGroupData.is_vega_staff;
      }

      const formData = new FormData();
      Object.keys(userGroupData).forEach(key => {
        if (key !== 'userGroupLogo') {
          formData.append(key, userGroupData[key]);
        }
      });

      if (this.userGroupLogo) {
        formData.append('userGroupLogo', this.userGroupLogo, this.userGroupLogo.name);
      }

      console.log('Submitting formData:', formData);
      console.log('Submitting userGroupData after:', userGroupData);
      this.userGroupService.updateUserGroup(this.usergrId, formData).subscribe({
        next: (response) => {
          if (response) {
            console.log('User group updated successfully:', response);
            this.router.navigate([`/users/usergroup/${this.usergrId}`]);
          } else {
            this.errorMessage = 'Failed to update user group.';
          }
        },
        error: (error) => {
          console.error('Error updating user group:', error);
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    } else {
      this.errorMessage = 'Form validation failed. Please check your inputs.';
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
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userGroupLogo = file;
      console.log('File selected:', file);
    }
  }

  async getUserGroupById(id: number): Promise<void> {
    try {
      // Fetch the user group details
      const response = await this.userGroupService.getUserGroup(id).toPromise();
      console.log('ID:', id);
      console.log('API response getUserGroupById:', response);

      const userGroup = response.userGroup;

      // Set allowPayAsYouGo checkbox based on the API response
      const allow_pay_as_you_go = userGroup.allow_pay_as_you_go;
      const allowPayAsYouGoChecked = allow_pay_as_you_go === '1' || allow_pay_as_you_go === true || allow_pay_as_you_go === 'true';
      const split_wallet = userGroup.split_wallet;
      const splitWalletChecked = split_wallet === '1' || split_wallet === true || split_wallet === 'true';

      const checkFiskRaw = userGroup.check_fisk;
      const checkFiskChecked = checkFiskRaw === undefined || checkFiskRaw === null
        ? true
        : (checkFiskRaw === '1' || checkFiskRaw === 1 || checkFiskRaw === true || checkFiskRaw === 'true');

      // Ensure the response data matches the form structure
      this.userGroupForm.patchValue({
        usergr_name: userGroup.usergr_name,
        usergr_description: userGroup.usergr_description,
        usergr_addres: userGroup.usergr_addres,
        usergr_city: userGroup.usergr_city,
        usergr_country: userGroup.usergr_country,
        usergr_phone_no: userGroup.usergr_phone_no,
        usergr_email: userGroup.usergr_email,
        allow_pay_as_you_go: allowPayAsYouGoChecked,
        split_wallet: splitWalletChecked,
        send_invoice_by_email: userGroup.send_invoice_by_email,
        company_id: userGroup.company_id,
        customer_number: userGroup.customer_number,
        dimension_value: userGroup.dimension_value,
        rate_id: userGroup.rate_id ? Number(userGroup.rate_id) : null,
        // 🆕 Load partner_id nese ekziston (grupet e vjeter kane NULL — patch me null).
        partner_id: userGroup.partner_id ? Number(userGroup.partner_id) : null,
        check_fisk: checkFiskChecked,
        // 🆕 Load is_vega_staff — grupet e vjeter kane 0/false si default. Backend
        // e strip response-in kur thirresi s'ka lejen, keshtu qe per role te tjere
        // fusha do te vije undefined -> patch me false (asnje efekt visual).
        is_vega_staff: userGroup.is_vega_staff === true
          || userGroup.is_vega_staff === 1
          || userGroup.is_vega_staff === '1'
          || userGroup.is_vega_staff === 'true',
      });

    } catch (error) {
      console.error('Error fetching userGroup details:', error);
    }
  }

  // Method to handle checkbox change
  onAllowPayAsYouGoChange(isChecked: boolean) {
    this.userGroupForm.patchValue({
      allow_pay_as_you_go: isChecked
    });
  }
  onSplitWalletChange(isChecked: boolean) {
    this.userGroupForm.patchValue({
      split_wallet: isChecked
    });
  }

  // This method is triggered when a country is selected from the dropdown
  // This method is triggered when a country is selected from the dropdown
  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (
      this.userGroupForm.get('usergr_phone_no')?.value &&
      !this.userGroupForm.get('usergr_phone_no')?.value.startsWith(this.selectedCountryCode)
    ) {
      const currentPhone = this.userGroupForm.get('usergr_phone_no')?.value;
      this.userGroupForm.get('usergr_phone_no')?.setValue(
        this.selectedCountryCode + currentPhone.replace(/^\+\d+/, '')
      );
    }
  }

  // This method formats the phone number to ensure it always has the selected country code
  formatPhoneNumber() {
    const currentPhone = this.userGroupForm.get('usergr_phone_no')?.value;
    if (
      currentPhone &&
      !currentPhone.startsWith(this.selectedCountryCode)
    ) {
      this.userGroupForm.get('usergr_phone_no')?.setValue(
        this.selectedCountryCode + currentPhone.replace(/^\+\d+/, '')
      );
    }
  }
}
