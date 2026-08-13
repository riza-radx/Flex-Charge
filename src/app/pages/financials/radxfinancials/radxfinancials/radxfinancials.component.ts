// import { Component, HostListener, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ReportService } from "../../../../services/reportService/report.service";
// import { CompanyService } from "../../../../services/companyService/company.service";
// import { PartnerService } from "../../../../services/partnerService/partner.service";
// import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
// import { UserService } from "../../../../services/userService/user.service";
// import { PartnerMemberService } from "../../../../services/partner-member.service";
// import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
// import { UserGroupMembersService } from "../../../../services/userGroupMembersService/user-group-members.service";

// import { TabsetComponent } from 'ngx-bootstrap/tabs';
// import { forkJoin, map } from 'rxjs';
// export enum SelectionType {
//   single = "single",
//   multi = "multi",
//   multiClick = "multiClick",
//   cell = "cell",
//   checkbox = "checkbox"
// }

// @Component({
//   selector: 'app-radxfinancials',
//   templateUrl: './radxfinancials.component.html',
//   styles: [
//   ]
// })
// export class RadxfinancialsComponent {
//   entries: number = 10;
//   selected: any[] = [];
//   tempReports = [];
//   activeRow: any;
//   errorMessage: any;
//   reports: any = [];
//   SelectionType = SelectionType;
//   // userGroup: any;
//   // userGroupId: string;
//   userGroupMembers: any[] = [];
//   // chargingHistory: any[] = [];
//   // rfidCard: any[] = [];
//   // vehicle: any[] = [];
//   // errorMessage: any;
//   id: string;

//   companies: any[] = [];
//   partners: any[] = [];
//   userGroups: any[] = [];
//   users: any[] = [];
//   selectedCompany: string = '';
//   selectedPartner: string = '';
//   selectedUserGroup: string = '';
//   selectedUser: string = '';

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

//   isRadXRole: boolean = false;
//   isCompanyRole: boolean = false;
//   isPartnerRole: boolean = false;
//   isUserGroupRole: boolean = false;
//   isUserRole: boolean = false;

//   isAble: boolean = false;
//   company_id: any;
//   partner_id: any;
//   usergroup_id: any;
//   user_id: any;
//   isSmallScreen: boolean = window.innerWidth < 768;
//   isInputVisible: boolean = false;
//   currentMonthCountEntry: number = 0;
//   @HostListener('window:resize', ['$event'])
//   onResize(event) {
//     this.isSmallScreen = event.target.innerWidth < 768;
//     // Hide input when switching to small screen
//     if (this.isSmallScreen) {
//       this.isInputVisible = false;
//     }
//   }
//   constructor(
//     private reportService: ReportService,
//     private companyService: CompanyService,
//     private partnerService: PartnerService,
//     private userGroupService: UserGroupService,
//     private userService: UserService,
//     private usergroupService: UserGroupService,
//     private companyMemberService: CompanyMemberService,
//     private partnerMemberService: PartnerMemberService,
//     private userGroupMembersService: UserGroupMembersService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) { }

//   ngOnInit() {
//     this.userRole = localStorage.getItem('userRole');
//     console.log('User Role:', this.userRole);

//     const cugpCred = localStorage.getItem('cugpCred');
//     if (cugpCred) {
//       const parsedCugpCred = JSON.parse(cugpCred);
//       // const company_id = parsedCugpCred.company_id;
//       this.company_id = parsedCugpCred.company_id;
//       this.partner_id = parsedCugpCred.partner_id;
//       this.usergroup_id = parsedCugpCred.usergr_id;
//       this.user_id = parsedCugpCred.id;

//       if (this.userRole) {
//         switch (this.userRole) {
//           case 'RadX_Admin':
//             this.isRadXAdmin = true;
//             this.isRadXRole = true;
//             this.isAble = true;
//             this.getVReports();
//             this.loadCompanies();
//             this.loadPartners();
//             this.loadUserGroups();
//             this.loadUsers();
//             break;
//           case 'RADX_MODERATOR':
//             this.isRadXModerator = true;
//             this.isRadXRole = true;
//             this.isAble = true;
//             this.getVReports();
//             this.loadCompanies();
//             this.loadPartners();
//             this.loadUserGroups();
//             this.loadUsers();
//             break;
//           case 'COMPANY_ADMIN':
//           case 'COMPANY_OPERATOR':
//           case 'COMPANY_MODERATOR':
//           case 'COMPANY_TECHNICAL_OPERATOR':
//           case 'COMPANY_MAINTENANCE_SPECIALIST':
//           case 'COMPANY_CALL_CENTER':
//           case 'COMPANY_ANALYST':
//             // case 'USER':
// case 'COMPANY_USER':
//             // case 'SUPER_USER':
//             this.isAble = true;
//             this.isCompanyRole = true;
//             this.getVReportsByCompany();
//             this.loadPartnersByCompany(this.company_id);
//             this.loadUserGroupsByCompany(this.company_id);
//             this.loadUsersByCompany(this.company_id);
//             // this.getCurrencies(company_id);
//             break;
//           case 'USER_GROUP_ADMIN':
//           case 'USER_GROUP_MODERATOR':
//           case 'USER_GROUP_USER':
//             this.isAble = true;
//             this.isUserGroupRole = true;
//             this.getVReportsByUserGroup();
//             this.loadUsersByUserGroups(this.usergroup_id);
//             break;
//           case 'PARTNER_ADMIN':
//           case 'PARTNER_MODERATOR':
//             this.isAble = true;
//             this.isPartnerRole = true;
//             this.getVReportsByPartner();
//             this.loadUsersByPartner(this.partner_id);
//             break;
//           case 'USER':
// case 'COMPANY_USER':
//           case 'SUPER_USER':
//             this.isAble = true;
//             this.isUserRole = true;
//             this.getVReportsByUser();
//             // this.getCurrencies(company_id);
//             break;
//           default:
//             console.error('Unknown user role:', this.userRole);
//             this.router.navigate(['/login']); // Redirect to login or error page
//         }
//       } else {
//         console.error('User role is not defined.');
//         this.router.navigate(['/login']); // Redirect to login or error page
//       }
//     } else {
//       console.error('No cugpCred found in localStorage');
//       this.router.navigate(['/login']); // Redirect to login or error page
//     }
//   }

