import { logger } from '@core/logger';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatePerDaysService } from "../../../services/ratePerDaysService/rate-per-days.service";
import { UserService } from "../../../services/userService/user.service";
import { UserGroupService } from "../../../services/userGroupService/user-group.service";
import { UserGroupMembersService } from "../../../services/userGroupMembersService/user-group-members.service";
import { RateService } from "../../../services/rateService/rate.service";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-updaterateperdays',
  templateUrl: './updaterateperdays.component.html',
  styles: [
  ]
})
export class UpdaterateperdaysComponent {
  @ViewChild('rateperdayForm') rateperdayForm!: NgForm;
  ratePerDays = {
    rateId: '',
    from_time: '',
    to_time: '',
    dayCreated: '',
    price: '',
    rateType:'',
  };
  errorMessage: string | null = null;
  rateId: string | null = null;
  // users: any;
  // userGroups: any;
  currentDate: string;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentYear: number = new Date().getFullYear();
  minDate: string;
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
    this.minDate = today.toISOString().split('T')[0];
    // Get rateId from the URL
    this.route.paramMap.subscribe(params => {
      this.rateId = params.get('id');
      logger.log(this.rateId);
      if (this.rateId) {
        this.ratePerDays.rateId = this.rateId;
      }
    });
    this.currentDate = new Date().toISOString().split('T')[0];
    this.ratePerDays.dayCreated = this.currentDate;
    // this.getUsers();
    this.getRatePerDays();
  }

  validateYear(year: number): boolean {
    return year >= this.currentYear;
  }


  onSubmit() {
    // Mark all fields as touched to trigger validation messages
    this.markFormGroupTouched(this.rateperdayForm);

    // Check if the form is invalid
    if (this.rateperdayForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;  // Prevent submission if the form is invalid
    }

    // Check if Rate ID is missing
    if (!this.rateId) {
      this.errorMessage = 'Rate ID is missing. Please provide a valid Rate ID.';
      return;  // Prevent submission if Rate ID is missing
    }
    logger.log("ratePerDays", this.ratePerDays)
    // Submit the form data to the service to update the rate per day
    this.ratePerDaysService.updateRatePerDay(this.rateId, this.ratePerDays).subscribe(
      (response) => {
        if (response) {
          // Redirect to the updated rate page if the update is successful
          this.router.navigate([`/rates/rate/${this.ratePerDays.rateId}`]);
        } else {
          // If no response is returned or the response is empty, show an error
          this.errorMessage = 'Failed to update rate. Rate Per Days ID not returned from server.';
        }
      },
      (error) => {
        // Handle any error that occurs during the API request
        this.errorMessage = error.message || 'An unexpected error occurred. Please try again later.';
        logger.error('Error updating rate per day:', error);
      }
    );
  }



  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getRatePerDays() {
    logger.log(this.rateId);
    this.ratePerDaysService.getRatePerDay(this.rateId).subscribe(
      (data) => {
        // this.users = data;
        // this.getUserGroups(data.rate.company_id)
        // console.log(data.ratePerDay);
        const ratePerDayData = data.ratePerDay;

        // Populate the ratePerDays object with data from the API
        this.ratePerDays = {
          rateId: ratePerDayData.rate_id,
          from_time: ratePerDayData.from_time,
          to_time: ratePerDayData.to_time,
          dayCreated: ratePerDayData.date_created,
          price: ratePerDayData.price,
          rateType: ratePerDayData.rateType
        };

        logger.log('Rate Per Days data:', this.ratePerDays);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

}
