import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/authService/auth.service';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { ConnectorService } from 'src/app/services/connectorService/connector.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styles: [
  ]
})
export class AddReservationComponent implements OnInit {
  userRole: string | null = null;
  reservationFee: any;
  userBalance: any;
  userAllowPayAsYouGo: any;
  enableAddReservation: boolean = false;
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
  company_id: any;
  usergroup_id: any;
  isRadXRole: boolean = false;
  isUserRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  chargerId: any;
  connectorId: any;
  ocppId: any;
  chargerDetails: any;
  users: any[] = [];
  partner_id: any;
  user_id: any;
  connector = {
    connector_id: '',
    connector_name: '',
  }
  reservation = {
    connectorId: '',
    userId: '',
    date: '',
    time: ''
  };
  minDate: string = '';
  errorMessage: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chargerService: ChargerService,
    private userService: UserService,
    private connectorService: ConnectorService,
    private authService: AuthService,
    private partnerMemberService: PartnerMemberService,
    private userGroupMembersService: UserGroupMembersService,
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.chargerId = this.route.snapshot.paramMap.get('charger_id');
    this.connectorId = this.route.snapshot.paramMap.get('connector_id');

    const cugpCred = localStorage.getItem('cugpCred');

    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.getChargerDetails(this.chargerId);
            this.getUsers();
            this.getConnector();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.getChargerDetails(this.chargerId);
            this.getUsers();
            this.getConnector();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getChargerDetails(this.chargerId);
            this.getUsersByCompany(this.company_id);
            this.getConnector();
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.getChargerDetails(this.chargerId);
            this.getUsersByCompany(this.company_id);
            this.getConnector();
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            this.getChargerDetails(this.chargerId);
            this.getUsersByCompany(this.company_id);
            this.getConnector();
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyRole = true;
            this.isCompanyAnalyst = true
            this.getChargerDetails(this.chargerId);
            this.getUsersByCompany(this.company_id);
            this.getConnector();

            break;
          case 'COMPANY_USER':
            // this.isCompanyRole = true;
            this.isUserRole = true;
            this.getChargerDetails(this.chargerId);
            this.getConnector();
            this.getUserDetails(this.user_id);
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.getChargerDetails(this.chargerId);
            this.getConnector();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.getChargerDetails(this.chargerId);
            this.getConnector();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            this.isUserRole = true;
            this.getChargerDetails(this.chargerId);
            this.getConnector();
            this.getCurrentUser();
            this.getUserDetails(this.user_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getChargerDetails(this.chargerId);
            this.getConnector();
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'USER':
          case 'SUPER_USER':
            logger.log('SUPER_USER is set to true');
            this.isUserRole = true;
            this.getChargerDetails(this.chargerId);
            this.getConnector();
            this.getCurrentUser();
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


    // Set the minimum date to today
    this.minDate = new Date().toISOString().split('T')[0];
  }

  getChargerDetails(chargerId: number): void {
    this.chargerService.getCharger(chargerId).subscribe({
      next: (response: any) => {
        logger.log('Charger Details:', response);
        this.chargerDetails = response;  // Save response to the component's property
        this.ocppId = response.charger.ocpp_id;
        this.reservationFee = response.charger.reservation_fee;
        logger.log(' this.reservationFee:', this.reservationFee);
        logger.log('OCPP ID:', this.ocppId);
      },
      error: (error) => {
        logger.error('Error fetching charger details:', error);
      }
    });
  }
  // Fetch users to populate the user dropdown
  getUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data.users;