//   entriesChange($event) {
//     this.entries = $event.target.value;
//   }

//   onCompanyChange() {
//     if (this.selectedCompany) {
//       // Load partners based on the selected company
//       this.loadPartnersByCompany(+this.selectedCompany);
//     } else {
//       // If no company is selected, reset the partners list
//       this.partners = [];
//     }
//   }

//   filterTable($event: any) {
//     const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

//     if (!val) {
//       // If the search input is cleared, reset temp to original rows
//       this.tempReports = [...this.reports];
//       return;
//     }

//     this.tempReports = this.reports.filter((d) => {
//       // Check if any property in the object matches the search value
//       return Object.keys(d).some(key => {
//         if (typeof d[key] === 'string') {
//           return d[key].toLowerCase().includes(val); // Check if the property contains the search value
//         }
//         return false; // Ignore non-string properties
//       });
//     });
//   }

//   onSelect({ selected }) {
//     this.selected.splice(0, this.selected.length);
//     this.selected.push(...selected);
//   }

//   onActivate(event) {
//     this.activeRow = event.row;
//     if (event.type === 'click') {
//       this.router.navigate([`/reports/financial/${this.activeRow.reports_id}`]);
//     }
//   }

//   loadCompanies() {
//     this.companyService.getAllCompanies().subscribe(
//       (data) => {
//         this.companies = data.company;
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }

//   loadPartners() {
//     this.partnerService.getAllPartners().subscribe(
//       (data) => {
//         this.partners = data.partners;
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }
//   loadPartnersByCompany(companyId: number) {
//     this.partnerService.getPartnerByCompany(companyId).subscribe(
//       (data) => {
//         this.partners = data.partner;
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }

//   loadUserGroups() {
//     this.userGroupService.getAllUserGroups().subscribe(
//       (data) => {
//         this.userGroups = data.userGroup;
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }
//   loadUserGroupsByCompany(companyId: number) {
//     this.userGroupService.getUserGroupByCompany(companyId).subscribe(
//       (data) => {
//         this.userGroups = data.userGroup;
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }

//   loadUsers() {
//     this.userService.getAllUsers().subscribe(
//       (data) => {
//         this.users = data.users;
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }
//   loadUsersByCompany(companyId: number) {
//     this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
//       async (data: any) => {
//         if (data && Array.isArray(data.company_member)) {
//           // Map through company members and fetch user details for each member
//           this.users = await Promise.all(data.company_member.map(async (member: any) => {
//             try {
//               // const userResponse = member.User;
//               const user = member.User; // Extract user details from the response

//               // Combine member and user data
//               return {
//                 ...member,
//                 user: user // Include user details in the member object
//               };
//             } catch (error) {
//               console.error('Error fetching user for member:', member, error);
//               return { ...member, user: null }; // In case of error, return member without user details
//             }
//           }));
//         } else {
//           console.error('Expected an array but got:', data);
//           this.users = [];
//         }

//         console.log(this.users); // Check the final combined data structure
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.error('Error fetching company members:', error);
//       }
//     );
//   }
//   loadUsersByUserGroups(userGroupId: number) {
//     this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
//       async (data: any) => {
//         if (data && Array.isArray(data.userGroupMembers)) {
//           // Map through company members and fetch user details for each member
//           this.users = await Promise.all(data.userGroupMembers.map(async (member: any) => {
//             try {
//               const userResponse = await this.userService.getUserById(member.user_id).toPromise();
//               const user = userResponse.user; // Extract user details from the response

//               // Combine member and user data
//               return {
//                 ...member,
//                 user: user.name // Include user details in the member object
//               };
//             } catch (error) {
//               console.error('Error fetching user for member:', member, error);
//               return { ...member, user: null }; // In case of error, return member without user details
//             }
//           }));
//         } else {
//           console.error('Expected an array but got:', data);
//           this.users = [];
//         }

