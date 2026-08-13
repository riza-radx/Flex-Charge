import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargingHistoryService } from "../../../../services/chargingHistoryService/charging-history.service";
import { UserService } from "../../../../services/userService/user.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { ReportService } from "../../../../services/reportService/report.service";
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { AuthService } from 'src/app/services/authService/auth.service';
import { CardService } from 'src/app/services/cardService/card.service';
// 🆕 Company Agreement Report (roaming)
import { RoamingReportService } from 'src/app/services/roamingReportService/roaming-report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-companycreatefinancials',
  templateUrl: './companycreatefinancials.component.html',
  styles: [
  ]
})
export class CompanycreatefinancialsComponent implements OnInit {

  // Form fields
  report = {
    companyId: null,
    userId: null,
    userGroupId: null,
    partnerId: null,
    cardId: null,
    fromDate: '',
    toDate: '',
    createFor: '',
    reportType: '',
    // 🆕 home company per Company_Agreement_Report (vetem RadX nese arrin kete UI; per Company eshte locked te company-n e tij ne backend)
    homeCompanyId: null
  };
  userSearchTermReport: string = '';
  filteredUsersReport = [];
  // Options for selects
  company: any;
  users = [];
  userGroups = [];
  partners: any[] = [];
  cards: [];
  errorMessage: any;
  reportTypes: string[] = [
    // 'Total_Revenue_Including_Taxes',
    // 'Total_Revenue_Excluding_Taxes',
    // 'Operator_share_of_revenue',
    // 'Partner_Share_Revenue',
    // 'Energy_kWh',
    // 'Avarage_charging_duration',
    // 'Avarage_energy_per_charging',
    // 'Charging_count',
    // 'Total Amount spent',
    // 'Avarage_Amount_Per_Active_User',
    // 'Avarage_Amount_Per_User',
    // 'Avarage_Energy_Per_Active_User',
    // 'Avarage_Duration_Per_Active_User',
    // 'Avarage_Duration_Per_User',
    // 'Avarage_Sessions_Per_Active_User',
    // 'Avarage_Sessions_Per_User',
    'User_Report',
    'User_Group_Report',
    'Partner_Report',
    'Company_Report',
    'RFID_Card_Report',
    'Time_Split_Report'
  ];
  maxDate: string;
  // Error and success messages
  reportSuccessMessage: string | null = null;
  reportErrorMessage: string | null = null;

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
  isCompanyUser: boolean = false;
  isUserGroupAdmin: boolean = false;
  isUserGroupModerator: boolean = false;
  isUserGroupUser: boolean = false;
  isPartnerAdmin: boolean = false;
  isPartnerModerator: boolean = false;
  isUser: boolean = false;
  isCompanyRole: boolean = false;
  isUserRole: boolean = false;
  isRadxRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  company_id: any;
  usergroup_id: any;
  partner_id: any;
  companyName: string = '';
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userGroupService: UserGroupService,
    private partnerService: PartnerService,
    private reportService: ReportService,
    private partnerMemberService: PartnerMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private companyService: CompanyService,
    private companyMemberService: CompanyMemberService,
    private cardService: CardService,
    private roamingReportService: RoamingReportService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get companyId from localStorage
    this.report.companyId = localStorage.getItem('companyId') || '';

    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    this.maxDate = today.toISOString().split('T')[0];
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      console.log("this.report.companyId ", this.company_id);
      this.partner_id = parsedCugpCred.partner_id;
      console.log('partner_id:', this.partner_id);
      this.usergroup_id = parsedCugpCred.usergr_id;
      console.log('usergroup_id:', this.usergroup_id);
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      console.log('user_id:', user_id);
      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.loadCompanies();
            this.loadUsers();
            this.loadUserGroups();
            this.loadPartners();
            this.getRFIDCards();
            this.isRadxRole = true;
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.loadCompanies();
            this.loadUsers();
            this.loadUserGroups();
            this.loadPartners();
            this.getRFIDCards();
            this.isRadxRole = true;
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.getCompanyDetails(this.company_id);
            this.loadUsersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.loadCardsByCompany(this.company_id);
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyOperator = true;
            this.getCompanyDetails(this.company_id);
            this.loadUsersByCompany(this.company_id); // Load all users
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.loadCardsByCompany(this.company_id);
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyModerator = true;
            this.getCompanyDetails(this.company_id);
            this.loadUsersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.loadCardsByCompany(this.company_id);
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyTechnicalOperator = true;
            this.getCurrentUser(); // Load only the current user
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyMaintenanceSpecialist = true;
            this.getCurrentUser(); // Load only the current user
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyCallCenter = true;
            this.getCurrentUser(); // Load only the current user
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'COMPANY_ANALYST':

