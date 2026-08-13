import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { PartnerMemberService } from '../../../../services/partner-member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/userService/user.service';
import { FormControl, NgForm } from '@angular/forms';
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-update-partnermembers',
  templateUrl: './update-partnermembers.component.html',
  styles: [
  ]
})
export class UpdatePartnermembersComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
  user = {
    name: '',
    username: '',
    email: '',
    phone_number: '',
    // password: '',
    role: '',
    allowPayAsYouGo: false,
    send_invoice_by_email: false,
    isPhoneVerified: false,
    resetStatus: false,
    rate_id: null,
    newPassword: '',
    confirmPassword: '',
    customer_number: ''
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  partnerId: string | null = null;  // Define a variable to hold userGroupId
  userId: string | null = null;
  partnerMemberId: string | null = null;
  partnerMemberType: string = '';
  errorMessage: string = '';
  rates = [];
  companyId: string | null = null;
  successMessage: string = '';
  constructor(
    private authService: AuthService,
    private partnerMemberService: PartnerMemberService,
    private rateService: RateService,
    private userService: UserService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.companyId = parsedCugpCred.company_id;
      this.loadRatesbyCompany(this.companyId);
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    // Retrieve userGroupId from the route
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      // this.userId = params.get('userId'); // Assuming you have a userId in the route

      if (this.userId) {
        this.getPartnerMemberById(this.userId);  // Fetch user data and populate form
      }
    });
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

  onAllowPayAsYouGoChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.user.allowPayAsYouGo = inputElement.checked;
  }

  // onSubmit() {
  //   this.errorMessage = null;
  //   this.user.rate_id = (this.user.rate_id === "" || this.user.rate_id === null || isNaN(Number(this.user.rate_id)) || this.user.rate_id === 0)
  //     ? null : Number(this.user.rate_id);

  //   this.markFormGroupTouched(this.userForm);

  //   if (this.userForm.invalid) {
  //     this.errorMessage = 'Please fill in all required fields correctly.';
  //     return;
  //   }

  //   this.userService.updateUser(this.userId, this.user).subscribe({
  //     next: (response: any) => {
  //       console.log('User updated successfully:', response);

  //       const companyMember = {
  //         partnerId: this.partnerId,
  //         userId: this.userId,
  //         type: this.user.role // Set the updated role from the form input
  //       };

  //       // Update the partner member type
  //       this.partnerMemberService.updatePartnerMember(this.partnerMemberId, companyMember).subscribe({
  //         next: (memberResponse) => {
  //           console.log('Partner member role updated successfully:', memberResponse);

  //           setTimeout(() => {
  //             this.router.navigate([`/users/user/${this.userId}`]); // Navigate back after update
  //           }, 1000);
  //         },
  //         error: (error) => {
  //           console.error('Error updating partner member role:', error);
  //           this.errorMessage = this.getErrorMessage(error);
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error updating user:', error);
  //       this.errorMessage = this.getErrorMessage(error);
  //     }
  //   });
  // }
  onSubmit() {
    // Mark all form fields as touched to trigger validation
    this.markFormGroupTouched(this.userForm);

    // If the form is invalid, show an error message
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    // If a new password is provided, check if it matches confirmPassword
    if (this.user.newPassword && this.user.newPassword !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords must match.';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    // Clean rate_id to be null if it's empty or invalid
    const rateIdValue = (this.user.rate_id === "" || this.user.rate_id === null || isNaN(Number(this.user.rate_id)) || Number(this.user.rate_id) === 0)
      ? null : Number(this.user.rate_id);

    // Build user payload
    const userUpdatePayload: any = {
      name: this.user.name,
      username: this.user.username,
      email: this.user.email,
      phone_number: this.user.phone_number,
      role: this.user.role,
      allowPayAsYouGo: this.user.allowPayAsYouGo,
      send_invoice_by_email: this.user.send_invoice_by_email,
      isPhoneVerified: this.user.isPhoneVerified,
      resetStatus: this.user.resetStatus,
      rate_id: rateIdValue,
      newPassword: this.user.newPassword || '' ,
      customer_number: this.user.customer_number
    };

    console.log('Submitting user update:', userUpdatePayload);

    // Update user
    this.userService.updateUser(this.userId, userUpdatePayload).subscribe({
      next: (response: any) => {
        console.log('User updated successfully:', response);

        // Prepare the partner member payload
        const partnerMemberPayload = {
          partnerId: this.partnerId,
          userId: this.userId,
          type: this.user.role
        };

        // Update partner member
        this.partnerMemberService.updatePartnerMember(this.partnerMemberId, partnerMemberPayload).subscribe({
          next: (memberResponse: any) => {
            console.log('Partner member role updated successfully:', memberResponse);
            this.successMessage = 'Partner member updated successfully.';
            setTimeout(() => {
              this.successMessage = '';
              this.router.navigate([`/users/user/${this.userId}`]);
            }, 3000);
          },
          error: (error) => {
            console.error('Error updating partner member role:', error);
            this.errorMessage = this.getErrorMessage(error);
            setTimeout(() => this.errorMessage = '', 5000);
          }
        });
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = this.getErrorMessage(error);
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }


  getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Invalid request. Please check the entered details.';
    } else if (error.status === 401) {
      return 'Unauthorized. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'User or partner member not found.';
    } else if (error.status === 409) {
      return 'A conflict occurred. The user role might already be assigned.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }


  // Fetch user group member by ID and populate the form
  getPartnerMemberById(userId: string): void {
    this.partnerMemberService.getPartnerMemberByUser(userId).subscribe(
      (response: any) => {
        console.log(response.partnerMembers[0])
        const partnerMember = response.partnerMembers[0]; // Get the first element of the array
        const userData = partnerMember?.User;
        this.partnerId = partnerMember?.partner_id
        this.partnerMemberId = partnerMember?.partner_member_id;
        this.partnerMemberType = partnerMember?.type || '';  // Set the existing type
        if (userData) {
          this.user = {
            name: userData.name,
            username: userData.username,
            email: userData.email,
            phone_number: userData.phone_number,
            role: this.partnerMemberType,
            allowPayAsYouGo: userData.allow_pay_as_you_go === "1",
            send_invoice_by_email: userData.send_invoice_by_email,
            isPhoneVerified: userData.isPhoneVerified,
            resetStatus: userData.resetStatus,
            rate_id: userData.rate_id,
            newPassword: '',       // Add newPassword as empty field
            confirmPassword: ''  ,
            customer_number: userData.customer_number
          };
        } else {
          console.error('No user data found');
        }
      },
      (error) => {
        console.error('Error fetching user group member:', error);
      }
    );
  }

  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (this.user.phone_number && !this.user.phone_number.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + this.user.phone_number.replace(/^\+\d+/, '');
    }
  }

  // This method formats the phone number to ensure it always has the selected country code
  formatPhoneNumber() {
    if (this.user.phone_number && !this.user.phone_number.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + this.user.phone_number.replace(/^\+\d+/, '');
    }
  }
}