//         console.log(this.users); // Check the final combined data structure
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.error('Error fetching company members:', error);
//       }
//     );
//   }
//   loadUsersByPartner(partnerId: number) {
//     this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
//       async (data: any) => {
//         if (data && Array.isArray(data.partnerMember)) {
//           // Map through company members and fetch user details for each member
//           this.users = await Promise.all(data.partnerMember.map(async (member: any) => {
//             try {
//               const userResponse = await this.userService.getUserById(member.user_id).toPromise();
//               const user = userResponse.user; // Extract user details from the response

//               // Combine member and user data
//               return {
//                 ...member,
//                 user: user.name // Include user details in the member object
//               };
//             } catch (error) {
//               console.error('Error fetching user for member:', member, error);
//               return { ...member, user: null }; // In case of error, return member without user details
//             }
//           }));
//         } else {
//           console.error('Expected an array but got:', data);
//           this.users = [];
//         }

//         console.log(this.users); // Check the final combined data structure
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.error('Error fetching company members:', error);
//       }
//     );
//   }

//   getVReports() {
//     const filters: any = {};

//     // Add selected filter values if present
//     if (this.selectedCompany) {
//       filters.company_id = this.selectedCompany;
//     }
//     if (this.selectedPartner) {
//       filters.partner_id = this.selectedPartner;
//     }
//     if (this.selectedUserGroup) {
//       filters.usergr_id = this.selectedUserGroup;
//     }
//     if (this.selectedUser) {
//       filters.user_id = this.selectedUser;
//     }

//     this.reportService.getAllReports(filters).subscribe(
//       (data: any) => {
//         console.log(data);
//         if (data && Array.isArray(data.reports)) {
//           this.reports = data.reports;

//           // Use forkJoin to fetch additional details for each report
//           forkJoin(
//             this.reports.map((report, index) => {
//               return forkJoin({
//                 company: this.companyService.getCompany(report.company_id),
//                 user: this.userService.getUserById(report.user_id),
//                 userGroup: this.usergroupService.getUserGroup(report.usergr_id),
//                 partner: this.partnerService.getPartner(report.partner_id)
//               }).pipe(
//                 // Map the response to include company, user, user group, and partner details
//                 map(({ company, user, userGroup, partner }) => {
//                   this.reports[index].company = company?.company?.company_name || '';
//                   this.reports[index].user = user?.user?.username || '';
//                   this.reports[index].userGroup = userGroup?.userGroup?.usergr_name || '';
//                   this.reports[index].partner = partner?.partner?.partner_name || '';
//                 })
//               );
//             })
//           ).subscribe(
//             () => {
//               // Update tempReports with the modified reports data
//               this.tempReports = [...this.reports];
//             },
//             (error) => {
//               this.errorMessage = error.message;
//               console.log('Error fetching additional details:', error);
//             }
//           );
//         } else {
//           console.error('Expected an array but got:', data);
//           this.reports = [];
//           this.tempReports = [];
//         }
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }

//   getVReportsByCompany() {
//     const filters: any = {};

//     // Add selected filter values if present
//     if (this.selectedCompany) {
//       filters.company_id = this.selectedCompany;
//     }
//     if (this.selectedPartner) {
//       filters.partner_id = this.selectedPartner;
//     }
//     if (this.selectedUserGroup) {
//       filters.usergr_id = this.selectedUserGroup;
//     }
//     if (this.selectedUser) {
//       filters.user_id = this.selectedUser;
//     }
//     this.reportService.getAllReportByCompany(this.company_id, filters).subscribe(
//       (data: any) => {
//         console.log(data);
//         if (data && Array.isArray(data.reports)) {
//           // If data.reports is an array
//           this.reports = data.reports;
//         } else {
//           console.error('Expected an array but got:', data);
//           this.reports = []; // Set to an empty array if data is not valid
//         }
//         this.tempReports = [...this.reports];
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }

//   getVReportsByPartner() {
//     const filters: any = {};

//     // Add selected filter values if present
//     if (this.selectedCompany) {
//       filters.company_id = this.selectedCompany;
//     }
//     if (this.selectedPartner) {
//       filters.partner_id = this.selectedPartner;
//     }
//     if (this.selectedUserGroup) {
//       filters.usergr_id = this.selectedUserGroup;
//     }
//     if (this.selectedUser) {
//       filters.user_id = this.selectedUser;
//     }
//     this.reportService.getAllReportByPartner(this.partner_id, filters).subscribe(
//       (data: any) => {
//         console.log(data);
//         if (data && Array.isArray(data.reports)) {
//           // If data.reports is an array
//           this.reports = data.reports;
//         } else {
//           console.error('Expected an array but got:', data);
//           this.reports = []; // Set to an empty array if data is not valid
//         }
//         this.tempReports = [...this.reports];
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }
//   getVReportsByUserGroup() {
//     const filters: any = {};

//     // Add selected filter values if present
//     if (this.selectedCompany) {
//       filters.company_id = this.selectedCompany;
//     }
//     if (this.selectedPartner) {
//       filters.partner_id = this.selectedPartner;
//     }
//     if (this.selectedUserGroup) {
//       filters.usergr_id = this.selectedUserGroup;
//     }
//     if (this.selectedUser) {
//       filters.user_id = this.selectedUser;
//     }
//     this.reportService.getAllReportByUserGroup(this.usergroup_id, filters).subscribe(
//       (data: any) => {
//         console.log(data);
//         if (data && Array.isArray(data.reports)) {
//           // If data.reports is an array
//           this.reports = data.reports;
//         } else {
//           console.error('Expected an array but got:', data);
//           this.reports = []; // Set to an empty array if data is not valid
//         }
//         this.tempReports = [...this.reports];
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }
//   getVReportsByUser() {
//     const filters: any = {};

