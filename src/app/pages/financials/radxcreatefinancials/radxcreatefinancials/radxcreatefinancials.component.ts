import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargingHistoryService } from "../../../../services/chargingHistoryService/charging-history.service";
import { UserService } from "../../../../services/userService/user.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { ReportService } from "../../../../services/reportService/report.service";

@Component({
  selector: 'app-radxcreatefinancials',
  templateUrl: './radxcreatefinancials.component.html',
  styles: [
  ]
})
export class RadxcreatefinancialsComponent implements OnInit {
  // Form fields
  reportForm = {
    companyId: '',
    userId: '',
    userGroupId: '',
    partnerId: '',
    fromDate: '',
    toDate: ''
  };

  // Options for selects
  users = [];
  userGroups = [];
  partners = [];

  // Error and success messages
  reportSuccessMessage: string | null = null;
  reportErrorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private userGroupService: UserGroupService,
    private partnerService: PartnerService,
    private reportService: ReportService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get companyId from localStorage
    this.reportForm.companyId = localStorage.getItem('companyId') || '';

    // Load data for dropdowns
    this.loadUsers();
    this.loadUserGroups();
    this.loadPartners();
  }

  // // Fetch users
  // loadUsers() {
  //   this.userService.getAllUsers().subscribe(
  //     (data: any) => this.users = data,
  //     error => console.error('Error loading users:', error)
  //   );
  // }
  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data: any) => { this.users = data.users, logger.log(data) },
      (error: any) => {
        logger.error('Error loading users:', error);
        this.reportErrorMessage = 'Failed to load users.';
      }
    );
  }


  // Fetch user groups
  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data: any) => { this.userGroups = data.userGroup, logger.log(data) },
      error => logger.error('Error loading user groups:', error)
    );
  }

  // Fetch partners
  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data: any) => { this.partners = data.partners, logger.log(data) },
      error => logger.error('Error loading partners:', error)
    );
  }

  // Handle form submission
  onSubmit() {
    logger.log('This works');
    this.reportService.createReport(this.reportForm).subscribe(
      response => {
        this.reportSuccessMessage = 'Report created successfully!';
        this.reportErrorMessage = null;
        // Redirect to the report details page if needed
        this.router.navigate([`/reports`]);
      },
      error => {
        this.reportErrorMessage = 'Error creating report.';
        this.reportSuccessMessage = null;
      }
    );
  }

}

