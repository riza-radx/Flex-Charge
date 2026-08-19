import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { NotificationService } from "../../../services/nottificationService/notification.service";

import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from "../../../services/companyService/company.service";
import { PartnerService } from "../../../services/partnerService/partner.service";
import { UserGroupService } from "../../../services/userGroupService/user-group.service";
import { UserService } from "../../../services/userService/user.service";
import { PartnerMemberService } from "../../../services/partner-member.service";
import { CompanyMemberService } from "../../../services/companyMemberService/company-member.service";
import { UserGroupMembersService } from "../../../services/userGroupMembersService/user-group-members.service";

@Component({
  selector: 'app-appnotifications',
  templateUrl: './appnotifications.component.html',
  styles: [
  ]
})
export class AppnotificationsComponent {

  notifications: any = [];
  errorMessage: any;

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

  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;

  company_id: any;
  partner_id: any;
  usergroup_id: any;
  user_id: any;

  isAble: boolean = false;

  constructor(
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private partnerMemberService: PartnerMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      // this.company_id = parsedCugpCred.company_id;
      // partner_id = parsedCugpCred.partner_id;
      // this.usergroup_id = parsedCugpCred.usergr_id;
      // this.user_id = parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.isAble = true;
            // this.getNotifications()
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.isAble = true;
            // this.getNotifications()
            break;
          case 'COMPANY_ADMIN':
            this.company_id = parsedCugpCred.company_id;
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.isAble = true;
          case 'COMPANY_OPERATOR':
            this.company_id = parsedCugpCred.company_id;
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.isAble = true;
            break;
          case 'COMPANY_MODERATOR':
            this.company_id = parsedCugpCred.company_id;
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            this.isAble = true;
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.company_id = parsedCugpCred.company_id;
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true
            this.isAble = true;
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.company_id = parsedCugpCred.company_id;
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true
            this.isAble = true;
            break;
          case 'COMPANY_CALL_CENTER':
            this.company_id = parsedCugpCred.company_id;
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true
            this.isAble = true;
            break;
          case 'COMPANY_ANALYST':
            this.company_id = parsedCugpCred.company_id;
            this.isCompanyAnalyst = true
            this.isAble = true;
            this.isCompanyRole = true;

            // this.getNotificationsByCompany(this.company_id)
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.usergroup_id = parsedCugpCred.usergr_id;
            this.isAble = true;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.isAble = true;
            this.usergroup_id = parsedCugpCred.usergr_id;
            // this.getNotificationsByUsergroup(this.usergroup_id)
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isAble = true;
            this.isPartnerRole = true;
            this.partner_id = parsedCugpCred.partner_id;
            // this.getNotificationsByPartner(this.partner_id)
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
          case 'USER_GROUP_USER':
            this.isAble = true;
            this.isUserRole = true;
            this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
            // this.getNotificationsByUser(this.user_id)
            break;
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

    this.getIpData();

  }

  getIpData() {
    this.notificationService.getIPInfo().subscribe(
      (data) => {
        // this.logs = data.log;
        // this.tempLogs = [...this.logs];
        // console.log("IP Info", data)
        if (this.isRadXRole === true) {
          this.getNotifications(data.timezone)
        }
        else if (this.isCompanyRole === true) {
          this.getNotificationsByCompany(this.company_id, data.timezone)
        }
        else if (this.isUserGroupRole === true) {
          this.getNotificationsByUsergroup(this.usergroup_id, data.timezone)
        }
        else if (this.isPartnerRole === true) {
          this.getNotificationsByPartner(this.partner_id, data.timezone)
        }
        else if (this.isUserRole === true) {
          this.getNotificationsByUser(this.user_id, data.timezone)
        }
        // this.getAlarms(data.timezone);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getNotifications(timezone: any) {
    this.notificationService.getAllNotifications(timezone).subscribe(
      (data) => {
        this.notifications = data.notifications;
        // console.log(data)
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getNotificationsByCompany(companyId: number, timezone: any) {
    this.notificationService.getNotificationByCompany(companyId, timezone).subscribe(
      (data) => {
        this.notifications = data.notifications;
        // console.log(this.notifications)
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getNotificationsByPartner(partnerId: number, timezone: any) {
    this.notificationService.getNotificationByPartner(partnerId, timezone).subscribe(
      (data) => {
        this.notifications = data.notifications;
        // console.log(this.notifications)
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getNotificationsByUsergroup(userGroupId: number, timezone: any) {
    this.notificationService.getNotificationByUserGroup(userGroupId, timezone).subscribe(
      (data) => {
        this.notifications = data.notifications;
        // console.log(this.notifications)
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getNotificationsByUser(userId: number, timezone: any) {
    this.notificationService.getNotificationByUser(userId, timezone).subscribe(
      (data) => {
        this.notifications = data.notifications;
        // console.log(this.notifications)
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

}