//     // Add selected filter values if present
//     if (this.selectedCompany) {
//       filters.company_id = this.selectedCompany;
//     }
//     if (this.selectedPartner) {
//       filters.partner_id = this.selectedPartner;
//     }
//     if (this.selectedUserGroup) {
//       filters.usergr_id = this.selectedUserGroup;
//     }
//     if (this.selectedUser) {
//       filters.user_id = this.selectedUser;
//     }
//     this.reportService.getAllReportByUser(this.user_id, filters).subscribe(
//       (data: any) => {
//         console.log(data);
//         if (data && Array.isArray(data.reports)) {
//           // If data.reports is an array
//           this.reports = data.reports;
//         } else {
//           console.error('Expected an array but got:', data);
//           this.reports = []; // Set to an empty array if data is not valid
//         }
//         this.tempReports = [...this.reports];
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.log(error);
//       }
//     );
//   }


// }


import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from "../../../../services/reportService/report.service";
import { CompanyService } from "../../../../services/companyService/company.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { UserService } from "../../../../services/userService/user.service";
import { PartnerMemberService } from "../../../../services/partner-member.service";
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { UserGroupMembersService } from "../../../../services/userGroupMembersService/user-group-members.service";
// 🆕 Per te marre rechargers per Company Report Excel (sheet i katert).
import { RechargeService } from "../../../../services/rechargeService/recharge.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AuthService } from 'src/app/services/authService/auth.service';
// 🆕 Per te ndertuar Excel-in ne front dhe per confirm modal
import * as XLSX from 'xlsx';
// 🆕 Helper i perbashket per 3-sheet Company Report workbook.
import { buildCompanyReportBuffer } from 'src/app/utils/companyReportExcel';
// 🆕 Helper per User Group Report — multi-sheet me fature + detail + per-card sheets.
import { buildUserGroupReportBuffer } from 'src/app/utils/userGroupReportExcel';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-radxfinancials',
  templateUrl: './radxfinancials.component.html',
  // 🆕 Custom styles — perdorim ::ng-deep sepse tooltip-i ngx-bootstrap renderohet ne body
  // me container="body", dhe stilet e scoped-uara nuk aplikohen dot.
  styles: [`
    ::ng-deep .report-tooltip-lg .tooltip-inner {
      font-size: 14px !important;
      max-width: 360px !important;
      padding: 10px 14px !important;
      line-height: 1.5 !important;
      text-align: left !important;
      background-color: #2c3e50 !important;
    }
    ::ng-deep .report-tooltip-lg .tooltip-arrow,
    ::ng-deep .report-tooltip-lg .arrow::before {
      border-left-color: #2c3e50 !important;
      border-right-color: #2c3e50 !important;
      border-top-color: #2c3e50 !important;
      border-bottom-color: #2c3e50 !important;
    }
  `]
})
export class RadxfinancialsComponent {
  entries: number = 10;
  selected: any[] = [];
  tempReports = [];
  activeRow: any;
  errorMessage: any;
  reports: any = [];
  SelectionType = SelectionType;
  // userGroup: any;
  // userGroupId: string;
  userGroupMembers: any[] = [];
  // chargingHistory: any[] = [];
  // rfidCard: any[] = [];
  // vehicle: any[] = [];
  // errorMessage: any;
  id: string;

  companies: any[] = [];
  partners: any[] = [];
  userGroups: any[] = [];
  users: any[] = [];
  selectedCompany: string = '';
  selectedPartner: string = '';
  selectedUserGroup: string = '';
  selectedUser: string = '';
  selectedReportType: string[] = [];
  totalEnergyMin: number | null = null;
  totalEnergyMax: number | null = null;
  totalCostMin: number | null = null;
  totalCostMax: number | null = null;
  startDate: Date | null = null;  // Or Date if you're using Date objects
  endDate: Date | null = null;

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
  isCompanyUser: boolean = false;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;

  isAble: boolean = false;
  company_id: any;
  partner_id: any;
  usergroup_id: any;
  user_id: any;
  currentUserId: any;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;