        logger.log('Users:', this.users);
      },
      error: (error) => {
        logger.error('Error fetching users:', error);
        this.errorMessage = 'Error fetching users. Please try again.';
      }
    });
  }

  getUserDetails(id: number): Observable<any> {
    return this.userService.getUserById(id).pipe(
      map(response => response.user), // Extract user data directly
      catchError(error => {
        logger.error('Error fetching User details:', error);
        return of(null); // Return null in case of error
      })
    );
  }
  loadUsersByPartner(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
      async (data: any) => {
        logger.log("(data.partnerMember)", data.partnerMember);
  
        if (data && Array.isArray(data.partnerMember)) {
          this.users = await Promise.all(data.partnerMember.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user;
  
              logger.log("(userResponse)", userResponse);
  
              return {
                ...member,
                user: {
                  id: user.id,
                  name: user.name,
                  balance: user.balance,
                  allowPayAsYouGo: user.allow_pay_as_you_go
                }
              };
            } catch (error) {
              logger.error('Error fetching user for partner member:', member, error);
              return { ...member, user: null };
            }
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.users = [];
        }
  
        logger.log("this.users (partner)", this.users);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching partner members:', error);
      }
    );
  }
  
  loadUsersByUserGroups(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      async (data: any) => {
        logger.log("(data.userGroupMembers",data.userGroupMembers); 
        if (data && Array.isArray(data.userGroupMembers)) {
          // Map through company members and fetch user details for each member
          this.users = await Promise.all(data.userGroupMembers.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user; // Extract user details from the response
              logger.log("(userResponse",userResponse); 
              // Combine member and user data
              return {
                ...member,
                user: {
                  id: user.id,
                  name: user.name,
                  balance: user.balance,
                  allowPayAsYouGo: user.allow_pay_as_you_go
                },
              };
            } catch (error) {
              logger.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.users = [];
        }

        logger.log("this.users",this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching company members:', error);
      }
    );
  }
  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      (data) => {
        logger.log(data);
        this.users = data.user.userId;
      },
      error => {
        logger.log(error);
      }
    )
  }
  onUserChange() {
    if (this.reservation.userId) {
      logger.log("this.reservation.userId", this.reservation.userId);
      this.getUserBalance(this.reservation.userId);
    }
  }
  getUserBalance(userId: string) {
    this.userService.getUserById(userId).subscribe({
      next: (data: any) => {
        logger.log("data", data);
        this.userBalance = data.user.balance;
        this.userAllowPayAsYouGo = data.user.allow_pay_as_you_go;
        logger.log("userBalance", this.userBalance);
        this.checkReservationFee();
      },
      error: (error) => {
        logger.error('Error fetching user balance:', error);
        this.errorMessage = 'Error fetching user balance. Please try again.';
      }
    });
  }
  checkReservationFee() {
    logger.log("userBalance", this.userBalance);
    logger.log("userAllowPayAsYouGo", this.userAllowPayAsYouGo);
    logger.log("reservationFee", this.reservationFee);
    if (this.userBalance < this.reservationFee && (this.userAllowPayAsYouGo === "false" || this.userAllowPayAsYouGo === "0")) {
      this.enableAddReservation = false;
      logger.log("enableAddReservation", this.enableAddReservation)
    } else {
      this.enableAddReservation = true;
    }
  }
  // Fetch connectors based on the charger ID to populate the connector dropdown
  getConnector(): void {
    this.connectorService.getConnector(this.connectorId).subscribe({
      next: (data: any) => {
        logger.log('getConnector data:', data);
        this.connector = data.connector;
        this.reservation.connectorId = data.connector.connector_id;

      },
      error: (error) => {
        logger.error('Error fetching connectors:', error);
        this.errorMessage = 'Error fetching connectors. Please try again.';
      }
    });
  }

  getUsersByCompany(companyId: number) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        this.users = data.users
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }
  // Handle form submission
  onSubmit() {
    const now = new Date();

    // Validate form fields
    if (!this.reservation.userId || !this.reservation.connectorId) {
      this.errorMessage = 'Please fill in all required fields before submitting.';
      logger.error('Form is incomplete. Please fill in all fields.');
      return;
    }

    // Prepare request body
    const body = {
      user_id: this.reservation.userId,
      charger_id: this.chargerId,  // Obtained from URL params
      connector_id: this.connectorId,
      date: now.toISOString().split('T')[0],  // Format YYYY-MM-DD
      time: now.toTimeString().split(' ')[0]  // Format HH:MM:SS
    };

    logger.log("this.ocppId, body", this.ocppId, body);

    // Clear previous messages
    this.errorMessage = null;

    // Call the reservation service
    this.chargerService.addReservation(this.ocppId, body).subscribe({
      next: (response) => {
        logger.log('Reservation created successfully:', response);
        this.router.navigate(['/monitoring/reservation']);
      },
      error: (error) => {
        logger.error('Error creating reservation:', error);
        this.errorMessage = this.handleRechargeError(error);
      }
    });
  }

  // Common error handler function
  handleRechargeError(error: any): string {
    if (error.status === 400) {
      return 'Invalid reservation data. Please check the fields and try again.';
    } else if (error.status === 401) {
      return 'Unauthorized access. Please log in and try again.';
    } else if (error.status === 403) {
      return 'You do not have permission to make this reservation.';
    } else if (error.status === 404) {
      return 'Charger or connector not found. Please try again.';
    } else if (error.status === 409) {
      return 'This connector is already reserved for the selected time.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }


}
