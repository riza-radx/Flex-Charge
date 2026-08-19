import { logger } from '@core/logger';
import { Component, OnInit, ElementRef, HostListener, ChangeDetectorRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AuthService } from "../../services/authService/auth.service";
import { UserService } from "../../services/userService/user.service";
import { NotificationService } from "../../services/nottificationService/notification.service";

import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  sidenavOpen: boolean = true;
  name: any;
  image: any;
  notifications: any = [];
  errorMessage: any;
  newNotificationCount: number = 0;
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

  userDetails: any;
  userDetailsId: any;
  userDetailsCId: any;
  private socket: WebSocket;


  // isAble: boolean = false;
  public searchTerm: string = '';
  isAble: boolean = false;

  showDropdown: boolean = false;

  allRoutes = [
    { "path": "/dashboards", "title": "Dashboard" },
    { "path": "/monitoring/charging", "title": "Charging" },
    { "path": "/monitoring/stationStatus", "title": "Station Status" },
    { "path": "/monitoring/alarm", "title": "Alarm" },
    { "path": "/monitoring/reservation", "title": "Reservation" },
    { "path": "/users/user", "title": "User" },
    { "path": "/users/usergroup", "title": "User Group" },
    { "path": "/companies/company", "title": "Company" },
    { "path": "/partners/partner", "title": "Partner" },
    { "path": "/rfid-cards/rfidcard", "title": "RFID Card" },
    { "path": "/rates/rate", "title": "Rate" },
    { "path": "/rates/promo", "title": "Promo" },
    { "path": "/rates/vouchers", "title": "Vouchers" },
    { "path": "/rates/currency", "title": "Currency" },
    { "path": "/rates/taxes", "title": "Taxes" },
    { "path": "/assets/chargers", "title": "Chargers" },
    { "path": "/assets/locations", "title": "Locations" },
    { "path": "/assets/vehicle", "title": "Vehicle" },
    { "path": "/maps/google", "title": "Maps" },
    { "path": "/reports/financial", "title": "Reports" },
    { "path": "/assets/documents", "title": "Documents" },
    { "path": "/assets/charinghistory", "title": "Charging History" },
    { "path": "/appnotifications", "title": "Notification" },
    { "path": "/profile", "title": "Profile" },
    { "path": "/settings/setting", "title": "Settings" },
  ]

  public filteredRoutes = [...this.allRoutes];


  constructor(
    location: Location,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.location = location;
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator

      }
      if (event instanceof NavigationEnd) {
        // Hide loading indicator

        if (window.innerWidth < 1200) {
          document.body.classList.remove("g-sidenav-pinned");
          document.body.classList.add("g-sidenav-hidden");
          this.sidenavOpen = false;
        }
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        logger.log(event.error);
      }
    });

  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.getCurrentUser();
    this.filteredRoutes = this.allRoutes;

    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);

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
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.isAble = true;
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.isAble = true;
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            this.isAble = true;
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true
            this.isAble = true;
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true
            this.isAble = true;
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true
            this.isAble = true;
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyRole = true;
            this.isCompanyAnalyst = true
            this.isAble = true;
            this.isCompanyRole = true;
            // this.getNotificationsByCompany(this.company_id)
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.isAble = true;
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.isAble = true;
            break;
          case 'USER_GROUP_USER':
            //  this.isUserGroupRole = true;
            this.isUserRole = true;
            this.isAble = true;
            // this.usergroup_id = parsedCugpCred.usergr_id;
            // this.getNotificationsByUsergroup(usergroup_id)
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isAble = true;
            this.isPartnerRole = true;
            // this.partner_id = parsedCugpCred.partner_id;
            // this.getNotificationsByPartner(partner_id)
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isAble = true;
            this.isUserRole = true;
            // this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
            // this.getNotificationsByUser(user_id)
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
    this.getIpData()
    // this.getCurrentUserDetail()
  }

  searchRoutes() {
    if (!this.searchTerm.trim()) {
      return this.allRoutes; // Return all routes if search term is empty
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    return this.allRoutes.filter(route =>
      route.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
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
          // console.log("this.isCompanyRole this.company_id", this.company_id, data.timezone)
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

  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: MouseEvent) {
  //   const target = event.target as HTMLElement;

  //   // Check if the clicked element is inside the search box or dropdown
  //   if (!this.elementRef.nativeElement.contains(target)) {
  //     this.showDropdown = false;
  //     this.cdr.detectChanges(); // Force change detection
  //   }
  // }

  // getCurrentUserDetail() {
  //   this.authService.getCurrentUserDetails().subscribe(
  //     (data) => {
  //       console.log(data);
  //       this.userDetails = data.user;
  //       this.userDetailsId = data.user.id;
  //       this.userDetailsCId = data.user.company_id;
  //       this.connectToWebSocket();
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   )
  // }

  // // WebSocket Connection
  // connectToWebSocket() {
  //   const socketUrl = `wss://api.radx.app/wss?userId=${this.userDetailsId}&companyId=${this.userDetailsCId}`;
  //   this.socket = new WebSocket(socketUrl);

  //   // Handle WebSocket connection open
  //   this.socket.onopen = (event) => {
  //     console.log('WebSocket is open now.');
  //   };

  //   // Handle incoming messages from WebSocket
  //   this.socket.onmessage = (event) => {
  //     console.log('Message from server:', event.data);

  //     // Parse the incoming message
  //     const message = JSON.parse(event.data);

  //     // Check if the message type is "statusUpdate"
  //     if (message.type === 'appNotification') {

  //        // Add the new notification to the notifications array
  //     this.notifications.unshift(message);

  //     // Increase the new notification count
  //     this.newNotificationCount++;

  //     // Optionally, trigger UI updates if necessary
  //     console.log('New Notification:', message);
  //       // Update the charger status
  //       // this.updateChargerStatus(message.chargerId, message.chargerStatus);

  //       // Update the connector status
  //       // this.updateConnectorStatus(message.connectorId, message.status);
  //     }
  //   };

  //   // Handle WebSocket errors
  //   this.socket.onerror = (error) => {
  //     console.error('WebSocket Error:', error);
  //   };

  //   // Handle WebSocket closure
  //   this.socket.onclose = (event) => {
  //     console.log('WebSocket is closed now.');
  //   };
  // }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  openSearch() {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function () {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  }
  closeSearch() {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  }
  openSidebar() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }
  toggleSidenav() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      (data) => {
        // console.log(data);
        this.name = data.user.name;
        this.user_id = data.user.userId;
        // this.image = data.user.user_image;
        this.getCurrentUserById(data.user.userId)
      },
      error => {
        logger.log(error);
      }
    )
  }
  getCurrentUserById(id: number) {
    this.userService.getUserById(id).subscribe(
      (data) => {
        // console.log(data);
        // this.name = data.user.name;
        this.image = data.user.user_image;
      },
      error => {
        logger.log(error);
      }
    )
  }

  logout() {
    this.authService.userLogout().subscribe(
      response => {

        // console.log('Logout successful');
        this.router.navigate(['/login']);  // Navigate to the login page
        window.location.reload();
      },
      error => {
        logger.error('Logout failed', error);
      }
    );
  }

  getNotifications(timezone: any) {
    this.notificationService.getAllNotifications(timezone).subscribe(
      (data) => {
        this.notifications = data.notifications.filter(
          (notification: any) => notification.isOpened === 0
        );
        this.newNotificationCount = this.notifications.length || 0;
        // console.log(this.notifications);
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
        // console.log("getNotificationsByCompany data", data);
        this.notifications = data.notifications.filter(
          (notification: any) => notification.isOpened === false || notification.isOpened === 0
        );
        this.newNotificationCount = this.notifications.length || 0;
        // console.log("getNotificationsByCompany", this.notifications);
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
        this.notifications = data.notifications.filter(
          (notification: any) => notification.isOpened === false || notification.isOpened === 0
        );
        this.newNotificationCount = this.notifications.length || 0;
        // console.log("getNotificationsByPartner", this.notifications);
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
        // console.log("getNotificationsByUsergroup", data);
        this.notifications = data.notifications.filter(
          (notification: any) => notification.isOpened === false || notification.isOpened === 0
        );
        this.newNotificationCount = this.notifications.length || 0;
        // console.log("getNotificationsByUsergroup", this.notifications);
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
        this.notifications = data.notifications.filter(
          (notification: any) => notification.isOpened === false || notification.isOpened === 0
        );
        this.newNotificationCount = this.notifications.length || 0;
        // console.log("getNotificationsByUser", this.notifications);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }


  markNotificationsAsRead() {
    // console.log("Inside markNotificationsAsRead");

    if (!this.notifications || this.notifications.length === 0) {
      // console.log("No notifications to update.");
      return;
    }

    // console.log("Updating notifications this.user_id", this.user_id)
    this.notificationService.markNotificationsAsRead(this.user_id).subscribe({
      next: (response) => {
        // console.log("Notifications updated in DB:", response);

        // Update local state to reflect changes
        this.notifications.forEach((notification: any) => {
          notification.isOpened = true;
        });
        this.newNotificationCount = 0;
      },
      error: (error) => {
        logger.error("Failed to update notifications in DB:", error);
      }
    });
  }

  onSearchChange() {
    if (this.searchTerm.trim().length > 0) {
      this.notificationService.searchNotifications(this.searchTerm).subscribe(
        (results) => {
          // console.log('Search results:', results);
          // Handle the results, e.g., show them in the UI or a dropdown
          this.notifications = results;
        },
        (error) => {
          logger.error('Error during search:', error);
          this.errorMessage = 'Failed to perform search. Please try again later.';
        }
      );
    } else {
      this.notifications = []; // Clear notifications if the search term is empty
    }
  }


  searchItems(query: string) {
    // Example: Call your search API or filter list based on the query
    this.notificationService.searchNotifications(query).subscribe(
      (results) => {
        // console.log('Search results:', results);
        this.notifications = results; // Update notifications or any other list
      },
      (error) => {
        logger.error('Search error:', error);
      }
    );
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check if the clicked element is inside the search box or dropdown
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showDropdown = false;
      this.cdr.detectChanges(); // Force change detection
    }
  }
}