  // 🆕 State per Send Report modal + toast
  showSendConfirm: boolean = false;       // Kur true, shfaqet confirm modal-i.
  reportToSend: any = null;                // Rreshti aktiv per te cilin behet konfirmimi.
  isSendingReport: boolean = false;        // Loading state per butonin ne modal.
  sendReportMessage: string = '';          // Toast text (success/error).
  sendReportMessageClass: string = '';     // 'alert-success' | 'alert-danger'
  reportTypes: string[] = ['User_Group_Report', 'Generated Company', 'Generated User Group', 'Company_Report', 'User_Report', 'Partner_Report', 'RFID_Card_Report','TIme_Split_Report']; // or whatever types you want
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
    private reportService: ReportService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private authService: AuthService,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private partnerMemberService: PartnerMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private rechargeService: RechargeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      // const company_id = parsedCugpCred.company_id;
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      console.log("this.company_id", this.company_id)
      console.log("this.partner_id", this.partner_id)
      console.log("this.usergroup_id", this.usergroup_id)
      console.log("this.user_id", this.user_id)
      // const partner_id = parsedCugpCred.partner_id;
      // const usergroup_id = parsedCugpCred.usergr_id;
      // const user_id = parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.getVReports();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.getVReports();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          // case 'COMPANY_ADMIN':
          // case 'COMPANY_OPERATOR':
          // case 'COMPANY_MODERATOR':
          // case 'COMPANY_TECHNICAL_OPERATOR':
          // case 'COMPANY_MAINTENANCE_SPECIALIST':
          // case 'COMPANY_CALL_CENTER':
          // case 'COMPANY_ANALYST':
          // case 'COMPANY_USER':
          // case 'COMPANY_SUPER_USER':
          //   this.isAble = true;
          //   this.isCompanyRole = true;
          //   this.getVReportsByCompany();
          //   this.loadPartnersByCompany(this.company_id);
          //   this.loadUserGroupsByCompany(this.company_id);
          //   this.loadUsersByCompany(this.company_id);
          //   // this.getCurrencies(company_id);
          //   break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.isAble = true;
          //   this.isUserGroupRole = true;
          //   this.getVReportsByUserGroup();
          //   this.loadUsersByUserGroups(this.usergroup_id);
          //   break;
          // case 'PARTNER_ADMIN':
          // case 'PARTNER_MODERATOR':
          //   this.isAble = true;
          //   this.isPartnerRole = true;
          //   this.getVReportsByPartner();
          //   this.loadUsersByPartner(this.partner_id);
          //   break;
          // case 'USER':
          // case 'SUPER_USER':
          //   this.isAble = true;
          //   this.isUserRole = true;
          //   this.getVReportsByUser();
          //   // this.getCurrencies(company_id);
          //   break;
          // default:
          //   console.error('Unknown user role:', this.userRole);
          //   this.router.navigate(['/login']); // Redirect to login or error page
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.loadUsersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.getVReportsByCompany();

            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyOperator = true;
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.loadUsersByCompany(this.company_id); // Load all users
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.getVReportsByCompany();

            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyModerator = true;
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.loadUsersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.getVReportsByCompany();
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyTechnicalOperator = true;
            // this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.getVReportsByUser();
            this.getCurrentUserReport();
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyMaintenanceSpecialist = true;
            // this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.getVReportsByUser();
            this.getCurrentUserReport();
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyCallCenter = true;
            // this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.getVReportsByUser();
            this.getCurrentUserReport();
            break;
          case 'COMPANY_ANALYST':

