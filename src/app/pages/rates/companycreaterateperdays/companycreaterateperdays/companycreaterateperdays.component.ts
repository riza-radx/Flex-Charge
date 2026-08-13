import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatePerDaysService } from "../../../../services/ratePerDaysService/rate-per-days.service";
import { UserService } from 'src/app/services/userService/user.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';

@Component({
  selector: 'app-companycreaterateperdays',
  templateUrl: './companycreaterateperdays.component.html',
  styles: [
  ]
})
export class CompanycreaterateperdaysComponent {
  ratePerDays = {
    rateId: '',
    day: '',
    time: '',
    month: '',
    year: '',
    userId: '',
    userGroupId: '',
    dayCreated: '',
    createdBy: ''
  };
  errorMessage: string | null = null;
  rateId: string | null = null;
  users = [];
  userGroups = [];
  constructor(
    private ratePerDaysService: RatePerDaysService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getUserGroups();
    // Get rateId from the URL
    this.route.paramMap.subscribe(params => {
      this.rateId = params.get('rateId');
      if (this.rateId) {
        this.ratePerDays.rateId = this.rateId;
      }
    });
  }
  getUsers() {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data.users;
        console.log('users:', this.users);
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }
  getUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data: any) => {
        this.userGroups = data.userGroup;
        console.log('userGroups:', this.userGroups);
      },
      error => {
        console.error('Error fetching userGroups:', error);
      }
    );
  }
  onSubmit() {
    if (!this.rateId) {
      this.errorMessage = 'Rate ID is missing.';
      return;
    }
    
    this.ratePerDaysService.addRatePerDay(this.ratePerDays).subscribe(
      (response) => {
        if (response) { // Adjust according to the actual response
          this.router.navigate([`/rates/rate/${this.rateId}`]);
        } else {
          this.errorMessage = 'Rate Per Days ID not returned from server.';
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error creating rate per days:', error);
      }
    );
  }

}
