// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ChargerStatusService } from "../../../../services/chargerStatusService/charger-status.service";
// import { ChargerService } from "../../../../services/chargerService/charger.service";
// import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
// export enum SelectionType {
//   single = "single",
//   multi = "multi",
//   multiClick = "multiClick",
//   cell = "cell",
//   checkbox = "checkbox"
// }

// @Component({
//   selector: 'app-radxstationstatus',
//   templateUrl: './radxstationstatus.component.html',
//   styles: [
//   ]
// })
// export class RadxstationstatusComponent implements OnInit {
//   entries: number = 10;
//   selected: any[] = [];
//   temp = [];
//   activeRow: any;
//   errorMessage: any;
//   locations: any = [];
//   SelectionType = SelectionType;

//   userRole: string | null = null;
//   isRadXAdmin: boolean = false;
//   isRadXModerator: boolean = false;
//   isSuperUser: boolean = false;
//   isCompanyAdmin: boolean = false;
//   isCompanyModerator: boolean = false;
//   isCompanyOperator: boolean = false;
//   isCompanyTechnicalOperator: boolean = false;
//   isCompanyMaintenanceSpecialist: boolean = false;
//   isCompanyCallCenter: boolean = false;
//   isCompanyAnalyst: boolean = false;
//   isUserGroupAdmin: boolean = false;
//   isUserGroupModerator: boolean = false;
//   isUserGroupUser: boolean = false;
//   isPartnerAdmin: boolean = false;
//   isPartnerModerator: boolean = false;
//   isUser: boolean = false;

//   constructor(
//     private chargerStatusService: ChargerStatusService, 
//     private chargerService: ChargerService, 
//     private chargerLocationService: ChargerLocationService, 
//     private router: Router
//   ) {
//   }

//   ngOnInit() {
//     this.userRole = localStorage.getItem('userRole');
//     console.log(localStorage.getItem('userRole'))

//     const cugpCred = localStorage.getItem('cugpCred');
//     if (cugpCred) {
//       const parsedCugpCred = JSON.parse(cugpCred);

//       if (this.userRole) {
//         switch (this.userRole) {
//           case 'RadX_Admin':
//             this.isRadXAdmin = true;
//             break;
//           case 'RADX_MODERATOR':
//             this.isRadXModerator = true;
//             break;
//           case 'COMPANY_ADMIN':
//             this.isCompanyAdmin = true;
//             const company_id = parsedCugpCred.company_id;
//             console.log('Company ID:', company_id);
//             break;
//           case 'SUPER_USER':
//             this.isSuperUser = true;
//             break;
//           case 'COMPANY_OPERATOR':
//             this.isCompanyOperator = true;
//             const company_id = parsedCugpCred.company_id;
//             console.log('User Group ID:', company_id);
//             break;
//           case 'COMPANY_MODERATOR':
//             this.isCompanyModerator = true;
//             break;
//           case 'COMPANY_TECHNICAL_OPERATOR':
//             this.isCompanyTechnicalOperator = true;
//             break;
//           case 'COMPANY_MAINTENANCE_SPECIALIST':
//             this.isCompanyMaintenanceSpecialist = true;
//             break;
//           case 'COMPANY_CALL_CENTER':
//             this.isCompanyCallCenter = true;
//             break;
//           case 'COMPANY_ANALYST':
//             this.isCompanyAnalyst = true;
//             break;
//           case 'USER_GROUP_ADMIN':
//             this.isUserGroupAdmin = true;
//             break;
//           case 'USER_GROUP_MODERATOR':
//             this.isUserGroupModerator = true;
//             break;
//           case 'USER_GROUP_USER':
//             this.isUserGroupUser = true;
//             break;
//           case 'PARTNER_ADMIN':
//             this.isPartnerAdmin = true;
//             break;
//           case 'PARTNER_MODERATOR':
//             this.isPartnerModerator = true;
//             break;
//           case 'USER':
// case 'COMPANY_USER':
//             this.isUser = true;
//             break;
//           default:
//             console.error('Unknown user role:', this.userRole);
//             this.router.navigate(['/login']); // Redirect to login or error page
//         }
//       }

