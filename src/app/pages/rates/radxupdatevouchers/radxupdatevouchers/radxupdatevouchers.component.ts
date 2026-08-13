import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { VoucherService } from 'src/app/services/voucherService/voucher.service';

@Component({
  selector: 'app-radxupdatevouchers',
  templateUrl: './radxupdatevouchers.component.html',
  styles: [
  ]
})
export class RadxupdatevouchersComponent implements OnInit {

  voucherForm: FormGroup;
  voucherId: number;
  companies = [];
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
    private voucherService: VoucherService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.voucherForm = this.fb.group({
      // voucherName: ['', Validators.required],
      // voucherDescription: ['', Validators.required],
      amount: ['', Validators.required],
      companyId: [null, Validators.required],
      // userId: [null, Validators.required],
      date: [null, Validators.required],
      serial_no: ['', Validators.required],
      block_no: ['', Validators.required],
      is_distributor_card: [false],
      distributor_name: ['']
    });
  }

  ngOnInit(): void {
    this.voucherId = this.route.snapshot.params['id'];
    this.getVoucherById(this.voucherId);

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
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.loadCompanies();
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
            break;
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
    // console.log('this.voucherId:',this.voucherId);
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

  onSubmit() {
    this.errorMessage = null;
  
    if (this.voucherForm.invalid) {
      this.errorMessage = 'Please correct the errors before submitting.';
      this.voucherForm.markAllAsTouched();
      return;
    }
  
    const voucherData = this.voucherForm.value;
    console.log('Submitting voucherData:', voucherData);
  
    this.voucherService.updateVoucher(this.voucherId, voucherData).subscribe({
      next: (response) => {
        if (response) {
          console.log('Voucher updated successfully:', response);
          setTimeout(() => {
            this.router.navigate(['/rates/vouchers']);
          }, 1000);
        } else {
          console.error('Failed to update voucher:', response);
          this.errorMessage = 'Failed to update the voucher. Please try again.';
        }
      },
      error: (error) => {
        console.error('Error updating voucher:', error);
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

  getVoucherById(id: number): void {
    this.voucherService.getVoucher(id).subscribe({
      next: (response) => {
        console.log('ID:', id);
        console.log('API response:', response);
        const voucher = response.voucher;

        // Ensure the response data matches the form structure
        this.voucherForm.patchValue({
          // voucherName: voucher.voucher_name,
          // voucherDescription: voucher.voucher_description,
          amount: voucher.balance,
          companyId: voucher.company_id,
          // userId: voucher.user_id,
          date: voucher.expiry_date,
          serial_no: voucher.serial_no,
          block_no: voucher.block_no,
          is_distributor_card: !!voucher.is_distributor_card,
          distributor_name: voucher.distributor_name || ''
        });

      },
      error: (error) => {
        console.error('Error fetching voucher details:', error);
      }
    });
  }

  formatDate(date: string | null): string {
    if (!date) return ''; // Return empty string if date is null
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
