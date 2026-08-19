import { logger } from '@core/logger';
import { Component, OnInit, ViewChild } from '@angular/core';
import { VoucherService } from "../../../../services/voucherService/voucher.service";
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserService } from 'src/app/services/userService/user.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-radxcreatevouchers',
  templateUrl: './radxcreatevouchers.component.html',
  styles: []
})
export class RadxcreatevouchersComponent implements OnInit {
  @ViewChild('voucherForm') voucherForm!: NgForm;
  voucher = {
    voucherName: '',
    voucherDescription: '',
    amount: null,
    // percentage: null,
    serial_no: '',
    block_no: '',
    companyId: null,
    userId: null,
    date: '',
    is_distributor_card: false,
    distributor_name: ''
  };
  company: any;
  companies = [];
  users = [];
  minDate: string;
  useAmount: boolean = true;
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
    private voucherService: VoucherService,
    private companyService: CompanyService,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private router: Router) { }

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero to month if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero to day if necessary
    // Set minDate to today’s date in 'YYYY-MM-DD' format
    this.minDate = `${year}-${month}-${day}`;

    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.getCompanies();
            this.getUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.getCompanies();
            this.getUsers();
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
            this.getCompaniesByCompany(company_id);
            this.getUsersByCompany(company_id);
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
    // this.getCompanies();
  }

  getCompanies() {
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

  getUsers() {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        logger.log('users:', data);
        this.users = data.users;
        logger.log('users:', this.users);
      },
      error => {
        logger.error('Error fetching companies:', error);
      }
    );
  }
  getCompaniesByCompany(companyId: number) {
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
  onSubmit() {
    this.errorMessage = null;
    this.voucher.companyId = this.company.company_id;


    this.markFormGroupTouched(this.voucherForm);

    if (this.voucherForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.voucherService.addVoucher(this.voucher).subscribe({
      next: (response) => {
        logger.log('Voucher created successfully:', response);
        setTimeout(() => {
          this.router.navigate(['/rates/vouchers']);
        }, 1000);
      },
      error: (error) => {
        logger.error('Error creating voucher:', error);
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
      return 'Voucher not found.';
    } else if (error.status === 409) {
      return 'A voucher with this information already exists.';
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