            this.isCompanyAnalyst = true;
            this.getCompanyDetails(this.company_id);

            // case 'USER':
            // case 'COMPANY_USER':
            //             // case 'SUPER_USER':
            //             // this.getVehiclesByCompany(company_id);
            //             this.loadCompanies();

            this.loadUsersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.loadCardsByCompany(this.company_id);
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'COMPANY_USER':
            this.isCompanyUser = true;
            this.getCurrentUser(); // Load only the current user
            this.isCompanyRole = true; // Make sure isCompanyRole is set to true
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.loadUserGroupById(this.usergroup_id)
            this.loadUsersByUserGroups(this.usergroup_id);
            this.loadCardsByUserGroup(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.loadUserGroupById(this.usergroup_id)
            this.loadUsersByUserGroups(this.usergroup_id);
            this.loadCardsByUserGroup(this.usergroup_id);
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupUser = true;
            this.isUserGroupRole = true;
            this.getCurrentUser();
            this.getUserGroupDetail(this.usergroup_id);
            break;
          case 'PARTNER_ADMIN':
            this.isPartnerAdmin = true;
            this.isPartnerRole = true;
            this.getPartnerDetail(this.partner_id);
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'PARTNER_MODERATOR':
            this.isPartnerModerator = true;
            this.isPartnerRole = true;
            this.getPartnerDetail(this.partner_id);
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'USER':
            this.isUser = true;
            this.isUserRole = true;
            this.getCurrentUser();
            break;
          case 'SUPER_USER':
            this.isSuperUser = true;
            this.isUserRole = true;
            break;

          //     case 'USER_GROUP_ADMIN':
          //     case 'USER_GROUP_MODERATOR':
          //     case 'USER_GROUP_USER':
          //       // this.loadCompaniesByUserGroup(usergroup_id);
          // this.loadUsersByUserGroup(usergroup_id);
          // this.loadUserGroupsByUserGroup(usergroup_id);
          //       break;
          //     case 'PARTNER_ADMIN':
          //     case 'PARTNER_MODERATOR':
          //       // this.getLocationsByPartner(partner_id);
          //       this.loadCompaniesByPartner(partner_id);
          // this.loadUsersByPartner(partner_id);
          // this.loadUserGroupsByPartner(partner_id);
          //       break;
          //     case 'USER':
          // case 'COMPANY_USER':
          //     case 'SUPER_USER':
          //     // this.getVehiclesByUser(user_id);
          //     this.loadCompaniesByUser(user_id);
          // this.loadUsersByUser(user_id);
          // this.loadUserGroupsByUser(user_id);
          //     // this.getCurrencies(company_id);
          //     break;

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
    this.filterReportTypes();
    // Load data for dropdowns
    // this.loadUsers();
    // this.loadUserGroups();
    // this.loadPartners();
  }

  // // Fetch users
  // loadUsers() {
  //   this.userService.getAllUsers().subscribe(
  //     (data: any) => this.users = data,
  //     error => console.error('Error loading users:', error)
  //   );
  // }

  loadCompanies() {
    if (this.company_id) {
      this.companyService.getCompany(this.company_id).subscribe(
        (data: any) => {
          this.company = data.company;
          this.report.companyId = this.company_id;
          console.log('Loaded Company:', this.company);
        },
        error => {
          console.error('Error fetching the company:', error);
        }
      );
    } else {
      console.error('Company ID is not provided.');
    }
  }

