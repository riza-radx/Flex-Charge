import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { EvVehicleService } from 'src/app/services/ev-vehicleService/ev-vehicle.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';
import { VehicleService } from 'src/app/services/vehicleService/vehicle.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';


@Component({
  selector: 'app-companyupdatevehicle',
  templateUrl: './companyupdatevehicle.component.html',
  styles: [
  ]
})
export class CompanyupdatevehicleComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleId: number;
  companies = [];
  users = [];
  usergroups = [];
  evVehicleBrands: any = [];
  evVehicleModels: any = [];
  evVehicleYears: any = [];

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

  isUserRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private userService: UserService,
    private companyService: CompanyService,
    private userGroupService: UserGroupService,
    private companyMemberService: CompanyMemberService,
    private partnerMemberService: PartnerMemberService,
    private partnerService: PartnerService,
    private userGroupMembersService: UserGroupMembersService,
    private router: Router,
    private route: ActivatedRoute,
    private evVehicleService: EvVehicleService
  ) {
    this.vehicleForm = this.fb.group({
      vinCode: [''],
      vehicleNumber: [''],
      vehicleBrand: ['', Validators.required],
      vehicleModel: [null],
      vehicleYear: [''],
      userId: [null],
      companyId: [null],
      usergrId: [null],
      createdTime: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.params['id'];
    this.getVehicleById(this.vehicleId);
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
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
            this.isRadXModerator = true;
            this.loadCompanies();
            this.isCompanyRole = true;
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
            this.loadCompaniesByCompany(company_id);
            this.loadUsersByCompany(company_id);
            this.loadUserGroupsByCompany(company_id);
            // this.getCurrencies(company_id);
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            // this.loadCompaniesByUserGroup(usergroup_id);
            this.isUserGroupRole = true;
            this.loadUsersByUserGroup(usergroup_id);
            this.loadUserGroupsByUserGroup(usergroup_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            // this.getLocationsByPartner(partner_id);
            //       this.loadCompaniesByPartner(partner_id);
            this.loadUsersByPartner(partner_id);
            this.loadPartnersByPartner(partner_id);
            // this.loadUserGroupsByPartner(partner_id);
            break;
          case 'USER':
case 'COMPANY_USER':
          case 'SUPER_USER':
            // this.getVehiclesByUser(user_id);
            this.isUserRole = true;
            //     this.loadCompaniesByUser(user_id);
            // this.loadUsersByUser(user_id);
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
    // this.loadCompanies();
    // this.loadUsers();
    // this.loadUserGroups();
    this.loadEvVehicleBrands();
    logger.log('this.loadUserGroups()', this.loadUserGroups);
    //throw new Error('Method not implemented.');

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
      response => this.companies = [response.company],
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
    this.userGroupMembersService.getUserGroupMember(userGroupId).subscribe(
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

  // onModelChange(event: any) {
  //   const selectedModel = event.target.value;
  //   if (selectedModel) {
  //     this.evVehicleService.getEVVehicleByModel(selectedModel).subscribe(
  //       (response) => {
  //         const vehicles = response.data;
  //         this.evVehicleYears = [...new Set(vehicles.map((vehicle: any) => vehicle.year))];
  //       },
  //       (error) => console.error('Error fetching EV vehicle years', error)
  //     );
  //   } else {
  //     this.evVehicleYears = [];
  //   }
  // }

  onModelChange(event: any) {
    const selectedModel = event.target.value;
    this.vehicleForm.get('vehicleYear')?.reset(); // reset year field safely
  
    if (selectedModel) {
      this.evVehicleService.getEVVehicleByModel(selectedModel).subscribe(
        (response) => {
          const vehicles = response.data;
          this.evVehicleYears = [...new Set(vehicles.map((v: any) => String(v.year)))];

          logger.log('Available years:', this.evVehicleYears);
        },
        (error) => logger.error('Error fetching EV vehicle years', error)
      );
    } else {
      this.evVehicleYears = [];
    }
  }
  
  
  onSubmit() {
    this.errorMessage = null;
  
    if (this.vehicleForm.invalid) {
      this.errorMessage = 'Please correct the errors before submitting.';
      this.vehicleForm.markAllAsTouched();
      return;
    }
  
    const vehicleData = this.vehicleForm.value;
    logger.log('Submitting vehicleData:', vehicleData);
  
    this.vehicleService.updateVehicle(this.vehicleId, vehicleData).subscribe({
      next: (response) => {
        if (response) {
          logger.log('Vehicle updated successfully:', response);
          setTimeout(() => {
            this.router.navigate([`/assets/vehicle/${this.vehicleId}`]);
          }, 1000);
        } else {
          logger.error('Failed to update vehicle:', response);
          this.errorMessage = 'Failed to update the vehicle. Please try again.';
        }
      },
      error: (error) => {
        logger.error('Error updating vehicle:', error);
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
    

  getVehicleById(id: number): void {
    this.vehicleService.getVehicle(id).subscribe({
      next: (response) => {
        logger.log('ID:', id);
        logger.log('API response:', response);
        const vehicle = response.vehicle;

        // Ensure the response data matches the form structure
        this.vehicleForm.patchValue({
          vinCode: vehicle.vin_code,
          vehicleNumber: vehicle.vehicle_number,
          vehicleBrand: vehicle.vehicle_brand,
          vehicleModel: vehicle.vehicle_model,
          vehicleYear: vehicle.vehicle_year,
          userId: vehicle.user_id,
          companyId: vehicle.company_id,
          usergrId: vehicle.usergr_id,
          createdTime: vehicle.created_time
        });

        // Load models and years based on the current brand and model
        this.loadEvVehicleModels(vehicle.vehicle_brand, vehicle.vehicle_model);
        this.loadEvVehicleYears(vehicle.vehicle_model);
      },
      error: (error) => {
        logger.error('Error fetching vehicle details:', error);
      }
    });
  }

  loadEvVehicleModels(selectedBrand: string, selectedModel: string | null) {
    this.evVehicleService.getEVVehicleByBrand(selectedBrand).subscribe(
      (response) => {
        const vehicles = response.data;
        this.evVehicleModels = [...new Set(vehicles.map((vehicle: any) => vehicle.model))];

        // Set the current model if available
        if (selectedModel) {
          this.vehicleForm.patchValue({ vehicleModel: selectedModel });
        }
      },
      (error) => logger.error('Error fetching EV vehicle models', error)
    );
  }

  loadEvVehicleYears(selectedModel: string | null) {
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
}
