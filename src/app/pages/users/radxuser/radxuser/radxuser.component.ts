import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/userService/user.service'
import { UserGroupMembersService } from '../../../../services/userGroupMembersService/user-group-members.service'
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { PartnerMemberService } from "../../../../services/partner-member.service";

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-radxuser',
  templateUrl: './radxuser.component.html',
  styles: [
  ]
})
export class RadxuserComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [
  ];
  SelectionType = SelectionType;
  selectedCompany: string = '';
  selectedRole: string = '';
  selectedPartner: string = '';
  selectedUserGroup: string = '';
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
  usergroup_id: any;
  isRadXRole: boolean = false;
  isUserRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  currentMonthCountEntry: number = 0;
  companyId: number | null = null;  // Store company_id properly
  partnerId: number | null = null;
  userGroupId: number | null = null;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  companies: any[] = [];
  partners: any[] = [];
  userGroups: any[] = [];
  users: any[] = [];
  selectedRegisteredFrom: string[] = [];
  selectedAllowPayAsYouGo: string | null = null;
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
    private userService: UserService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private userGroupService: UserGroupService,
    private companyMemberService: CompanyMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private partnerMemberService: PartnerMemberService,

    private router: Router
  ) {
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
  // filterTable($event) {
  //   let val = $event.target.value;
  //   this.temp = this.rows.filter(function(d) {
  //     for (var key in d) {
  //       if (d[key].toLowerCase().indexOf(val) !== -1) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  // }
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
      // this.router.navigate([`/users/user/${this.activeRow.id}`]);  // Navigate to company details page
      const path = `/users/user/${this.activeRow.id}`;
      // console.log('Navigating to:', path);
      this.router.navigate([path]).catch(err => console.error('Navigation error:', err));

    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const userGroup_id = parsedCugpCred.usergr_id;
      this.company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXRole = true;
            this.getUsers();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.getUsers();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getCompanyMembers(company_id);
            this.getUsersByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getCompanyMembers(company_id);
            this.getUsersByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            this.getUserGroupMembers(userGroup_id);
            this.loadUsersByUserGroup(this.usergroup_id);

            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getPartnerMembers(partner_id);
            break;
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

    // this.getUsers()
  }

  fetchCurrentMonthCount() {
    this.userService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        console.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  getUsers() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    if (this.selectedRole) {
      filters.role = this.selectedRole;
    }

    this.userService.getAllUsers(filters).subscribe(
      (data) => {
        this.rows = data.users;
        this.temp = [...this.rows];
        // console.log("getAllUsers this.rows", this.rows);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getCompanyMembers(company_id: number) {
    this.userService.getUserByCompany(company_id).subscribe(
      (data) => {
        this.rows = data.users;
        console.log("rows", data)
        this.temp = [...this.rows];
        // console.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getUsersByCompany() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    if (this.selectedRole) {
      filters.role = this.selectedRole;
    }

    if (this.selectedRegisteredFrom && this.selectedRegisteredFrom.length > 0) {
      filters.registered_from = this.selectedRegisteredFrom;  // expect an array of strings
    }

    if (this.selectedAllowPayAsYouGo !== null && this.selectedAllowPayAsYouGo !== undefined) {
      filters.allow_pay_as_you_go = this.selectedAllowPayAsYouGo;  // expect 'true' or 'false' or 1/0
    }

    this.userService.getUserByCompany(this.company_id, filters).subscribe(
      (data) => {
        this.rows = data.users;
        this.temp = [...this.rows];
        // console.log("this.rows getUsersByCompany", this.rows);
        // console.log("filters", filters);

      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUsersByCompany(companyId: number) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {

        this.users = data.users;
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }

  loadUsersByUserGroup(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      async (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.userGroupMembers)) {
          this.users = await Promise.all(data.userGroupMembers.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user; // Extract the user data
              // Combine the userGroupMember data with the user data
              return {
                ...member,
                user: user // Attach the user data
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // Return member without user details in case of error
            }
          }));
          // console.log('Loaded users:', this.users);
        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching user group members:', error);
      }
    );
  }

  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data.partners;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data) => {
        this.userGroups = data.userGroup;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data.users;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        this.partners = data.partner;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data) => {
        this.userGroups = data.userGroup;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }


  getUserGroupMembers(usergr_id: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(usergr_id).subscribe(
      (response: any) => {
        if (response && response.success && Array.isArray(response.userGroupMembers)) {
          this.rows = [];
          response.userGroupMembers.forEach(member => {
            this.userService.getUserById(member.user_id).subscribe(
              (userData) => {
                // console.log(userData.user);
                this.rows.push(userData.user);
                this.temp = [...this.rows];
                // console.log(this.temp);
              },
              (error) => {
                console.error(`Error fetching user with ID ${member.user_id}:`, error);
              }
            );
          });
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getPartnerMembers(partnerId: number) {
    // console.log("partnerId", partnerId)
    // console.log("selectedpartner", this.selectedPartner)

    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
      (response: any) => {
        // console.log(response);
        if (response && response.success && Array.isArray(response.partnerMember)) {
          this.rows = [];
          response.partnerMember.forEach(member => {
            this.userService.getUserById(member.user_id).subscribe(
              (userData) => {
                // console.log(userData.user);
                this.rows.push(userData.user);
                this.temp = [...this.rows];
                // console.log(this.temp);
              },
              (error) => {
                console.error(`Error fetching user with ID ${member.user_id}:`, error);
              }
            );
          });
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const filteredData = this.temp.map(user => ({
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      allow_pay_as_you_go: user.allow_pay_as_you_go,
      role: user.role
    }));

    autoTable(doc, {
      head: [['Name', 'Username', 'Email', 'Phone', 'APAYG', 'Role']], // Renamed the column
      body: filteredData.map(user => [
        user.name,
        user.username,
        user.email,
        user.phone_number,
        (user.allow_pay_as_you_go === "1" || user.allow_pay_as_you_go === "true") ? 'Yes' : 'No', // Explicitly handle the values
        user.role
      ]),
      margin: { left: 5 },
      columnStyles: {
        0: { cellWidth: 30 }, // Name
        1: { cellWidth: 35 }, // Username
        2: { cellWidth: 50 }, // Email
        3: { cellWidth: 27 }, // Phone Number
        4: { cellWidth: 15 }, // APAYG
        5: { cellWidth: 45 }  // Role
      }
    });

    doc.save('users.pdf');
  }

  // Export the relevant fields to Excel
  // exportToExcel() {
  //   // Map the rows to the new format and display Yes/No for allow_pay_as_you_go
  //   const filteredData = this.temp.map(user => ({
  //     name: user.name,
  //     username: user.username,
  //     email: user.email,
  //     phone_number: user.phone_number,
  //     allow_pay_as_you_go: (user.allow_pay_as_you_go === "1" || user.allow_pay_as_you_go === "true") ? 'Yes' : 'No', // Explicitly handle the values
  //     role: user.role
  //   }));

  //   // Define the column headers
  //   const headers = ['Name', 'Username', 'Email', 'Phone Number', 'Allow Pay As You Go', 'Role'];

  //   // Add headers as the first row
  //   const dataWithHeaders = [headers, ...filteredData.map(user => [
  //     user.name,
  //     user.username,
  //     user.email,
  //     user.phone_number,
  //     user.allow_pay_as_you_go,
  //     user.role
  //   ])];

  //   // Create a worksheet with the data and headers
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);

  //   // Create the workbook
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'Users': worksheet },
  //     SheetNames: ['Users']
  //   };

  //   // Write the Excel buffer and save the file
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, 'users');
  // }
  exportToExcel() {
    // Helper per te shfaqur Yes/No per fusha booleane (backend mund t'i ktheje 1/"1"/true).
    const yesNo = (v: any) =>
      (v === 1 || v === '1' || v === true || v === 'true') ? 'Yes' : 'No';

    const filteredData = this.temp.map(user => ({
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      company_name: user.company_name || '',
      partner_name: user.partner_name || '',
      usergr_name: user.usergr_name || '',
      rate_name: user.rate_name || '',
      balance: user.balance != null ? user.balance : '',
      debit_balance: user.debit_balance != null ? user.debit_balance : '',
      registered_from: user.registered_from || '',
      isEmailVerified: yesNo(user.isEmailVerified),
      isPhoneVerified: yesNo(user.isPhoneVerified),
      referral_code: user.referral_code || '',
      send_invoice_by_email: yesNo(user.send_invoice_by_email),
      allow_pay_as_you_go: yesNo(user.allow_pay_as_you_go),
      allow_money_transfert: yesNo(user.allow_money_transfert),
      customer_number: user.customer_number || '',
      dimension_value: user.dimension_value || ''
    }));

    // Define the column headers
    const headers = [
      'Name',
      'Username',
      'Email',
      'Phone Number',
      'Role',
      'Company',
      'Partner',
      'User Group',
      'Rate',
      'Balance',
      'Debit Balance',
      'Registered From',
      'Email Verified',
      'Phone Verified',
      'Referral Code',
      'Send Invoice By Email',
      'Allow Pay As You Go',
      'Allow Money Transfer',
      'Customer Number',
      'Dimension KLIENT/FURNITOR'
    ];

    // Add headers as the first row
    const dataWithHeaders = [
      headers,
      ...filteredData.map(user => [
        user.name,
        user.username,
        user.email,
        user.phone_number,
        user.role,
        user.company_name,
        user.partner_name,
        user.usergr_name,
        user.rate_name,
        user.balance,
        user.debit_balance,
        user.registered_from,
        user.isEmailVerified,
        user.isPhoneVerified,
        user.referral_code,
        user.send_invoice_by_email,
        user.allow_pay_as_you_go,
        user.allow_money_transfert,
        user.customer_number,
        user.dimension_value
      ])
    ];

    // Create a worksheet with the data and headers
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);

    // Create the workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Users': worksheet },
      SheetNames: ['Users']
    };

    // Write the Excel buffer and save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'users');
  }


  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';