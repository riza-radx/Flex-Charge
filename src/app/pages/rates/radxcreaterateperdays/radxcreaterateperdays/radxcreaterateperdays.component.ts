import { logger } from '@core/logger';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatePerDaysService } from "../../../../services/ratePerDaysService/rate-per-days.service";
import { UserService } from "../../../../services/userService/user.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { UserGroupMembersService } from "../../../../services/userGroupMembersService/user-group-members.service";
import { RateService } from "../../../../services/rateService/rate.service";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-radxcreaterateperdays',
  templateUrl: './radxcreaterateperdays.component.html',
  styles: [
  ]
})
export class RadxcreaterateperdaysComponent {
  @ViewChild('rateperdayForm') rateperdayForm!: NgForm;
  ratePerDays = {
    rateId: '',
    dayCreated: '',
    rateType: 'default',
    from_date: '',
    to_date: '',
    hourlyRates: [
      { from_time: '00:00', to_time: '01:00', price: '' },
      { from_time: '01:00', to_time: '02:00', price: '' },
      { from_time: '02:00', to_time: '03:00', price: '' },
      { from_time: '03:00', to_time: '04:00', price: '' },
      { from_time: '04:00', to_time: '05:00', price: '' },
      { from_time: '05:00', to_time: '06:00', price: '' },
      { from_time: '06:00', to_time: '07:00', price: '' },
      { from_time: '07:00', to_time: '08:00', price: '' },
      { from_time: '08:00', to_time: '09:00', price: '' },
      { from_time: '09:00', to_time: '10:00', price: '' },
      { from_time: '10:00', to_time: '11:00', price: '' },
      { from_time: '11:00', to_time: '12:00', price: '' },
      { from_time: '12:00', to_time: '13:00', price: '' },
      { from_time: '13:00', to_time: '14:00', price: '' },
      { from_time: '14:00', to_time: '15:00', price: '' },
      { from_time: '15:00', to_time: '16:00', price: '' },
      { from_time: '16:00', to_time: '17:00', price: '' },
      { from_time: '17:00', to_time: '18:00', price: '' },
      { from_time: '18:00', to_time: '19:00', price: '' },
      { from_time: '19:00', to_time: '20:00', price: '' },
      { from_time: '20:00', to_time: '21:00', price: '' },
      { from_time: '21:00', to_time: '22:00', price: '' },
      { from_time: '22:00', to_time: '23:00', price: '' },
      { from_time: '23:00', to_time: '24:00', price: '' },
    ],
    
  };
  errorMessage: string | null = null;
  rateId: string | null = null;
  // users: any;
  // userGroups: any;
  currentDate: string;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentYear: number;
  maxYear: number;
  constructor(
    private ratePerDaysService: RatePerDaysService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private rateService: RateService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const today = new Date();
    this.currentYear = today.getFullYear();  // Get current year
    this.maxYear = this.currentYear + 50;
    this.route.paramMap.subscribe(params => {
      this.rateId = params.get('id');
      logger.log(this.rateId);
      if (this.rateId) {
        this.ratePerDays.rateId = this.rateId;
      }
    });
    this.currentDate = new Date().toISOString().split('T')[0];
    this.ratePerDays.dayCreated = this.currentDate;
    this.getRate();
  }


  onSubmit() {
    // Mark all form fields as touched to display validation error messages
    this.markFormGroupTouched(this.rateperdayForm);
  
    // Check if the form is invalid
    if (this.rateperdayForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      setTimeout(() => this.errorMessage = '', 5000);  // Clear invalid message after 5 seconds
      return;
    }
  
    // Check if Rate ID is missing
    if (!this.rateId) {
      this.errorMessage = 'Rate ID is missing. Please provide a valid Rate ID.';
      setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
      return;
    }
  
    // Iterate over hourlyRates and submit each rate individually
    this.ratePerDays.hourlyRates.forEach(rate => {
      const rateData = {
        rateId: this.ratePerDays.rateId,
        from_time: rate.from_time,
        to_time: rate.to_time,
        dayCreated: this.ratePerDays.dayCreated,
        price: rate.price,
        from_date: null,
        to_date: null,
        rateType: this.ratePerDays.rateType
      };
  
      logger.log('Rate Data:', rateData);
  
      // Make the API call to add the rate per day
      this.ratePerDaysService.addRatePerDay(rateData).subscribe(
        (response) => {
          if (response) {
            logger.log('Rate per day created successfully:', response);
          } else {
            this.errorMessage = 'Rate Per Day ID not returned from server. Please try again.';
            setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
          }
        },
        (error) => {
          logger.error('Error creating rate per day:', error);
          this.errorMessage = error.message || 'An unexpected error occurred. Please try again later.';
          setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
        }
      );
    });
  
    // Navigate to the rate page after all API calls are completed
    this.router.navigate([`/rates/rate/${this.rateId}`]);
  }
  
    // onSubmit() {
  //   // Mark all form fields as touched to display validation error messages
  //   this.markFormGroupTouched(this.rateperdayForm);
  
  //   // Check if the form is invalid
  //   if (this.rateperdayForm.invalid) {
  //     this.errorMessage = 'Please fill in all required fields correctly.';
  //     setTimeout(() => this.errorMessage = '', 5000);  // Clear invalid message after 5 seconds
  //     return;
  //   }
  
  //   // Check if Rate ID is missing
  //   if (!this.rateId) {
  //     this.errorMessage = 'Rate ID is missing. Please provide a valid Rate ID.';
  //     setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
  //     return;
  //   }
  //   console.log('Form Data:', this.ratePerDays);
  //   // Make API call to add rate per day
  //   this.ratePerDaysService.addRatePerDay(this.ratePerDays).subscribe(
  //     (response) => {
  //       if (response) {
  //         // If response is successful, navigate to the rate details page
  //         console.log('Rate per day created successfully:', response);
  //         this.router.navigate([`/rates/rate/${this.rateId}`]);
  //       } else {
  //         // If the response doesn't contain expected data
  //         this.errorMessage = 'Rate Per Day ID not returned from server. Please try again.';
  //         setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
  //       }
  //     },
  //     (error) => {
  //       // Handle API error
  //       console.error('Error creating rate per day:', error);
  //       this.errorMessage = error.message || 'An unexpected error occurred. Please try again later.';
  //       setTimeout(() => this.errorMessage = '', 5000);  // Clear error message after 5 seconds
  //     }
  //   );
  // }
  
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  // getUsers() {
  //   this.userService.getAllUsers().subscribe(
  //     (data) => {
  //         this.users = data.users;
  //       console.log(data);
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  getRate() {
    logger.log(this.rateId);
    this.rateService.getRate(this.rateId).subscribe(
      (data) => {
        // this.users = data;
        // this.getUserGroups(data.rate.company_id)
        logger.log(data);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  // getUserGroups(companyId: number) {
  //   this.userGroupService.getUserGroupByCompany(companyId).subscribe(
  //     (data) => {
  //         this.userGroups = data.userGroup;
  //       console.log(data);
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }

}
