import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/userService/user.service';
import { CompanyMemberService } from '../../../../services/companyMemberService/company-member.service'
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-companyupdateuser',
  templateUrl: './companyupdateuser.component.html',
  styles: []
})
export class CompanyupdateuserComponent {
  userForm: FormGroup;
  userId: number;
  userRole: string | null = null;
  submitted: boolean = false;
  isRadXRole: boolean = false;
  isUserRole: boolean = false;
  isCompanyRole: boolean = false;
  isCompanyAdmin: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  emailError: string | null = null;
  rates = [];
  companyId: string | null = null;
  countries: any[] = [];
  selectedCountryCode: string = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private rateService: RateService,
    private router: Router,
    private countryService: CountryService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone_number: ['', Validators.required],
        role: ['', Validators.required],
        rate_id: [null],
        allowPayAsYouGo: [false],
        send_invoice_by_email: [false],
        allow_money_transfert: [false],
        isPhoneVerified: [false],
        resetStatus: [false],
        newPassword: [''],
        confirmPassword: [''],
        customer_number: ['']
      },
      {
        validator: this.passwordsMatchValidator
      }
    );
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    this.userId = this.route.snapshot.params['id'];
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.companyId = parsedCugpCred.company_id;
      this.loadRatesbyCompany(this.companyId);
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    this.getUserById(this.userId);
    console.log('this.locationId:', this.userId);
  }

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.userForm.invalid) {
  //     console.log('Form is invalid');
  //     return;
  //   }
  //   const userData = this.userForm.value;
  //   // Ensure that allowPayAsYouGo is set to false if it's unchecked
  //   if (!this.userForm.get('allowPayAsYouGo').value) {
  //     userData.allowPayAsYouGo = false;
  //   }
  //   console.log('Submitting Userdata:', userData);
  //   userData.rate_id = userData.rate_id === "" ? null : Number(userData.rate_id);
  //   this.userService.updateUser(this.userId, userData).subscribe({
  //     next: (response) => {
  //       if (response) {
  //         console.log('User updated successfully:', response);
  //         this.router.navigate([`/users/user/${this.userId}`]);
  //       } else {
  //         console.error('Failed to update user:', response);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error updating user:', error);
  //     }
  //   });
  // }
  onSubmit() {
    this.submitted = true;
  
    if (this.userForm.invalid) {
      console.log('Form is invalid');
      return;
    }
  
    const userData = { ...this.userForm.value }; // make a shallow copy
  
    // Always include newPassword: send empty string if not filled
    userData.newPassword = userData.newPassword || '';
  
    // Always remove confirmPassword before submitting
    delete userData.confirmPassword;
  
    // Ensure that allowPayAsYouGo is false if unchecked
    if (!this.userForm.get('allowPayAsYouGo')?.value) {
      userData.allowPayAsYouGo = false;
    }
  
    // Normalize rate_id
    userData.rate_id = userData.rate_id === "" ? null : Number(userData.rate_id);
  
    console.log('Submitting Userdata:', userData);
  
    this.userService.updateUser(this.userId, userData).subscribe({
      next: (response) => {
        if (response) {
          console.log('User updated successfully:', response);
          this.router.navigate([`/users/user/${this.userId}`]);
        } else {
          console.error('Failed to update user:', response);
        }
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }
  


  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        console.log('ID:', id);
        console.log('API response:', response);
        const user = response.user;
        this.userRole = user.role;
        console.log('this.role:', this.userRole);

        if (this.userRole) {
          switch (this.userRole) {
            case 'RadX_Admin':
              this.isRadXRole = true;
              break;
            case 'RADX_MODERATOR':
              this.isRadXRole = true;
              break;
            case 'COMPANY_ADMIN':
            case 'COMPANY_OPERATOR':
            case 'COMPANY_MODERATOR':
            case 'COMPANY_TECHNICAL_OPERATOR':
            case 'COMPANY_MAINTENANCE_SPECIALIST':
            case 'COMPANY_CALL_CENTER':
            case 'COMPANY_ANALYST':
              // case 'COMPANY_USER':
              // case 'COMPANY_SUPER_USER':
              this.isCompanyAdmin = true;
              this.isCompanyRole = true;
              break;
            case 'COMPANY_USER':
            case 'COMPANY_SUPER_USER':
              this.isCompanyRole = true;
              this.isUserRole = true;
              break;
            case 'USER':
            case 'COMPANY_USER':
            case 'SUPER_USER':
              this.isRadXRole = true;
              this.isUserRole = true;
              break;
            case 'USER_GROUP_ADMIN':
            case 'USER_GROUP_MODERATOR':
            case 'USER_GROUP_USER':
              this.isUserGroupRole = true;
              break;
            case 'PARTNER_ADMIN':
            case 'PARTNER_MODERATOR':
              this.isPartnerRole = true;
              break;
            default:
              console.error('Unknown user role:', this.userRole);
              this.router.navigate(['/login']); // Redirect to login or error page
          }
        } else {
          console.error('User role is not defined.');
          this.router.navigate(['/login']); // Redirect to login or error page
        }

        // Set allowPayAsYouGo checkbox based on the API response
        const allowPayAsYouGo = user.allow_pay_as_you_go;
        const allowPayAsYouGoChecked = allowPayAsYouGo === '1' || allowPayAsYouGo === true || allowPayAsYouGo === 'true';

        // Ensure the response data matches the form structure
        this.userForm.patchValue({
          name: user.name,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
          allowPayAsYouGo: allowPayAsYouGoChecked,
          send_invoice_by_email: user.send_invoice_by_email,
          allow_money_transfert: user.allow_money_transfert,
          isPhoneVerified: user.isPhoneVerified,
          resetStatus: user.resetStatus,
          rate_id: user.rate_id,
          customer_number: user.customer_number
        });

        console.log("Role in form after patch:", this.userForm.value.role);
        const companyMemmerData = {
          companyId: id,
          userId: user.id,
          type: user.role
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  }

  // Method to handle checkbox change
  onAllowPayAsYouGoChange(isChecked: boolean) {
    this.userForm.patchValue({
      allowPayAsYouGo: isChecked
    });
  }

  // Getter to check phone number validity
  get phoneNumberInvalid() {
    return this.userForm.get('phone_number')?.invalid && this.userForm.get('phone_number')?.touched;
  }

  loadRatesbyCompany(companyId: string) {
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

  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (
      this.userForm.get('phone_number')?.value &&
      !this.userForm.get('phone_number')?.value.startsWith(this.selectedCountryCode)
    ) {
      const currentPhone = this.userForm.get('phone_number')?.value;
      this.userForm.get('phone_number')?.setValue(
        this.selectedCountryCode + currentPhone.replace(/^\+\d+/, '')
      );
    }
  }

  // This method formats the phone number to ensure it always has the selected country code
  formatPhoneNumber() {
    const currentPhone = this.userForm.get('phone_number')?.value;
    if (
      currentPhone &&
      !currentPhone.startsWith(this.selectedCountryCode)
    ) {
      this.userForm.get('phone_number')?.setValue(
        this.selectedCountryCode + currentPhone.replace(/^\+\d+/, '')
      );
    }
  }
}
