import { logger } from '@core/logger';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { EVVehicle, EvVehicleService } from 'src/app/services/ev-vehicleService/ev-vehicle.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { VehicleService } from 'src/app/services/vehicleService/vehicle.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-companycreatevehicle',
  templateUrl: './companycreatevehicle.component.html',
  styles: [
  ]
})
export class CompanycreatevehicleComponent {
  @ViewChild('vehicleForm') vehicleForm!: NgForm;
  vehicle: any = {
    vinCode: '',
    vehicleNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: null,
    userId: null,
    companyId: null,
    usergrId: null,
    createdTime: this.getCurrentDateTime(), // Set the current time
    createFor: ''
  };

  companies = [];
  users = [];
  usergroups = [];
  evVehicleBrands: any = [];
  evVehicleModels: any = [];
  evVehicleYears: any = [];
  company: any;

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
  errorMessage: string = '';
  isUserRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  company_id: any;
  constructor(
    private vehicleService: VehicleService,
    private userService: UserService,
    private companyService: CompanyService,
    private userGroupService: UserGroupService,
    private companyMemberService: CompanyMemberService,
    private partnerMemberService: PartnerMemberService,
    private partnerService: PartnerService,
    private userGroupMembersService: UserGroupMembersService,
    private router: Router,
    private evVehicleService: EvVehicleService,) { }


  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isCompanyRole = true;
            this.loadCompanies();
            this.loadUsers();
            this.loadUserGroups();
            break;
          case 'RADX_MODERATOR':
            this.isCompanyRole = true;
            this.isRadXModerator = true;
            this.loadCompanies();
            this.loadUsers();
            this.loadUserGroups();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            // this.getVehiclesByCompany(company_id);
            this.isCompanyRole = true;
            this.loadCompaniesByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            // this.getCurrencies(company_id);
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            // this.loadCompaniesByUserGroup(usergroup_id);
            this.loadUsersByUserGroup(usergroup_id);
            this.loadUserGroupsByUserGroup(usergroup_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            // this.getLocationsByPartner(partner_id);
            // this.loadCompaniesByPartner(partner_id);
            this.loadUsersByPartner(partner_id);
            this.loadPartnersByPartner(partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isUserRole = true;
            // this.getVehiclesByUser(user_id);
            //     this.loadCompaniesByUser(user_id);
            this.loadUser(user_id);
            // this.loadUserGroupsByUser(user_id);
            // this.getCurrencies(company_id);
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
    this.loadEvVehicleBrands();
    // this.loadCompanies();
    // this.loadUsers();
    // this.loadUserGroups();
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  loadEvVehicleBrands() {
    this.evVehicleService.getAllEVVehicles().subscribe(
      (response) => {
        // Access the 'data' property from the response
        const vehicles = response.data;

        // Map the response to extract unique vehicle brands
        this.evVehicleBrands = [...new Set(vehicles.map((vehicle: any) => vehicle.brand))];
      },
      (error) => {
        logger.error('Error fetching EV vehicle brands', error);
      }
    );
  }



  onBrandChange(event: any) {
    const selectedBrand = event.target.value;
    if (selectedBrand) {
      this.evVehicleService.getEVVehicleByBrand(selectedBrand).subscribe(
        (response) => {
          logger.log('response: EVVehicle[]', response);
          const vehicles = response.data;
          this.evVehicleModels = [...new Set(vehicles.map((vehicle: any) => vehicle.model))];
          this.evVehicleYears = [];  // Reset years when brand changes
        },
        (error) => logger.error('Error fetching EV vehicle models', error)
      );
    } else {
      this.evVehicleModels = [];
    }
  }

  onModelChange(event: any) {
    const selectedModel = event.target.value;
    if (selectedModel) {
      this.evVehicleService.getEVVehicleByModel(selectedModel).subscribe(
        (response) => {
          const vehicles = response.data;
          this.evVehicleYears = [...new Set(vehicles.map((vehicle: any) => vehicle.year))];
        },
        (error) => logger.error('Error fetching EV vehicle years', error)
      );
    } else {
      this.evVehicleYears = [];
    }
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => logger.error('Error fetching companies', error)
    );
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      response => this.users = response.users,
      error => logger.error('Error fetching users', error)
    );
  }
  loadUser(userId: number) {
    this.userService.getUserById(userId).subscribe(
      response => { logger.log(response); this.users = [response.user] },
      error => logger.error('Error fetching users', error)
    );
  }

  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      response => {
        logger.log('User groups response:', response);  // Log the full response
        this.usergroups = response.userGroup;
      },
      error => logger.error('Error fetching usergroups', error)
    );
  }
  loadCompaniesByCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      response => this.company = response.company,
      error => logger.error('Error fetching companies', error)
    );
  }

  loadUsersByCompany(companyId: number) {
    this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
      (data) => {
        logger.log(data);

        // Ensure that data contains the company_member array
        if (data && Array.isArray(data.company_member)) {
          // Reset the users array
          this.users = [];

          // Iterate over company_member array and push the `User` objects to the `users` array
          data.company_member.forEach((member) => {
            if (member.User) {
              this.users.push(member.User);  // Add the `User` object to `users` array
            }
          });

          logger.log('Extracted Users:', this.users);
        } else {
          logger.error('Unexpected response structure:', data);
        }
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }

  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      response => {
        logger.log('User groups response:', response);  // Log the full response
        this.usergroups = response.userGroup;
      },
      error => logger.error('Error fetching usergroups', error)
    );
  }
  // loadCompaniesByUserGroup(userGroupId: number) {
  //   this.companyService.getCompany(companyId).subscribe(
  //     response => this.companies = [response.company],
  //     error => console.error('Error fetching companies', error)
  //   );
  // }

  loadUsersByUserGroup(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      (data) => {
        logger.log(data);

        // Ensure that data contains the company_member array
        if (data && Array.isArray(data.userGroupMembers)) {
          // Reset the users array
          this.users = [];

          // Iterate over company_member array and push the `User` objects to the `users` array
          data.userGroupMembers.forEach((member) => {
            if (member.User) {
              this.users.push(member.User);  // Add the `User` object to `users` array
            }
          });

          logger.log('Extracted Users:', this.users);
        } else {
          logger.error('Unexpected response structure:', data);
        }
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }

  loadUserGroupsByUserGroup(userGroupId: number) {
    this.userGroupService.getUserGroup(userGroupId).subscribe(
      response => {
        logger.log('User groups response:', response);  // Log the full response
        this.usergroups = [response.userGroup];
      },
      error => logger.error('Error fetching usergroups', error)
    );
  }

  loadPartnersByPartner(partnerId: number) {
    this.partnerService.getPartner(partnerId).subscribe(
      response => {
        logger.log('User groups response:', response);  // Log the full response
        this.usergroups = [response.userGroup];
      },
      error => logger.error('Error fetching usergroups', error)
    );
  }

  loadUsersByPartner(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
      (data) => {
        logger.log(data);

        // Ensure that data contains the company_member array
        if (data && Array.isArray(data.company_member)) {
          // Reset the users array
          this.users = [];

          // Iterate over company_member array and push the `User` objects to the `users` array
          data.company_member.forEach((member) => {
            if (member.User) {
              this.users.push(member.User);  // Add the `User` object to `users` array
            }
          });

          logger.log('Extracted Users:', this.users);
        } else {
          logger.error('Unexpected response structure:', data);
        }
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }

  // onSubmit() {
  //   this.vehicleService.addVehicle(this.vehicle).subscribe({
  //     next: (response) => {
  //       console.log('Vehicle created successfully:', response);
  //       // Navigate or show success message
  //       this.router.navigate(['/assets/vehicle']);
  //     },
  //     error: (error) => {
  //       console.error('Error creating vehicle:', error);
  //     }
  //   });
  // }

  onSubmit() {
    this.errorMessage = null;
    this.vehicle.companyId = this.company_id;

    this.markFormGroupTouched(this.vehicleForm);

    if (this.vehicleForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.vehicleService.addVehicle(this.vehicle).subscribe({
      next: (response) => {
        logger.log('Vehicle created successfully:', response);
        setTimeout(() => {
          this.router.navigate(['/assets/vehicle']);
        }, 1000);
      },
      error: (error) => {
        logger.error('Error creating vehicle:', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Invalid request. Please check the entered details.';
    } else if (error.status === 401) {
      return 'Unauthorized. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'Vehicle not found.';
    } else if (error.status === 409) {
      return 'A vehicle with this information already exists.';
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
}
