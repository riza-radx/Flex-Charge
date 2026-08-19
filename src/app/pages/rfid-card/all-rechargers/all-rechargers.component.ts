import { logger } from '@core/logger';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from 'src/app/services/cardService/card.service';
import { ChargingHistoryService } from 'src/app/services/chargingHistoryService/charging-history.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { RechargeService } from 'src/app/services/rechargeService/recharge.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
@Component({
  selector: 'app-all-rechargers',
  templateUrl: './all-rechargers.component.html',
  styles: [
  ]
})
export class AllRechargersComponent {
  entries: number = 10;
  selected: any[] = [];
  tempRechargers = [];
  activeRow: any;
  errorMessage: any;
  recharge: any = [];
  SelectionType = SelectionType;
  // documents: any[] = [];
  id: string;
  temp = [];
  companies: any[] = [];
  partners: any[] = [];
  userGroups: any[] = [];
  users: any[] = [];
  selectedCompany: string = '';
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
  rows: any = [];
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  company_id: any;
  partner_id: any;
  usergroup_id: any;
  user_id: any;
  isAble: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  selectedAmountMin: number | null = null;
  selectedAmountMax: number | null = null;
  selectedDateMin: string | null = null;
  selectedDateMax: string | null = null;
  selectedRechargeFrom: string = '';
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
    private chargingHistoryService: ChargingHistoryService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private partnerMemberService: PartnerMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private usergroupService: UserGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private rechargeService: RechargeService,
    private cardService: CardService,
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);

    // 🆕 Fetch pending fiscal IDs vetem per role-t qe shofin buton Retry — perndryshe 401.
    const allowedRolesForRetry = ['COMPANY_ANALYST', 'RadX_Admin', 'RADX_MODERATOR', 'SUPER_ADMIN'];
    if (allowedRolesForRetry.includes(this.userRole || '')) {
      this.chargingHistoryService.getPendingFiscalIds().subscribe(
        (res: any) => {
          this.pendingRechargeIds = new Set(res?.rechargeIds || []);
        },
        (err: any) => {
          logger.warn('S\'mund te merren pending fiscal IDs:', err?.message || err);
        }
      );
    }

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.getRecharges();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.getRecharges();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'COMPANY_ADMIN':
            // console.log('COMPANY_ADMIN is set to true');
            this.isAble = true;
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getRechargesByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
            // console.log('COMPANY_OPERATOR is set to true');
            this.isAble = true;
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.getRechargesByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isAble = true;
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isAble = true;
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isAble = true;
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true
            break;
          case 'COMPANY_CALL_CENTER':
            this.isAble = true;
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true
            break;
          case 'COMPANY_ANALYST':
            this.isAble = true;
            this.isCompanyRole = true;
            this.isCompanyAnalyst = true
            this.getRechargesByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'USER_GROUP_ADMIN':
            this.isAble = true;
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.getRechargesByUserGroup();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isAble = true;
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.getRechargesByUserGroup();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isAble = true;
            this.isUserRole = true;
            this.getRechargesByUser();
            break;
          case 'USER_GROUP_USER':
            this.isAble = true;
            this.isUserRole = true;
            this.isUserGroupRole = true;
            this.getRechargesByUser();
            this.loadUsersByUserGroups(this.usergroup_id);
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
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  // Updated filterTable function
  filterTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    // console.log('Search Value:', val);  // Debug log

    if (!val) {
      // If the search input is cleared, reset temp to original rows
      this.tempRechargers = [...this.rows];
      return;
    }

    this.tempRechargers = this.rows.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          const match = d[key].toLowerCase().includes(val); // Check if the property contains the search value
          if (match) logger.log(`Matched: ${d[key]} for ${key}`); // Debug log for matching values
          return match;
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
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/assets/charinghistory/${this.activeRow.charging_history_id}`]);
    }
  }

  loadCompanies() {
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

  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data.partners;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
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
        logger.log(error);
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
        logger.log(error);
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
        logger.log(error);
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
        logger.log(error);
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
        logger.error('Error fetching company members:', error);
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
                user: {
                  id: user.id,
                  name: user.name,
                },
              };
            } catch (error) {
              logger.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.users = [];
        }

        logger.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching company members:', error);
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
                user: {
                  id: user.id,
                  name: user.name,
                },
              };
            } catch (error) {
              logger.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.users = [];
        }

        logger.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching company members:', error);
      }
    );
  }
  getRecharges() {
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

    this.rechargeService.getAllRecharges().subscribe(
      (data: any) => {
        if (data && Array.isArray(data.recharges)) {
          this.rows = data.recharges.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem recharge-t me datetime >= 1 Qershor 2026 14:00 marrin buton Retry.
            is_after_golive: (row.date && row.time)
              ? (row.date + ' ' + row.time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo recharge_id eshte ne pending_fiscal_invoices
            in_pending_fiscal: this.pendingRechargeIds.has(row.recharge_id),
            // 🆕 display_order_id — shfaqet/eksportohet/search-ohet si:
            //   • pokOrderId (UUID) per voucher recharge
            //   • "topup-<recharge_id>" per topup (kur s'ka pokOrderId)
            display_order_id: row.pokOrderId || (row.recharge_id ? `topup-${row.recharge_id}` : ''),
          }));

          this.temp = [...this.rows];
          this.recharge = [...this.rows];
          this.tempRechargers = [...this.recharge];
        } else {
          logger.error('Expected an array but got:', data);
          this.recharge = [];
          this.tempRechargers = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getRechargesByCompany() {
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

    if (this.selectedAmountMin != null) filters.amount_min = this.selectedAmountMin;
    if (this.selectedAmountMax != null) filters.amount_max = this.selectedAmountMax;

    if (this.selectedDateMin) filters.date_min = this.selectedDateMin;
    if (this.selectedDateMax) filters.date_max = this.selectedDateMax;

    if (this.selectedRechargeFrom && this.selectedRechargeFrom !== '') {
      filters.recharge_from = this.selectedRechargeFrom || null;
    }
    // console.log('selectedRechargeFrom:', this.selectedRechargeFrom);
    // console.log("this.selectedUserGroup", this.selectedUserGroup)
    // console.log("this.selectedUser", this.selectedUser)
    // console.log("filters", filters);
    // console.log('filters.recharge_from:', filters.recharge_from);
    this.rechargeService.getRechargesByCompany(this.company_id, filters).subscribe(
      (data: any) => {
        logger.log(data);
        if (data && Array.isArray(data.recharges)) {
          // console.log("data.recharges", data.recharges)
          this.rows = data.recharges.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem recharge-t me datetime >= 1 Qershor 2026 14:00 marrin buton Retry.
            is_after_golive: (row.date && row.time)
              ? (row.date + ' ' + row.time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo recharge_id eshte ne pending_fiscal_invoices
            in_pending_fiscal: this.pendingRechargeIds.has(row.recharge_id),
            // 🆕 display_order_id — shfaqet/eksportohet/search-ohet si:
            //   • pokOrderId (UUID) per voucher recharge
            //   • "topup-<recharge_id>" per topup (kur s'ka pokOrderId)
            display_order_id: row.pokOrderId || (row.recharge_id ? `topup-${row.recharge_id}` : ''),
          }));

          this.temp = [...this.rows];
          this.recharge = [...this.rows];
          this.tempRechargers = [...this.recharge];
        } else {
          logger.error('Expected an array but got:', data);
          this.recharge = [];
          this.tempRechargers = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }


  getRechargesByUserGroup() {
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
    if (this.selectedAmountMin != null) filters.amount_min = this.selectedAmountMin;
    if (this.selectedAmountMax != null) filters.amount_max = this.selectedAmountMax;

    if (this.selectedDateMin) filters.date_min = this.selectedDateMin;
    if (this.selectedDateMax) filters.date_max = this.selectedDateMax;

    if (this.selectedRechargeFrom?.length) filters.recharge_from = this.selectedRechargeFrom;
    this.rechargeService.getRechargesByUserGroup(this.usergroup_id, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.recharges)) {
          this.rows = data.recharges.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem recharge-t me datetime >= 1 Qershor 2026 14:00 marrin buton Retry.
            is_after_golive: (row.date && row.time)
              ? (row.date + ' ' + row.time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo recharge_id eshte ne pending_fiscal_invoices
            in_pending_fiscal: this.pendingRechargeIds.has(row.recharge_id),
            // 🆕 display_order_id — shfaqet/eksportohet/search-ohet si:
            //   • pokOrderId (UUID) per voucher recharge
            //   • "topup-<recharge_id>" per topup (kur s'ka pokOrderId)
            display_order_id: row.pokOrderId || (row.recharge_id ? `topup-${row.recharge_id}` : ''),
          }));

          this.temp = [...this.rows];
          this.recharge = [...this.rows];
          this.tempRechargers = [...this.recharge];
        } else {
          logger.error('Expected an array but got:', data);
          this.recharge = [];
          this.tempRechargers = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getRechargesByUser() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    if (this.selectedAmountMin != null) filters.amount_min = this.selectedAmountMin;
    if (this.selectedAmountMax != null) filters.amount_max = this.selectedAmountMax;

    if (this.selectedDateMin) filters.date_min = this.selectedDateMin;
    if (this.selectedDateMax) filters.date_max = this.selectedDateMax;

    if (this.selectedRechargeFrom?.length) filters.recharge_from = this.selectedRechargeFrom;
    // console.log("filters", filters);


    this.rechargeService.getRechargesByUserId(this.user_id).subscribe(
      (data: any) => {
        // console.log(data);

        // Check if the 'recharges' or 'recharge' field exists and is an array
        const recharges = data.recharges || data.recharge || [];

        if (Array.isArray(recharges)) {
          this.rows = recharges.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
          }));

          this.temp = [...this.rows];
          this.recharge = [...this.rows];
          this.tempRechargers = [...this.recharge];
        } else {
          logger.error('Expected an array but got:', recharges);
          this.recharge = [];
          this.tempRechargers = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape' }); // Set landscape mode

    const tableData = this.tempRechargers.map(recharge => [
      recharge?.date || 'N/A',
      recharge?.time || 'N/A',
      recharge?.amount || 'N/A', // If amount is numeric, you can handle it as 0 or 'N/A'
      recharge?.recharge_from || 'N/A',
      recharge?.pokOrderStatus || 'N/A',
      // Order Id me prefix "topup-" per topup; pokOrderId per voucher
      recharge?.display_order_id || recharge?.pokOrderId || (recharge?.recharge_id ? `topup-${recharge.recharge_id}` : 'N/A'),
      recharge?.Company?.company_name || 'N/A',
      recharge?.UserGroup?.usergr_name || 'N/A',
      recharge?.User?.username || 'N/A',
      recharge?.madeBy || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Date', 'Time', 'Amount', 'Recharge Type', 'POK Order Status', 'Order Id', 'Company', 'User Group', 'User', 'Made By']],
      body: tableData
    });

    doc.save('rechargeHistory.pdf');
  }

  exportToExcel() {
    const filteredData = this.tempRechargers.map(recharge => ({
      Date: recharge.date,
      Time: recharge.time,
      Amount: Number(recharge.amount),
      Recharge_Type: recharge.recharge_from,
      POK_Order_Status: recharge.pokOrderStatus,
      // Përdor display_order_id: pokOrderId per voucher, "topup-<id>" per topup
      Order_Id: recharge.display_order_id || recharge.pokOrderId || (recharge.recharge_id ? `topup-${recharge.recharge_id}` : ''),
      Company: recharge.company,
      User_Group: recharge.userGroup,
      User: recharge.user,
      Made_By: recharge.madeBy,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Recharge History': worksheet },
      SheetNames: ['Recharge History']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'rechargeHistory');
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // 🆕 Set me recharge_id qe jane ne pending_fiscal_invoices (cron do provoje vete) — fshih buton.
  pendingRechargeIds: Set<number> = new Set();

  // 🆕 Retry BC invoice creation per nje rimbushje/topup.
  // Buton-i shfaqet vetem per role COMPANY_ANALYST (+ admin variants).
  retryingInvoiceIds: Set<number> = new Set();
  retryInvoice(row: any, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const rechargeId = row?.recharge_id;
    if (!rechargeId) {
      alert('Recharge ID mungon — s\'mund te bej retry');
      return;
    }

    const ok = confirm(`A jeni i sigurte qe doni te tentoni krijimin/fiskalizimin e fatures ne BC per Recharge ID ${rechargeId}?`);
    if (!ok) return;

    this.retryingInvoiceIds.add(rechargeId);
    this.chargingHistoryService.retryBCInvoice('recharge', rechargeId).subscribe(
      (res: any) => {
        this.retryingInvoiceIds.delete(rechargeId);
        if (res?.success) {
          // 🆕 Update row ne memorje me FISK numrin → butoni fshihet menjehere pa refresh tabele
          row.bc_invoice_number = res.invoiceNumber || 'OK';
          alert(`✓ Sukses!\n\nNumri i fatures: ${res.invoiceNumber || 'N/A'}\n\n${res.message || ''}`);
        } else {
          alert(`✗ Deshtoi:\n\n${res?.message || 'Unknown error'}`);
        }
      },
      (err: any) => {
        this.retryingInvoiceIds.delete(rechargeId);
        const body = err?.error || err;
        alert(`✗ Deshtoi:\n\n${body?.message || err?.message || 'Unknown error'}\n\nDetaje: ${JSON.stringify(body?.details || {}, null, 2).substring(0, 300)}`);
      }
    );
  }

  isRetrying(row: any): boolean {
    return this.retryingInvoiceIds.has(row?.recharge_id);
  }
}



const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
