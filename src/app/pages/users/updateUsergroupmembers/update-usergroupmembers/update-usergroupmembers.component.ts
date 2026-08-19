import { logger } from '@core/logger';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { UserGroupMembersService } from '../../../../services/userGroupMembersService/user-group-members.service';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { UserService } from '../../../../services/userService/user.service';
import { NgForm } from '@angular/forms';
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-update-usergroupmembers',
  templateUrl: './update-usergroupmembers.component.html',
  styles: [
  ]
})
export class UpdateUsergroupmembersComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
  user = {
    name: '',
    username: '',
    email: '',
    phone_number: '',
    role: '',
    allowPayAsYouGo: "false",
    send_invoice_by_email: false,
    allow_money_transfert: false,
    isPhoneVerified: false,
    resetStatus: false,
    rate_id: '',
    newPassword: '',
    confirmPassword: '',
    customer_number: '',
    dimension_value: ''
  };
  countries: any[] = [];
  selectedCountryCode: string = '';
  userGroupId: string | null = null;  // Define a variable to hold userGroupId
  userId: string | null = null;
  userGroupMemberId: string | null = null;
  userGroupMemberType: string = '';
  errorMessage: string = '';
  rates = [];
  companyId: string | null = null;
  constructor(
    private authService: AuthService,
    private userGroupMemberService: UserGroupMembersService,
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
      logger.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      // this.userId = params.get('userId'); // Assuming you have a userId in the route

      if (this.userId) {
        this.getUserGroupMemberById(this.userId);  // Fetch user data and populate form
      }
    });
  }

  // onSubmit() {
  //   this.markFormGroupTouched(this.userForm);

  //   if (this.userForm.invalid) {
  //     this.errorMessage = 'Please fill in all required fields correctly.';
  //     return;
  //   }

  //   // Clear previous messages
  //   this.errorMessage = null;

  //   this.userService.updateUser(this.userId, this.user).subscribe({
  //     next: (response: any) => {
  //       console.log('User updated successfully:', response);

  //       // Prepare the user group update payload
  //       const userGroupMember = {
  //         userGroupId: this.userGroupId,
  //         userId: this.userId,
  //         type: this.user.role  // Set the updated role from the form input
  //       };

  //       // Update the user group member role/type
  //       this.userGroupMemberService.updateUserGroupMember(this.userGroupMemberId, userGroupMember).subscribe({
  //         next: (memberResponse) => {
  //           console.log('User Group member type updated successfully:', memberResponse);
  //           this.router.navigate([`/users/user/${this.userId}`]);
  //         },
  //         error: (error) => {
  //           console.error('Error updating user group member type:', error);
  //           this.errorMessage = this.handleError(error);
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error updating user:', error);
  //       this.errorMessage = this.handleError(error);
  //     }
  //   });
  // }

  onSubmit() {
    // Mark the form fields as touched to trigger validation
    this.markFormGroupTouched(this.userForm);

    // If the form is invalid, show an error message
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    // If a new password is provided, ensure it matches the confirm password
    if (this.user.newPassword && this.user.newPassword !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords must match.';
      return;
    }

    // Prepare the update payload, including newPassword only if it's provided
    const userUpdatePayload = {
      name: this.user.name,
      username: this.user.username,
      email: this.user.email,
      phone_number: this.user.phone_number,
      role: this.user.role,
      allowPayAsYouGo: this.user.allowPayAsYouGo,
      send_invoice_by_email: this.user.send_invoice_by_email,
      allow_money_transfert: this.user.allow_money_transfert,
      isPhoneVerified: this.user.isPhoneVerified,
      resetStatus: this.user.resetStatus,
      rate_id: this.user.rate_id,
      newPassword: this.user.newPassword ? this.user.newPassword : '',
      customer_number: this.user.customer_number,
      dimension_value: this.user.dimension_value
    };

    // Proceed with updating the user data
    this.userService.updateUser(this.userId, userUpdatePayload).subscribe({
      next: (response: any) => {
        logger.log('User updated successfully:', response);

        // If user group data needs to be updated
        const userGroupMember = {
          userGroupId: this.userGroupId,
          userId: this.userId,
          type: this.user.role  // Set the updated role from the form input
        };

        // Update the user group member role/type
        this.userGroupMemberService.updateUserGroupMember(this.userGroupMemberId, userGroupMember).subscribe({
          next: (memberResponse) => {
            logger.log('User Group member type updated successfully:', memberResponse);
            this.router.navigate([`/users/user/${this.userId}`]);
          },
          error: (error) => {
            logger.error('Error updating user group member type:', error);
            this.errorMessage = this.handleError(error);
          }
        });
      },
      error: (error) => {
        logger.error('Error updating user:', error);
        this.errorMessage = this.handleError(error);
      }
    });
  }




  handleError(error: any): string {
    if (error.status === 400) {
      return 'Invalid input. Please check your form and try again.';
    } else if (error.status === 401) {
      return 'Unauthorized access. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'User or user group not found.';
    } else if (error.status === 409) {
      return 'A conflict occurred. The role may already be assigned.';
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

  // onAllowPayAsYouGoChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.user.allowPayAsYouGo = inputElement.checked;
  // }

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

  getUserGroupMemberById(userId: string): void {
    this.userGroupMemberService.getUserGroupMemberByUser(userId).subscribe(
      (response: any) => {
        const userGroupMember = response.userGroupMembers[0];
        const userData = userGroupMember?.User;

        this.userGroupId = userGroupMember?.usergr_id;
        this.userGroupMemberId = userGroupMember?.usergr_member_id;
        this.userGroupMemberType = userGroupMember?.type || '';  // Set the existing type

        if (userData) {
          this.user = {
            name: userData.name,
            username: userData.username,
            email: userData.email,
            phone_number: userData.phone_number,
            role: this.userGroupMemberType,  // Initialize the role with the current type
            allowPayAsYouGo: userData.allow_pay_as_you_go,
            send_invoice_by_email: userData.send_invoice_by_email,
            allow_money_transfert: userData.allow_money_transfert,
            isPhoneVerified: userData.isPhoneVerified,
            resetStatus: userData.resetStatus,
            rate_id: userData.rate_id,
            newPassword: '',       // Add newPassword as empty field
            confirmPassword: '',
            customer_number:userData.customer_number,
            dimension_value : userData.dimension_value
          };
        } else {
          logger.error('No user data found');
        }
      },
      error => {
        logger.error('Error fetching user group member:', error);
      }
    );
  }

  getRateNameById(rateId: string): string {
    const rate = this.rates.find(r => r.rate_id === rateId);
    return rate ? rate.rate_name : 'No Rate Selected'; // Default message if no rate is selected
  }

  // This method is triggered when a country is selected from the dropdown
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