import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { TaxService } from 'src/app/services/taxService/tax.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';

@Component({
  selector: 'app-radxupdatetaxes',
  templateUrl: './radxupdatetaxes.component.html',
  styles: [
  ]
})
export class RadxupdatetaxesComponent implements OnInit {

  taxForm: FormGroup;
  taxId: number;
  companies = [];
  userGroups = [];
  users = [];
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
    private fb: FormBuilder,
    private taxService: TaxService,
    private userService: UserService,
    private companyService: CompanyService,
    private userGroupService: UserGroupService,
    private partnerService: PartnerService,
    private companyMemberService: CompanyMemberService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taxForm = this.fb.group({
      taxName: ['', Validators.required],
      percentage: ['', Validators.required],
      companyId: ['', Validators.required],
      idNo: ['', Validators.required],
      userGrId: [''],
      userId: [''],
      partnerId: [''],

    });
  }

  ngOnInit(): void {
    this.taxId = this.route.snapshot.params['id'];
    this.getTaxById(this.taxId);

    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

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
            console.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        console.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }

    // this.loadCompanies();
    // this.loadUsers();
    // this.loadUserGroups();
    // this.loadPartners();
    console.log('this.taxId:', this.taxId);
    // throw new Error('Method not implemented.');
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => console.error('Error fetching companies', error)
    );
  }
  loadCompaniesByCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data: any) => {
        this.companies = [data.company];
        console.log('Companies:', this.companies);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
  loadUsers() {
    this.userService.getAllUsers().subscribe(
      response => this.users = response.users,
      error => console.error('Error fetching users', error)
    );
  }
  loadCompanyMembers(companyId: number) {
    this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
      (data) => {
        console.log(data);

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

          console.log('Extracted Users:', this.users);
        } else {
          console.error('Unexpected response structure:', data);
        }
      },
      (error) => {
        console.error('Error fetching company members:', error);
      }
    );
  }
  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      response => this.userGroups = response.userGroup,
      error => console.error('Error fetching userGroups', error)
    );
  }
  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data: any) => {
        this.userGroups = data.userGroup;
        console.log('usergroups:', this.userGroups);
      },
      error => {
        console.error('Error fetching usergroups:', error);
      }
    );
  }
  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      response => this.partners = response.partners,
      error => console.error('Error fetching partners', error)
    );
  }
  loadPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data: any) => {
        this.partners = data.partner;
        console.log('partners:', this.partners);
      },
      error => {
        console.error('Error fetching partners:', error);
      }
    );
  }
  onSubmit() {
    if (this.taxForm.invalid) {
      this.taxForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
  
    // Clear previous messages
    this.errorMessage = null;
  
    const taxData = this.taxForm.value;
    console.log('Submitting taxData:', taxData);
  
    // Call updateTax API
    this.taxService.updateTax(this.taxId, taxData).subscribe({
      next: (response) => {
        if (response) {
          console.log('Tax updated successfully:', response);
          this.router.navigate(['/rates/taxes']);
        } else {
          console.error('Failed to update tax:', response);
          this.errorMessage = 'Failed to update tax. Please try again.';
        }
      },
      error: (error) => {
        console.error('Error updating tax:', error);
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
  }
  getTaxById(id: number): void {
    this.taxService.getTax(id).subscribe({
      next: (response) => {
        console.log('ID:', id);
        console.log('API response:', response);
        const tax = response.tax;

        // Ensure the response data matches the form structure
        this.taxForm.patchValue({
          taxName: tax.tax_name,
          percentage: tax.percentage,
          companyId: tax.company_id,
          idNo: tax.taxIdentificationNumber,
          userGrId: tax.usergr_id,
          userId: tax.user_id,
          partnerId: tax.partner_id,
        });

      },
      error: (error) => {
        console.error('Error fetching charger details:', error);
      }
    });
  }
}