//       const company_id = parsedCugpCred.company_id;
//       console.log('User Group ID:', company_id);
//     }
//     else {
//       console.error('No cugpCred found in localStorage');
//     }

//     // this.getChargerStatus();
//     this.getLocations();
//   }

// getLocations() {
//   this.chargerLocationService.getAllChargerLocations().subscribe(
//     (data) => {
//       console.log(data);
//       if (Array.isArray(data.location)) {
//         this.locations = data.location;
//         // this.temp = [...this.rows];
//         this.locations.forEach((row, index) => {
//           this.chargerService.getChargerByLocation(row.location_id).subscribe(
//             (chargerData) => {
//               console.log(chargerData);
//               this.locations[index].noOfChargers = chargerData.charger.length;  // Add charger details to the row
//               // this.temp = [...this.rows];  // Update temp to reflect changes
//               console.log("Full Locations", this.locations)
//             },
//             (error) => {
//               this.errorMessage = error.message;
//               console.log(error);
//             }
//           );
//         })
//       } else {
//         console.error('Unexpected data structure:', data);
//       }
//     },
//     (error) => {
//       this.errorMessage = error.message;
//       console.log(error);
//     }
//   );
// }

// }

import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerStatusService } from "../../../../services/chargerStatusService/charger-status.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-radxstationstatus',
  templateUrl: './radxstationstatus.component.html',
  styles: [
  ]
})
export class RadxstationstatusComponent implements OnInit {
  entries: number = 10;
  currentPage: number = 1; // Current page
  totalLocations: number = 0; // Total number of locations
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  locations: any = [];
  SelectionType = SelectionType;
  isInputVisible: boolean = false;
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
  totalChargingHistory: any;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  usergroup_id: any;
  companyId: any;
  itemsPerPage: number = 5;
  filteredLocations: any[] = [];
  searchTerm: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  constructor(
    private chargerStatusService: ChargerStatusService,
    private chargerService: ChargerService,
    private chargerLocationService: ChargerLocationService,
    private companyService: CompanyService,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private router: Router
  ) {
    this.temp = this.locations.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  get totalPages(): number {
    return Math.ceil(this.totalLocations / this.entries);
  }

  filterTable(event: any) {
    const query = event.target.value.toLowerCase();
    logger.log('Search query:', query);
  
    // Filter the locations based on the search query
    this.filteredLocations = this.locations.filter(location => {
      // Ensure the location_name and address are valid before calling toLowerCase
      const locationNameMatch = location.location_name && location.location_name.toLowerCase().includes(query);
      const addressMatch = location.address && location.address.toLowerCase().includes(query);
  
      const matches = locationNameMatch || addressMatch;
  
      // Log each location and whether it matches
    //  console.log('Location matches:', location, matches);
      return matches;
    });
  
    // Log the filtered locations for debugging
    logger.log('Filtered Locations:', this.filteredLocations);
  }
  
  
  toggleSearchInput() {
    this.isInputVisible = !this.isInputVisible; // Toggle input visibility on icon click
  }
  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getAllLocations();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getAllLocations();
            break;
          case 'COMPANY_ADMIN':
            logger.log('COMPANY_ADMIN is set to true');
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getLocationsByCompanyId(company_id);
            break;
          case 'COMPANY_OPERATOR':
            logger.log('COMPANY_OPERATOR is set to true');
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.getLocationsByCompanyId(company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            this.getLocationsByCompanyId(company_id);
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
            this.getLocationsByCompanyId(company_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            logger.log('SUPER_USER is set to true');
            this.isUserRole = true;
            this.getLocationsByCompanyId(company_id);
            break;
          case 'USER_GROUP_ADMIN':
            logger.log('USER_GROUP_ADMIN is set to true');
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.getUserDetails(user_id);
            // this.getLocationsByCompanyId(company_id);
            break;
          case 'USER_GROUP_MODERATOR':
            logger.log('USER_GROUP_MODERATOR is set to true');
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.getUserDetails(user_id);
            // this.getLocationsByCompanyId(company_id);
            break;
          case 'USER_GROUP_USER':
            logger.log('USER_GROUP_USER is set to true');
            this.isUserGroupUser = true;
            this.isUserGroupRole = true;
            this.isUserRole = true;
            this.getUserDetails(user_id);
            // this.getLocationsByCompanyId(company_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            logger.log('PARTNER_ROLE is set to true');
            this.isPartnerRole = true;
            this.getLocationsByPartnerId(partner_id);
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
  }

  // getAllLocations() {
  //   this.chargerLocationService.getAllChargerLocations().subscribe(
  //     (data) => {
  //       this.handleLocationData(data);
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  getAllLocations() {
    this.chargerLocationService.getAllChargerLocations().subscribe(
      (data) => {
        if (Array.isArray(data.location)) {
          this.locations = data.location;
        //  console.log('Fetched Locations:', this.locations);  // Log locations here
          this.locations.forEach((row, index) => {
            this.chargerService.getChargerByLocation(row.location_id).subscribe(
              (chargerData) => {
                this.locations[index].noOfChargers = chargerData.charger.length;
                this.filteredLocations = [...this.locations]; // Populate filtered list
              },
              (error) => {
                this.errorMessage = error.message;
              }
            );
          });
        }
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }
  


  // getLocationsByCompanyId(company_id: string) {
  //   this.chargerLocationService.getChargerLocationByCompany(company_id).subscribe(
  //     (data) => {
  //       this.handleLocationData(data);
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  getLocationsByCompanyId(company_id: string) {
    this.chargerLocationService.getChargerLocationByCompany(company_id).subscribe(
      (data) => {
        if (Array.isArray(data.location)) {
          this.locations = data.location;
          this.filteredLocations = []; // Clear filteredLocations before updating
          this.locations.forEach((row, index) => {
            this.chargerService.getChargerByLocation(row.location_id).subscribe(
              (chargerData) => {
                this.locations[index].noOfChargers = chargerData.charger.length;
                this.filteredLocations.push(this.locations[index]); // Add updated location to filtered list
              //  console.log("Updated filteredLocations", this.filteredLocations);
              },
              (error) => {
                this.errorMessage = error.message;
              }
            );
          });
        }
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }

  getLocationsByPartnerId(partner_id: string) {
    this.chargerLocationService.getChargerLocationByPartner(partner_id).subscribe(
      (data) => {
        if (Array.isArray(data.location)) {
          this.locations = data.location;
          this.filteredLocations = []; // Clear filteredLocations before updating
          this.locations.forEach((row, index) => {
            this.chargerService.getChargerByLocation(row.location_id).subscribe(
              (chargerData) => {
                this.locations[index].noOfChargers = chargerData.charger.length;
                this.filteredLocations.push(this.locations[index]); // Add updated location to filtered list
              //  console.log("Updated filteredLocations", this.filteredLocations);
              },
              (error) => {
                this.errorMessage = error.message;
              }
            );
          });
        }
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }


  getUserDetails(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        logger.log("response.user.isPhoneVerified", response.user.isPhoneVerified)
        this.companyId = response.user.company_id;
        this.getLocationsByCompanyId(this.companyId);
      },
      error: (error) => {
        logger.error('Error fetching User details:', error);
      }
    });
  }

  handleLocationData(data: any) {
    if (Array.isArray(data.location)) {
      this.locations = data.location;
      this.locations.forEach((row, index) => {
        this.chargerService.getChargerByLocation(row.location_id).subscribe(
          (chargerData) => {
            this.locations[index].noOfChargers = chargerData.charger.length;
            logger.log("Full Locations", this.locations);
          },
          (error) => {
            this.errorMessage = error.message;
            logger.log(error);
          }
        );
      });
    } else {
      logger.error('Unexpected data structure:', data);
    }
  }
}
