import { logger } from '@core/logger';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxService } from "../../../../services/taxService/tax.service";
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserService } from 'src/app/services/userService/user.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-radxcreatetaxes',
  templateUrl: './radxcreatetaxes.component.html',
  styles: [
  ]
})
export class RadxcreatetaxesComponent implements OnInit {
  @ViewChild('taxForm') taxForm!: NgForm;
  tax = {
    taxName: '',
    percentage: 0,
    companyId: '',
    idNo: '',
    userGrId: null,
    userId: null,
    partnerId: null,
    // createFor: ''
  };
  company: any;
  companies = [];
  users = [];
  usergroups = [];
  partners = [];
  errorMessage: string = '';
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


  constructor(
    private taxService: TaxService,
    private companyService: CompanyService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private partnerService: PartnerService,
    private companyMemberService: CompanyMemberService,
    private router: Router) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.tax.companyId = company_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.loadCompanies();
            this.loadUsers();
            this.loadUserGroups();
            this.loadPartners();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.loadCompanies();
            this.loadUsers();
            this.loadUserGroups();
            this.loadPartners();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
          case 'USER':
case 'COMPANY_USER':
          case 'SUPER_USER':
            // this.getCompaniesById(company_id);
            this.loadCompaniesByCompany(company_id);
            this.loadUserGroupsByCompany(company_id);
            this.loadPartnersByCompany(company_id);
            this.loadCompanyMembers(company_id);
            break;
          // this.loadCompanies();
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getUserGroupMembers(company_id);
          //   break;
          // case 'PARTNER_ADMIN':
          // case 'PARTNER_MODERATOR':
          //   this.getPartnerMembers(partner_id);
          //   break;
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
    // this.loadPartners();
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data: any) => {
        this.companies = data.company;
        logger.log('Companies:', this.companies);
      },
      error => {
        logger.error('Error fetching companies:', error);
      }
    );
  }

  // loadCompanyMembers(companyId: number) {
  //   this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
  //     async (data: any) => {
  //       if (data && Array.isArray(data.company_member)) {
  //         this.users = await Promise.all(
  //           data.company_member.map(async (member: any) => {
  //             try {
  //               const userResponse = await this.userService.getUserById(member.user_id).toPromise();
  //               const user = userResponse.user; // Access the user from the response
  //               // Combine member and user into a single object
  //               return {
  //                 ...member,
  //                 user: user // Directly include the user data
  //               };
  //             } catch (error) {
  //               console.error(`Error fetching user with ID ${member.user_id}`, error);
  //               return null; // Return null if there's an error fetching the user
  //             }
  //           })
  //         );

  //         // Filter out any null entries from the result in case of errors
  //         // this.companyMembers = this.companyMembers.filter(member => member !== null);
  //       } else {
  //         console.error('Expected an array but got:', data);
  //         // this.companyMembers = [];
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching company members:', error);
  //       // this.companyMembers = []; // Clear company members in case of error
  //     }
  //   );
  // }
  loadCompanyMembers(companyId: number) {
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

  loadCompaniesByCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data: any) => {
        this.company = data.company;
        logger.log('Companies:', this.companies);
      },
      error => {
        logger.error('Error fetching companies:', error);
      }
    );
  }
  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data.users;
        logger.log('users:', this.users);
      },
      error => {
        logger.error('Error fetching users:', error);
      }
    );
  }
  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data: any) => {
        this.usergroups = data.userGroup;
        logger.log('usergroups:', this.usergroups);
      },
      error => {
        logger.error('Error fetching usergroups:', error);
      }
    );
  }
  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data: any) => {
        this.usergroups = data.userGroup;
        logger.log('usergroups:', this.usergroups);
      },
      error => {
        logger.error('Error fetching usergroups:', error);
      }
    );
  }

  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data: any) => {
        this.partners = data.partners;
        logger.log('partners:', this.partners);
      },
      error => {
        logger.error('Error fetching partners:', error);
      }
    );
  }
  loadPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data: any) => {
        this.partners = data.partner;
        logger.log('partners:', this.partners);
      },
      error => {
        logger.error('Error fetching partners:', error);
      }
    );
  }
  onSubmit() {


    this.markFormGroupTouched(this.taxForm);

    if (this.taxForm.invalid) {
      // If the form is invalid, do not proceed with the submission
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    logger.log('Before submitting, tax object:', this.tax);
    if (!this.tax.companyId) {
      logger.error('Company ID is missing!');
      this.errorMessage = 'Company ID is required to add a tax.';
      return;
    }
    // Clear previous messages
    this.errorMessage = null;
    logger.log(this.taxForm.value);
    // Call addTax API
    this.taxService.addTax(this.tax).subscribe({
      next: (response) => {
        logger.log('Tax created successfully:', response);
        this.router.navigate(['/rates/taxes']);
      },
      error: (error) => {
        logger.error('Error creating tax:', error);
        this.errorMessage = this.handleError(error);
      }
    });
  }


  handleError(error: any): string {
    if (error.status === 400) {
      return 'Invalid tax data. Please check your inputs and try again.';
    } else if (error.status === 401) {
      return 'Unauthorized access. Please log in and try again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'Tax record not found.';
    } else if (error.status === 409) {
      return 'A tax record with this name or rate already exists.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  } private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
