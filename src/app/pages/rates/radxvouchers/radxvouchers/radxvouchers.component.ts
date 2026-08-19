import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VoucherService } from "../../../../services/voucherService/voucher.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { UserService } from '../../../../services/userService/user.service';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-radxvouchers',
  templateUrl: './radxvouchers.component.html',
  styles: [
  ]
})
export class RadxvouchersComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  // Variables for filters
  companies: any[] = [];
  users: any[] = [];

  selectedCompany: string = '';
  selectedUser: string = '';

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
  company_id: any;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  currentMonthCountEntry: number = 0;
  @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.isSmallScreen = event.target.innerWidth < 768;
  //   // Hide input when switching to small screen
  //   if (this.isSmallScreen) {
  //     this.isInputVisible = false;
  //   }
  // }
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  toggleSearchInput() {
    this.isInputVisible = !this.isInputVisible; // Toggle input visibility on icon click
  }
  constructor(
    private voucherService: VoucherService,
    private companyService: CompanyService,
    private companyMemberService: CompanyMemberService,
    private userService: UserService,
    private router: Router) {
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      // If the search input is cleared, reset temp to original rows
      this.temp = [...this.rows];
      return;
    }

    this.temp = this.rows.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // this.activeRow = event.row;
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/rates/vouchers/${this.activeRow.card_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getVouchers();
            this.loadAllCompanies();
            this.loadAllUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getVouchers();
            this.loadAllCompanies();
            this.loadAllUsers();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;   // 🆕 set per badge/columns te shohin specifikisht admin-in
            this.isCompanyRole = true;
            this.getVouchersByCompany();
            this.loadCompanyMembers(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.isCompanyRole = true;
            this.getVouchersByCompany();
            this.loadCompanyMembers(this.company_id);
            break;
            case 'COMPANY_ANALYST':
              this.isCompanyAnalyst = true;
              this.getVouchersByCompany();
              this.loadCompanyMembers(this.company_id);
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
          case 'SUPER_USER':
          case 'USER':
          case 'COMPANY_USER':
            this.getVouchersByCurrentUser();
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
    // this.getVouchers()
  }

  fetchCurrentMonthCount() {
    this.voucherService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  // Load companies for dropdown
  loadAllCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // Load users for dropdown
  loadAllUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data.users;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // Load users for dropdown
  loadCompanyMembers(companyId: number) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        // console.log(data);

        // // Ensure that data contains the company_member array
        // if (data && Array.isArray(data.company_member)) {
        //   // Reset the users array
        //   this.users = [];

        //   // Iterate over company_member array and push the `User` objects to the `users` array
        //   data.company_member.forEach((member) => {
        //     if (member.User) {
        //       this.users.push(member.User);  // Add the `User` object to `users` array
        //     }
        //   });

        //   console.log('Extracted Users:', this.users);
        // } else {
        //   console.error('Unexpected response structure:', data);
        // }
        this.users = data.users;
      },
      (error) => {
        logger.error('Error fetching company members:', error);
      }
    );
  }

  getVouchers() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    this.voucherService.getAllVouchers(filters).subscribe(
      (data) => {
        this.rows = data.vouchers;
        this.temp = [...this.rows];
        logger.log(this.rows);

        // this.rows.forEach((row, index) => {
        //   this.companyService.getCompany(row.company_id).subscribe(
        //     (companyData) => {
        //       this.rows[index].company = companyData.company.company_name;
        //       this.temp = [...this.rows];  // Update temp to reflect changes
        //     },
        //     (error) => {
        //       this.errorMessage = error.message;
        //       console.log(error);
        //     }
        //   );
        //   this.userService.getUserById(row.user_id).subscribe(
        //     (userData) => {
        //       this.rows[index].user = userData.user.name;  // Add user details to the row
        //       this.temp = [...this.rows];  // Update temp to reflect changes
        //     },
        //     (error) => {
        //       this.errorMessage = error.message;
        //       console.log(error);
        //     }
        //   );
        // });
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getVouchersByCompany() {
    const filters: any = {};

    // Add selected filter values if present
    // if (this.selectedCompany) {
    //   filters.company_id = this.selectedCompany;
    // }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    this.voucherService.getVoucherCompany(this.company_id, filters).subscribe(
      (data) => {
        this.rows = data.voucher;
        this.temp = [...this.rows];
        logger.log(this.rows);

        // this.rows.forEach((row, index) => {
        //   this.companyService.getCompany(row.company_id).subscribe(
        //     (companyData) => {
        //       this.rows[index].company = companyData.company.company_name;
        //       this.temp = [...this.rows];  // Update temp to reflect changes
        //     },
        //     (error) => {
        //       this.errorMessage = error.message;
        //       console.log(error);
        //     }
        //   );
        //   this.userService.getUserById(row.user_id).subscribe(
        //     (userData) => {
        //       this.rows[index].user = userData.user.name;  // Add user details to the row
        //       this.temp = [...this.rows];  // Update temp to reflect changes
        //     },
        //     (error) => {
        //       this.errorMessage = error.message;
        //       console.log(error);
        //     }
        //   );
        // });
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getVouchersByCurrentUser() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    this.voucherService.getVoucherByCurrentUser(filters).subscribe(
      (data) => {
        this.rows = data.voucher;
        this.temp = [...this.rows];
        logger.log(this.rows);

        // this.rows.forEach((row, index) => {
        //   this.companyService.getCompany(row.company_id).subscribe(
        //     (companyData) => {
        //       this.rows[index].company = companyData.company.company_name;
        //       this.temp = [...this.rows];  // Update temp to reflect changes
        //     },
        //     (error) => {
        //       this.errorMessage = error.message;
        //       console.log(error);
        //     }
        //   );
        //   this.userService.getUserById(row.user_id).subscribe(
        //     (userData) => {
        //       this.rows[index].user = userData.user.name;  // Add user details to the row
        //       this.temp = [...this.rows];  // Update temp to reflect changes
        //     },
        //     (error) => {
        //       this.errorMessage = error.message;
        //       console.log(error);
        //     }
        //   );
        // });
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }

  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const tableData = this.temp.map(voucher => [
      // voucher.voucher_name,
      voucher?.serial_no || 'N/A',
      voucher?.block_no || 'N/A',
      voucher?.balance || 'N/A',
      voucher?.status || 'N/A',
      voucher?.expiry_date || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Serial No', 'Block No', 'Balance', 'Status', 'Expire Date']],
      body: tableData
    });

    doc.save('vouchers.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    const filteredData = this.temp.map(voucher => ({
      // voucher_name: voucher.voucher_name,
      serial_no: voucher.serial_no,
      block_no: voucher.block_no,
      amount: Number(voucher.balance),
      Status: voucher.status,
      expire_date: voucher.expiry_date
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Vouchers': worksheet },
      SheetNames: ['Vouchers']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'vouchers');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';