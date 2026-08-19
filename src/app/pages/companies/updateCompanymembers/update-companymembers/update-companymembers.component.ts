import { logger } from '@core/logger';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { CompanyMemberService } from '../../../../services/companyMemberService/company-member.service';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { UserService } from '../../../../services/userService/user.service';
import { NgForm } from '@angular/forms';
import { RateService } from 'src/app/services/rateService/rate.service';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-update-companymembers',
  templateUrl: './update-companymembers.component.html',
  styles: [
  ]
})
export class UpdateCompanymembersComponent implements OnInit {
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
  companyId: string | null = null;  // Define a variable to hold userGroupId
  userId: string | null = null;
  companyMemberId: string | null = null;
  companyMemberType: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  rates = [];
  rateName: string = '';
  constructor(
    private authService: AuthService,
    private companyMemberService: CompanyMemberService,
    private userService: UserService,
    private rateService: RateService,
    private router: Router,
    private countryService: CountryService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    // Retrieve userGroupId from the route
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      // this.userId = params.get('userId'); // Assuming you have a userId in the route

      if (this.userId) {
        this.getCompanyMemberById(this.userId);  // Fetch user data and populate form
      }
    });
  }

  // onSubmit() {
  //   // Mark all form fields as touched to trigger validation messages for required fields
  //   this.markFormGroupTouched(this.userForm);

  //   if (this.userForm.invalid) {
  //     // If the form is invalid (including required field checks), do not proceed with the submission
  //     this.errorMessage = 'Please fill out all required fields correctly before submitting.';
  //     setTimeout(() => this.errorMessage = '', 5000); // Hide error message after 5 seconds
  //     return;
  //   }
  //   this.user.rate_id = (this.user.rate_id === "" || this.user.rate_id === null || isNaN(Number(this.user.rate_id)) || this.user.rate_id === 0 || isNaN(Number(this.user.rate_id)))
  //   ? null : Number(this.user.rate_id);

  //   console.log('before submitting user', this.user);

  //   // First, update the user details
  //   this.userService.updateUser(this.userId, this.user).subscribe(
  //     (response: any) => {
  //       console.log('User updated successfully', response);

  //       // Prepare the data specifically to update the user group member's role
  //       const companyMember = {
  //         companyId: this.companyId,
  //         userId: this.userId,
  //         type: this.user.role  // Set the updated role from the form input
  //       };

  //       // Now, update the user group member's role/type in the user group
  //       this.companyMemberService.updateCompanyMember(this.companyMemberId, companyMember).subscribe(
  //         (memberResponse: any) => {
  //           if (memberResponse.success) {
  //             console.log('User Group member type updated successfully', memberResponse.message);
  //             this.successMessage = memberResponse.message; // Display the success message
  //             setTimeout(() => {
  //               this.successMessage = ''; // Clear the message after a short delay
  //               this.router.navigate([`/users/user/${this.userId}`]); // Navigate back after update
  //             }, 3000); // 3 seconds delay before navigation
  //           } else {
  //             console.error('Failed to update user group member type', memberResponse.message);
  //             this.errorMessage = memberResponse.message || 'Failed to update user group member type.';
  //             setTimeout(() => this.errorMessage = '', 5000); // Hide error message after 5 seconds
  //           }
  //         },
  //         (error) => {
  //           console.error('Error updating user group member type', error);
  //           this.errorMessage = 'An error occurred while updating the user group member type.';
  //           setTimeout(() => this.errorMessage = '', 5000);
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.error('Error updating user', error);
  //       this.errorMessage = 'An error occurred while updating the user.';
  //       setTimeout(() => this.errorMessage = '', 5000);
  //     }
  //   );
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
      customer_number: this.user.customer_number,
      newPassword: this.user.newPassword || ''  // Always include, even as empty string
    };
  
    logger.log('Submitting user update:', userUpdatePayload);
  
    // Update user
    this.userService.updateUser(this.userId, userUpdatePayload).subscribe({
      next: (response: any) => {
        logger.log('User updated successfully:', response);
  
        // Prepare the company member payload
        const companyMemberPayload = {
          companyId: this.companyId,
          userId: this.userId,
          type: this.user.role
        };
  
        // Update company member role
        this.companyMemberService.updateCompanyMember(this.companyMemberId, companyMemberPayload).subscribe({
          next: (memberResponse: any) => {
            if (memberResponse.success) {
              logger.log('Company member updated successfully:', memberResponse.message);
              this.successMessage = memberResponse.message;
              setTimeout(() => {
                this.successMessage = '';
                this.router.navigate([`/users/user/${this.userId}`]);
              }, 3000);
            } else {
              logger.error('Failed to update company member:', memberResponse.message);
              this.errorMessage = memberResponse.message || 'Failed to update company member.';
              setTimeout(() => this.errorMessage = '', 5000);
            }
          },
          error: (error) => {
            logger.error('Error updating company member:', error);
            this.errorMessage = 'An error occurred while updating the company member.';
            setTimeout(() => this.errorMessage = '', 5000);
          }
        });
      },
      error: (error) => {
        logger.error('Error updating user:', error);
        this.errorMessage = 'An error occurred while updating the user.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
  


  loadRatesbyCompany(companyId: string) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        logger.log("Fetched rates:", data.rate);
        logger.log("Fetched companyId:", companyId);
        this.rates = data.rate;
        this.rateName = data.rate.rate_name;
      },
      (error) => {
        logger.log("Error fetching rates:", error);
      }
    );
  }

  // Fetch user group member by ID and populate the form
  getCompanyMemberById(userId: string): void {
    this.companyMemberService.getCompanyMemberByUser(userId).subscribe(
      (response: any) => {
        logger.log(response.company_member[0])
        const companyMember = response.company_member[0]; // Get the first element of the array
        const userData = companyMember?.User;
        this.companyId = companyMember?.company_id;
        this.loadRatesbyCompany(this.companyId);
        this.companyMemberId = companyMember?.company_member_id;
        this.companyMemberType = companyMember?.type || '';  // Set the existing type
        // const userData = response.userGroupMembers.User;  // Assuming API returns the user data in a 'user' field
        if (userData) {
          // Populate the form with the fetched user data
          this.user = {
            name: userData.name,
            username: userData.username,
            email: userData.email,
            phone_number: userData.phone_number,
            // password: '',  // Password field remains empty for security reasons
            role: this.companyMemberType,
            allowPayAsYouGo: userData.allow_pay_as_you_go === "1",
            send_invoice_by_email: userData.send_invoice_by_email,
            isPhoneVerified: userData.isPhoneVerified,
            resetStatus: userData.resetStatus,
            rate_id: userData.rate_id,
            customer_number: userData.customer_number,
            newPassword: '',       // Add newPassword as empty field
            confirmPassword: ''    // Add confirmPassword as empty field
          };
        } else {
          logger.error('No user data found');
        }
      },
      (error) => {
        logger.error('Error fetching user group member:', error);
      }
    );
  }


  getRateNameById(rateId: string): string {
    const rate = this.rates.find(r => r.rate_id === rateId);
    return rate ? rate.rate_name : 'No Rate Selected'; // Default message if no rate is selected
  }

  onAllowPayAsYouGoChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.user.allowPayAsYouGo = inputElement.checked;
  }
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;
    const currentValue = this.user.phone_number;

    // Ensure the phone number starts with the selected country code
    if (!currentValue.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + currentValue.replace(/^\+\d+/, '');
    }
  }

  formatPhoneNumber() {
    const currentValue = this.user.phone_number;

    if (!currentValue.startsWith(this.selectedCountryCode)) {
      this.user.phone_number = this.selectedCountryCode + currentValue.replace(/^\+\d+/, '');
    }
  }
}