            this.isCompanyAnalyst = true;
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.loadUsersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);

            // case 'USER':
            // case 'COMPANY_USER':
            //           // case 'SUPER_USER':
            //           this.isAble = true;
            //           this.isCompanyRole = true;
            //             this.getVReportsByCompany();

            this.loadPartnersByCompany(this.company_id);
            this.getVReportsByCompany();
            break;
          case 'COMPANY_USER':
            this.isCompanyUser = true;
            // this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            this.isAble = true;
            this.getVReportsByUser();
            this.getCurrentUserReport();
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.isAble = true;
            this.getVReportsByUserGroup();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.isAble = true;
            this.getVReportsByUserGroup();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupUser = true;
            // this.isUserGroupRole = true;
            this.isAble = true;
            this.getVReportsByUser();
            this.getCurrentUserReport();
            break;
          case 'PARTNER_ADMIN':
            this.isPartnerAdmin = true;
            this.isPartnerRole = true;
            this.isAble = true;
            this.getVReportsByPartner();
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'PARTNER_MODERATOR':
            this.isPartnerModerator = true;
            this.isPartnerRole = true;
            this.isAble = true;
            this.getVReportsByPartner();
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'USER':

            this.isUser = true;
            this.isUserRole = true;

            // case 'COMPANY_USER':
            //           case 'SUPER_USER':

            this.isAble = true;
            this.getVReportsByUser();
            this.getCurrentUserReport();
            break;
          case 'SUPER_USER':
            this.isSuperUser = true;
            this.isUserRole = true;
            this.isAble = true;
            this.getVReportsByUser();
            this.getCurrentUserReport();
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
    // this.getVReports();
    // this.route.paramMap.subscribe(params => {
    //   this.userGroupId = params.get('id');
    //   this.getUserGroup(this.userGroupId);
    // });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onCompanyChange() {
    if (this.selectedCompany) {
      // Load partners based on the selected company
      this.loadPartnersByCompany(+this.selectedCompany);
    } else {
      // If no company is selected, reset the partners list
      this.partners = [];
    }
  }


  // Updated filterTable function
  filterTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case insensitive search
    this.tempReports = this.reports.filter((d) => {
      // Check if any of the properties in the object match the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Return false for non-string properties
      });
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/reports/financial/${this.activeRow.reports_id}`]);
    }
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
  loadUsersByCompany(companyId: number) {
    // console.log("inside the loadUsersByCompany")
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        // if (data && Array.isArray(data.company_member)) {
        //   // Map through company members and fetch user details for each member
        //   this.users = await Promise.all(data.company_member.map(async (member: any) => {
        //     try {
        //       // const userResponse = member.User;
        //       const user = member.User; // Extract user details from the response

        //       // Combine member and user data
        //       return {
        //         ...member,
        //         user: user // Include user details in the member object
        //       };
        //     } catch (error) {
        //       console.error('Error fetching user for member:', member, error);
        //       return { ...member, user: null }; // In case of error, return member without user details
        //     }
        //   }));
        // } else {
        //   console.error('Expected an array but got:', data);
        //   this.users = [];
        // }

        // console.log(this.users); // Check the final combined data structure
        this.users = data.users;

        // console.log("this.users nga load company users", this.users)
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }
  loadUsersByUserGroups(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.userGroupMembers)) {
          // Map through company members and fetch user details for each member
          this.users = await Promise.all(data.userGroupMembers.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user; // Extract user details from the response

              // Combine member and user data
              return {
                ...member,
                user: user.name // Include user details in the member object
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }

        // console.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }
  loadUsersByPartner(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.partnerMember)) {
          // Map through company members and fetch user details for each member
          this.users = await Promise.all(data.partnerMember.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user; // Extract user details from the response

              // Combine member and user data
              return {
                ...member,
                user: user.name // Include user details in the member object
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }

        // console.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }

  getVReports() {
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
    this.reportService.getAllReports(filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.reports is an array
          this.reports = data.reports;
        } else {
          console.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  getVReportsByCompany() {
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
    if (this.selectedReportType?.length > 0) {
      filters.report_type = this.selectedReportType;
    }
    // Date range filters
    if (this.startDate) {
      filters.from_date = this.formatDate(this.startDate);
    }

    if (this.endDate) {
      filters.to_date = this.formatDate(this.endDate);
    }

    // Total energy range filter
    if (this.totalEnergyMin !== null && this.totalEnergyMax !== null) {
      filters.total_energy_min = this.totalEnergyMin;
      filters.total_energy_max = this.totalEnergyMax;
    }

    // Total cost range filter
    if (this.totalCostMin !== null && this.totalCostMax !== null) {
      filters.total_cost_min = this.totalCostMin;
      filters.total_cost_max = this.totalCostMax;
    }
    this.reportService.getAllReportByCompany(this.company_id, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.reports is an array
          this.reports = data.reports;
        } else {
          console.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
  getVReportsByPartner() {
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
    if (this.selectedReportType?.length > 0) {
      filters.report_type = this.selectedReportType;
    }
    // Date range filters
    if (this.startDate) {
      filters.from_date = this.formatDate(this.startDate);
    }

    if (this.endDate) {
      filters.to_date = this.formatDate(this.endDate);
    }

    // Total energy range filter
    if (this.totalEnergyMin !== null && this.totalEnergyMax !== null) {
      filters.total_energy_min = this.totalEnergyMin;
      filters.total_energy_max = this.totalEnergyMax;
    }

    // Total cost range filter
    if (this.totalCostMin !== null && this.totalCostMax !== null) {
      filters.total_cost_min = this.totalCostMin;
      filters.total_cost_max = this.totalCostMax;
    }
    this.reportService.getAllReportByPartner(this.partner_id, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.reports is an array
          this.reports = data.reports;
        } else {
          console.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  getVReportsByUserGroup() {
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

    if (this.selectedReportType?.length > 0) {
      filters.report_type = this.selectedReportType;
    }
    // Date range filters
    if (this.startDate) {
      filters.from_date = this.formatDate(this.startDate);
    }

    if (this.endDate) {
      filters.to_date = this.formatDate(this.endDate);
    }

    // Total energy range filter
    if (this.totalEnergyMin !== null && this.totalEnergyMax !== null) {
      filters.total_energy_min = this.totalEnergyMin;
      filters.total_energy_max = this.totalEnergyMax;
    }

    // Total cost range filter
    if (this.totalCostMin !== null && this.totalCostMax !== null) {
      filters.total_cost_min = this.totalCostMin;
      filters.total_cost_max = this.totalCostMax;
    }

    this.reportService.getAllReportByUserGroup(this.usergroup_id, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.reports is an array
          this.reports = data.reports;
        } else {
          console.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getCurrentUserReport() {
    this.authService.getCurrentUser().subscribe(
      (data) => {
        // console.log(data);
        this.currentUserId = data.user.userId;
        // this.image = data.user.user_image;
        this.reportService.getAllReportByUser(this.currentUserId).subscribe(
          (data: any) => {
            // console.log(data);
            if (data && Array.isArray(data.reports)) {
              // If data.reports is an array
              this.reports = data.reports;
            } else {
              console.error('Expected an array but got:', data);
              this.reports = []; // Set to an empty array if data is not valid
            }
            this.tempReports = [...this.reports];
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
      }
    )
  }

  // getCurrentUserById(id: number) {
  //   this.userService.getUserById(id).subscribe(
  //     (data) => {
  //       console.log(data);
  //       // this.name = data.user.name;
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   )
  // }

  getVReportsByUser() {
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
    this.reportService.getAllReportByUser(this.user_id, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.reports is an array
          this.reports = data.reports;
        } else {
          console.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  applyFilters() {
    const filters: any = {};

    if (this.startDate) {
      filters.from_date = this.startDate;
    }

    if (this.endDate) {
      filters.to_date = this.endDate;
    }
    if (this.isCompanyRole) {
      this.getVReportsByCompany();
    } else if (this.isPartnerRole) {
      this.getVReportsByPartner();
    } else if (this.isUserGroupAdmin) {
      this.getVReportsByUserGroup();
    } else if (this.isRadXRole) {
      this.getVReports();
    } else {
      this.getCurrentUserReport(); // fallback for RadX
    }
  }

  // ============================================================================
  // 🆕 SEND REPORT EMAIL — button per rreshti, me confirm modal + toast
  // ============================================================================

  // Kthen etiketen e marresit + email (nese dihet) per confirm modal.
  // Perdor te dhenat qe vijne me include nga backend (partner.email / company_email / usergr_email).
  getRecipientLabel(row: any): string {
    if (!row) return '';
    const type = String(row?.report_type || '').toLowerCase();
    if (type.includes('partner')) return `Partner: ${row?.Partner?.partner_name || 'Unknown'}`;
    if (type.includes('user_group') || type.includes('user group')) return `User Group: ${row?.UserGroup?.usergr_name || 'Unknown'}`;
    if (type.includes('company')) return `Company: ${row?.Company?.company_name || 'Unknown'}`;
    if (type.includes('rfid') || type.includes('card')) return `Card owner (User / Group / Partner)`;
    if (type.includes('user')) return `User: ${row?.User?.name || row?.User?.username || 'Unknown'}`;
    return 'Recipient sipas tipit te raportit';
  }

  // 🆕 Kthen email-in e marresit (nese dihet) — perdoret ne confirm modal per te
  // treguar sakte se ku do te dergohet email-i para se user-i te klikoje "Dergo Tani".
  getRecipientEmail(row: any): string {
    if (!row) return '';
    const type = String(row?.report_type || '').toLowerCase();
    if (type.includes('partner')) return row?.Partner?.email || '';
    if (type.includes('user_group') || type.includes('user group')) return row?.UserGroup?.usergr_email || '';
    if (type.includes('company')) return row?.Company?.company_email || '';
    if (type.includes('user')) return row?.User?.email || '';
    if (type.includes('rfid') || type.includes('card')) return ''; // Backend rezolvon prej Card.User/UG/Partner
    return '';
  }

  // 🆕 A ka akses te sheh Send info (email badge + audit tooltip)?
  // Vetem COMPANY_ADMIN, COMPANY_ANALYST, RadX_Admin, RADX_MODERATOR.
  get canSeeSendInfo(): boolean {
    return this.isCompanyAdmin || this.isCompanyAnalyst || this.isRadXRole;
  }

  // 🆕 A ka akses te dergoje raporte me email?
  // Vetem COMPANY_ADMIN dhe COMPANY_ANALYST — rolet e tjera nuk shohin butonin
  // "Send Report" ne kolonen ACTIONS. Kjo perputhet me gating-un e Excel-it te plote
  // multi-sheet ne financialdetails (Partner + UG report).
  get canSendReport(): boolean {
    return this.isCompanyAdmin || this.isCompanyAnalyst;
  }

  // Klik ne butonin Send Report ne rresht — hap confirm modal-in.
  onClickSendReport(event: Event, row: any) {
    // Ndalo navigimin qe onActivate te tabelese te mos beje redirect tek details.
    event.stopPropagation();
    // 🆕 Defensive check: nese user-i s'ka rol te lejuar, ndaloje edhe nese DOM-i eshte modifikuar manualisht.
    if (!this.canSendReport) return;
    this.reportToSend = row;
    this.showSendConfirm = true;
    this.sendReportMessage = '';
    this.sendReportMessageClass = '';
  }

  // Anulim i modal-it.
  cancelSendReport() {
    this.showSendConfirm = false;
    this.reportToSend = null;
    this.isSendingReport = false;
  }

  // Konfirmim + dergimi aktual.
  confirmSendReport() {
    if (!this.reportToSend || this.isSendingReport) return;
    const row = this.reportToSend;
    this.isSendingReport = true;

    // Merr te dhenat e raportit nga backend, ndertoj Excel-in dhe pastaj POST-oj.
    this.reportService.getReport(row.reports_id).subscribe({
      next: (data: any) => {
        try {
          // Backend endpoint-i /singlerebort/:reportId kthen `reportData` te ndertuar tashme
          // nga switch case sipas report_type — te njejtat rreshta qe perdor Excel export ne
          // faqen e details.
          const reportRows: any[] = Array.isArray(data?.reportData) ? data.reportData : [];
          if (reportRows.length === 0) {
            this.finishSendWithError('Nuk ka te dhena per kete raport (bosh) — nuk mund te dergohet.');
            return;
          }

          // Ndertim Excel — logjika e ndryshme sipas tipit te raportit:
          //   Company Report → 4 sheets (Company + User Groups + Gas Station + Recharge History)
          //   User Group Report → multi-sheet (Fature Shitje + Detail + per-card sheets me hyperlinks)
          //   Te tjera → nje sheet i vetem
          const reportType = String(row?.report_type || '').toLowerCase();
          const isCompanyReport = reportType.includes('company');
          const isUserGroupReport = reportType.includes('user_group') || reportType.includes('user group');

          // 🆕 Company Report → fetch rechargers per te njejten periudhe + kompani,
          // pastaj build buffer me 4 sheets. Async, POST behet ne callback.
          if (isCompanyReport) {
            const companyId = row?.company_id;
            const dateMin = row?.from_date || '';
            const dateMax = row?.to_date || '';
            const proceed = (rechargers: any[]) => {
              const buf = buildCompanyReportBuffer(reportRows, undefined, rechargers);
              this.postExcelBufferForRow(buf, row);
            };
            if (companyId && dateMin && dateMax) {
              this.rechargeService.getRechargesByCompany(companyId, {
                date_min: dateMin, date_max: dateMax,
              }).subscribe({
                next: (dt: any) => {
                  const raw: any[] = dt?.recharges || [];
                  const mapped = raw.map((r: any) => ({
                    ...r,
                    company: r?.Company?.company_name || '',
                    user: r?.User?.username || '',
                    userGroup: r?.UserGroup?.usergr_name || '',
                    display_order_id: r?.pokOrderId || (r?.recharge_id ? `topup-${r.recharge_id}` : ''),
                  }));
                  proceed(mapped);
                },
                error: () => proceed([]),
              });
            } else {
              proceed([]);
            }
            return; // async — POST behet ne callback
          }

          let buffer: ArrayBuffer;
          if (isUserGroupReport) {
            // Emri i UG-se merret nga rreshti aktual (row.UserGroup.usergr_name).
            const ugName = row?.UserGroup?.usergr_name || 'UserGroup';
            const from = row?.from_date || '';
            const to = row?.to_date || '';
            buffer = buildUserGroupReportBuffer(reportRows, ugName, from, to);
          } else {
            const ws = XLSX.utils.json_to_sheet(reportRows);
            const wb: XLSX.WorkBook = { Sheets: { 'Report': ws }, SheetNames: ['Report'] };
            buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          }

          const excelBlob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const fileName = `Raport_${row.report_type}_${row.from_date}_${row.to_date}.xlsx`
            .replace(/[^a-zA-Z0-9._-]+/g, '_');

          const formData = new FormData();
          formData.append('excel', excelBlob, fileName);

          this.reportService.sendReportEmail(row.reports_id, formData).subscribe({
            next: (resp: any) => {
              this.isSendingReport = false;
              this.showSendConfirm = false;
              this.reportToSend = null;

              // Update rreshtin ne UI qe butoni te ndryshoje ne "Send it again".
              row.sent_at = resp?.data?.sent_at || new Date();
              row.send_count = resp?.data?.send_count || (row.send_count || 0) + 1;
              row.sent_to_emails = (resp?.data?.recipients || []).join(', ');

              this.sendReportMessage = resp?.message || 'Email sent successfully';
              this.sendReportMessageClass = 'alert-success';
              setTimeout(() => this.sendReportMessage = '', 5000);
            },
            error: (err) => {
              this.finishSendWithError(err?.error?.message || err?.message || 'Failed to send email');
            }
          });
        } catch (buildErr: any) {
          this.finishSendWithError('S\'u ndertua dot Excel-i: ' + (buildErr?.message || buildErr));
        }
      },
      error: (err) => {
        this.finishSendWithError(err?.error?.message || err?.message || 'S\'u lexuan dot te dhenat e raportit');
      }
    });
  }

  private finishSendWithError(msg: string) {
    this.isSendingReport = false;
    this.showSendConfirm = false;
    this.reportToSend = null;
    this.sendReportMessage = msg;
    this.sendReportMessageClass = 'alert-danger';
    setTimeout(() => this.sendReportMessage = '', 8000);
  }

  // 🆕 POST buffer-in tek endpoint-i dhe update state per rreshtin ne list.
  // Perdoret nga rrjedhat async (p.sh. Company Report qe pret rechargers).
  private postExcelBufferForRow(buffer: ArrayBuffer, row: any) {
    const excelBlob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const fileName = `Raport_${row.report_type}_${row.from_date}_${row.to_date}.xlsx`
      .replace(/[^a-zA-Z0-9._-]+/g, '_');

    const formData = new FormData();
    formData.append('excel', excelBlob, fileName);

    this.reportService.sendReportEmail(row.reports_id, formData).subscribe({
      next: (resp: any) => {
        this.isSendingReport = false;
        this.showSendConfirm = false;
        this.reportToSend = null;
        row.sent_at = resp?.data?.sent_at || new Date();
        row.send_count = resp?.data?.send_count || (row.send_count || 0) + 1;
        row.sent_to_emails = (resp?.data?.recipients || []).join(', ');
        this.sendReportMessage = resp?.message || 'Email sent successfully';
        this.sendReportMessageClass = 'alert-success';
        setTimeout(() => this.sendReportMessage = '', 5000);
      },
      error: (err) => {
        this.finishSendWithError(err?.error?.message || err?.message || 'Failed to send email');
      }
    });
  }

}