  filterReportTypes() {
    if (this.isCompanyAdmin || this.isCompanyAnalyst) {
      // 🆕 Company Admin/Analyst → standardi + Company_Agreement_Report (gjeneron per company-n e tij)
      this.reportTypes = ['User_Report', 'Partner_Report', 'User_Group_Report', 'Company_Report', 'RFID_Card_Report', 'Time_Split_Report', 'Company_Agreement_Report'];
    } else if (this.isRadXAdmin || this.isCompanyModerator || this.isCompanyOperator) {
      this.reportTypes = ['User_Report', 'Partner_Report', 'User_Group_Report', 'Company_Report', 'RFID_Card_Report', 'Time_Split_Report'];
    } else if (this.isPartnerAdmin || this.isPartnerModerator) {
      this.reportTypes = ['User_Report', 'Partner_Report'];
    } else if (this.isUserGroupAdmin || this.isUserGroupModerator) {
      this.reportTypes = ['User_Report', 'User_Group_Report', 'RFID_Card_Report'];
    } else if (this.isUser || this.isUserGroupUser || this.isCompanyUser || this.isCompanyTechnicalOperator || this.isCompanyMaintenanceSpecialist || this.isCompanyCallCenter) {
      this.reportTypes = ['User_Report'];
    }
    console.log(this.reportTypes)
  }


  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data: any) => { this.users = data.users, console.log(data) },
      (error: any) => {
        console.error('Error loading users:', error);
        this.reportErrorMessage = 'Failed to load users.';
      }
    );
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      (data: any) => {
        if (data && data.user && data.user.userId) {
          this.getCurrentUserById(data.user.userId);
        } else {
          console.error('Invalid user data:', data);
        }
      },
      error => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  getCurrentUserById(id: number) {
    this.userService.getUserById(id).subscribe(
      (data: any) => {
        if (data && data.user) {
          this.users = [{ id: data.user.id, name: data.user.name }];
        } else {
          console.error('Invalid user details:', data);
          this.users = [];
        }
        console.log(this.users);
      },
      error => {
        console.error('Error fetching user by ID:', error);
      }
    );
  }


  // Fetch user groups
  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data: any) => {
        console.log('Fetching user groups', data.userGroup);
        this.userGroups = data.userGroup, console.log("this.userGroups", this.userGroups)
      },

      error => console.error('Error loading user groups:', error)
    );
  }

  loadUserGroupById(userGroupId: number) {
    this.userGroupService.getUserGroup(userGroupId).subscribe(
      (data: any) => {
        console.log('Fetching user groups', data.userGroup);
        this.userGroups = [data.userGroup];
        console.log("this.userGroups", this.userGroups)
      },

      error => console.error('Error loading user groups:', error)
    );
  }

  // Fetch partners
  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data: any) => { this.partners = data.partners, console.log(data) },
      error => console.error('Error loading partners:', error)
    );
  }
  loadUsersByCompany(companyId: number) {
    // console.log("inside the loadUsersByCompany")
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        this.users = data.users;
        this.filteredUsersReport = this.users
        // console.log("this.users nga load company users", this.users)
      },
      (error) => {
        this.reportErrorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }

  getCompanyDetails(id: number): void {
    this.companyService.getCompany(id).subscribe({
      next: (response) => {
        this.companyName = response.company.company_name;
        // console.log('response:', response);
        // console.log('companyName:', this.companyName);
      },
      error: (error) => {
        console.error('Error fetching company details:', error);
      }
    });
  }

  // Fetch user groups
  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data: any) => { this.userGroups = data.userGroup, console.log(data) },
      error => console.error('Error loading user groups:', error)
    );
  }

  // Fetch partners
  loadPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data: any) => { this.partners = data.partner, console.log(data) },
      error => console.error('Error loading partners:', error)
    );
  }

  getPartnerDetail(partner_id: number) {
    this.partnerService.getPartner(partner_id).subscribe(
      (data: any) => {
        this.partners = data.partner ? [data.partner] : []; // Convert object to array
        // console.log(this.partners); // Debugging: Check if it's correctly set
      },
      error => console.error('Error loading partners:', error)
    );
  }
  getUserGroupDetail(usergroup_id: number) {
    this.userGroupService.getUserGroup(usergroup_id).subscribe(
      (data: any) => {
        this.userGroups = data.userGroup ? [data.userGroup] : []; // Convert object to array
        // console.log(this.userGroups); // Debugging: Check if it's correctly set
      },
      error => console.error('Error loading userGroups:', error)
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

              // Return a simplified user object
              return {
                id: user.id,
                name: user.name
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return null; // In case of error, return null
            }
          }));
          this.filteredUsersReport = this.users
          // Remove any null values (failed fetches)
          this.users = this.users.filter(user => user !== null);
        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }

        // console.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.reportErrorMessage = error.message;
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

              // Return a simplified user object
              return {
                id: user.id,
                name: user.name
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return null; // In case of error, return null
            }
          }));
          this.filteredUsersReport = this.users
          // Remove any null values (failed fetches)
          this.users = this.users.filter(user => user !== null);

        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }

        // console.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.reportErrorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }
  // Handle form submission
  onSubmit() {
    if (!this.report || !this.report.reportType) {
      this.reportErrorMessage = 'Please select a report type before submitting.';
      return;
    }

    // 🆕 Company_Agreement_Report → flow i ndare (direkt download Excel, asnje save ne DB)
    if (this.report.reportType === 'Company_Agreement_Report') {
      this.generateCompanyAgreementReport();
      return;
    }


    if (!this.report.companyId) {
      this.report.companyId = this.company_id;
    }

    // Set partnerId if partner_id is set
    if (this.partner_id) {
      this.report.partnerId = this.partner_id;
    }

    if (this.report.cardId) {
      this.report.cardId = Number(this.report.cardId);
      this.report.companyId = null;
    }

    // Set userGroupId if usergroup_id is set
    if (this.usergroup_id) {
      this.report.userGroupId = this.usergroup_id;
    }


    // console.log('Selected Report Type:', this.report.reportType);
    // console.log('This works');
    // console.log('this.report', this.report);

    // Clear previous messages
    this.reportSuccessMessage = null;
    this.reportErrorMessage = null;

    this.reportService.createReport(this.report).subscribe({
      next: (response) => {
        // console.log('Report created successfully', response);
        this.reportSuccessMessage = 'Report created successfully!';
        this.router.navigate(['/reports/financial']);
      },
      error: (error) => {
        console.error('Error creating report:', error);
        this.reportErrorMessage = this.handleRechargeError(error);
      }
    });
  }

  // Common error handler function
  handleRechargeError(error: any): string {
    if (error.status === 400) {
      return 'Invalid report data. Please check the fields and try again.';
    } else if (error.status === 401) {
      return 'Unauthorized access. Please log in and try again.';
    } else if (error.status === 403) {
      return 'You do not have permission to create this report.';
    } else if (error.status === 404) {
      return 'Report service not found. Please try again later.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }
  onReportTypeChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.report.reportType = selectedValue;
    this.report.companyId = this.company_id;
    // console.log('Report Type Changed:', selectedValue);
  }

  getRFIDCards() {
    this.cardService.getAllCards().subscribe(
      (data) => {
        this.cards = data.cards;

        // console.log(this.cards);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  loadCardsByCompany(id: string) {
    this.cardService.getCardByCompany(id).subscribe(
      (data: any) => {
        // console.log('API response:', data);

        // Check if the response contains the 'card' array
        if (data && data.success && Array.isArray(data.card)) {
          this.cards = data.card;
          // console.log('RFID Cards:', this.cards);
        } else {
          console.error('Unexpected data format:', data);
          //  this.availableCards = []; // Ensure the table is empty if data format is incorrect
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching card data:', error);
        //   this.availableCards = []; // Ensure the table is empty on error
      }
    );
  }

  loadCardsByUserGroup(usergr_id: number) {
    this.cardService.getCardByUserGroup(usergr_id).subscribe(
      (data: any) => {
        // console.log('API response getCardsByUserGroup:', data);
        this.cards = data.card
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching card data:', error);
      }
    );
  }

  filterUsersReport() {
    const term = this.userSearchTermReport.toLowerCase();
    this.filteredUsersReport = this.users.filter(user =>
      user.name.toLowerCase().includes(term)
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 🆕 Company Agreement Report (roaming) — direkt download Excel
  // ────────────────────────────────────────────────────────────────
  generateCompanyAgreementReport() {
    this.reportSuccessMessage = null;
    this.reportErrorMessage = null;

    if (!this.report.fromDate || !this.report.toDate) {
      this.reportErrorMessage = 'From Date dhe To Date jane te detyrueshme.';
      return;
    }
    if (this.report.fromDate > this.report.toDate) {
      this.reportErrorMessage = '"From Date" duhet te jete <= "To Date".';
      return;
    }

    // VegaCharging: kompania merret automatik nga backend bazuar te req.user.company_id.
    // Asnje home_company_id nuk dergohet (do shperfillet gjithsesi).
    this.roamingReportService.companyAgreementReport(null, this.report.fromDate, this.report.toDate).subscribe({
      next: (resp: any) => {
        const report = resp?.report;
        if (!report || !report.partners || report.partners.length === 0) {
          this.reportErrorMessage = 'Asnje karikim roaming per kete periudhe.';
          return;
        }
        this.downloadAgreementExcel(report);
        this.reportSuccessMessage = 'Raporti u gjenerua dhe u shkarkua si Excel.';
      },
      error: (err) => {
        this.reportErrorMessage = err?.error?.message || err?.message || 'Gjenerimi i raportit deshtoi.';
      }
    });
  }

  private downloadAgreementExcel(report: any) {
    const wb = XLSX.utils.book_new();

    // ── Summary sheet ───────────────────────────────────────────
    const summaryRows: any[] = [
      ['Roaming Agreements Report'],
      [`Home: ${report.home_company.name}`],
      [`Periudha: ${report.period.from} → ${report.period.to}`],
      [],
      ['Partner', 'Agreement', 'Sessions', 'Energy (kWh)', 'Gross (ALL)', 'Te fituarat tona', 'Te partnerit', 'Net qe na detyrohet']
    ];
    for (const p of report.partners) {
      summaryRows.push([
        p.partner_company.name,
        p.agreement.name,
        p.summary.totals.sessions,
        p.summary.totals.energy_kwh,
        p.summary.totals.gross,
        p.summary.totals.my_revenue,
        p.summary.totals.partner_revenue,
        p.summary.totals.net_owed_to_me
      ]);
    }
    summaryRows.push([
      'TOTAL', '',
      report.grand_total.sessions, '',
      report.grand_total.gross,
      report.grand_total.my_revenue,
      report.grand_total.partner_revenue, ''
    ]);
    const sumSheet = XLSX.utils.aoa_to_sheet(summaryRows);
    sumSheet['!cols'] = [{ wch: 28 }, { wch: 28 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(wb, sumSheet, 'Summary');

    // ── 1 sheet per marrëveshje/partner ─────────────────────────
    for (const p of report.partners) {
      const rows: any[] = [];
      rows.push([`Marreveshja: ${p.agreement.name}`]);
      rows.push([`Home: ${report.home_company.name}  •  Partner: ${p.partner_company.name}  •  Periudha: ${report.period.from} → ${report.period.to}`]);
      rows.push([]);
      rows.push(['Data', 'Drejtimi', 'Roli yne', 'Charging ID', 'User', 'Charger', 'Energy (kWh)', 'Gross (ALL)', 'Home Fee', 'Host Net']);
      for (const it of p.items) {
        rows.push([
          this.fmtDateExcel(it.date),
          it.direction === 'a_to_b' ? 'A→B' : 'B→A',
          it.role === 'incoming' ? 'Host (i yni)' : 'Home (i yni)',
          it.charging_id,
          it.user_name,
          it.charger_name,
          it.energy_kwh,
          it.gross_amount,
          it.home_fee,
          it.host_net
        ]);
      }
      rows.push([]);
      rows.push(['Permbledhje']);
      rows.push([
        'Incoming (partner @ chargers tona)', '', '', '',
        `${p.summary.incoming.count} sessions`, '',
        p.summary.incoming.energy_kwh, p.summary.incoming.gross, p.summary.incoming.home_fee, p.summary.incoming.host_net
      ]);
      rows.push([
        'Outgoing (userat tane @ chargers partner)', '', '', '',
        `${p.summary.outgoing.count} sessions`, '',
        p.summary.outgoing.energy_kwh, p.summary.outgoing.gross, p.summary.outgoing.home_fee, p.summary.outgoing.host_net
      ]);
      rows.push([]);
      rows.push(['Te fituarat tona (Lek):', '', '', '', '', '', '', '', '', p.summary.totals.my_revenue]);
      rows.push(['Te partnerit (Lek):', '', '', '', '', '', '', '', '', p.summary.totals.partner_revenue]);
      rows.push(['Net qe na detyrohet (Lek):', '', '', '', '', '', '', '', '', p.summary.totals.net_owed_to_me]);

      const sh = XLSX.utils.aoa_to_sheet(rows);
      sh['!cols'] = [{ wch: 18 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
      const safeName = (p.partner_company.name || 'Partner').replace(/[\\\/\?\*\[\]:]/g, '_').slice(0, 31);
      XLSX.utils.book_append_sheet(wb, sh, safeName);
    }

    const fileName = `Roaming_Report_${report.home_company.name.replace(/\s+/g, '_')}_${report.period.from}_to_${report.period.to}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  private fmtDateExcel(d: any): string {
    if (!d) return '';
    const dt = new Date(d);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
  }
}

