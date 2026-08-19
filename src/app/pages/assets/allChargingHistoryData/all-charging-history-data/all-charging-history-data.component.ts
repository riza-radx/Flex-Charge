import { logger } from '@core/logger';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargingHistoryService } from "../../../../services/chargingHistoryService/charging-history.service";

import { CompanyService } from "../../../../services/companyService/company.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { UserService } from "../../../../services/userService/user.service";
import { PartnerMemberService } from "../../../../services/partner-member.service";
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { UserGroupMembersService } from "../../../../services/userGroupMembersService/user-group-members.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-all-charging-history-data',
  templateUrl: './all-charging-history-data.component.html',
  styles: [`
    .sticky-h-scrollbar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-x: auto;
      overflow-y: hidden;
      height: 14px;
      background: #fff;
      border-top: 1px solid #e9ecef;
      box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
      z-index: 1000;
    }
    .sticky-h-scrollbar__phantom {
      height: 1px;
    }
    /* Mos shfaq scrollbar-in nese tabela hyn ne pamje (s'ka cfare te scroll-osh) */
    .sticky-h-scrollbar[hidden],
    .sticky-h-scrollbar.is-hidden {
      display: none;
    }
  `]
})
export class AllChargingHistoryDataComponent implements AfterViewInit {
  @ViewChild('tableScroll', { static: false }) tableScrollRef: ElementRef<HTMLDivElement>;
  @ViewChild('stickyScroll', { static: false }) stickyScrollRef: ElementRef<HTMLDivElement>;
  // Pre-seed with the min-width set on the ngx-datatable so the sticky scrollbar is visible
  // immediately on page load (before measureTableWidth runs). It will be refined dynamically.
  tableContentWidth = 2900;
  showStickyScroll = true;
  private syncingScroll = false;

  entries: number = 100;
  // Server-side pagination state. Sent to backend as limit/offset; backend
  // returns `total` so the table footer can paginate properly.
  pageSize: number = 50;
  currentOffset: number = 0;
  totalRows: number = 0;

  selected: any[] = [];
  tempChargingHistory = [];
  activeRow: any;
  errorMessage: any;
  chargingHistory: any = [];
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
  selectedStartedType: string = '';
  selectedFromDate: string = '';
  selectedFromTime: string = '';
  selectedToDate: string = '';
  selectedToTime: string = '';
  // 🆕 Search input value — ruajme kerkimin aktual qe export-i te aplikoje te
  // njejtin filter mbi tere muajin (jo vetem mbi faqen e shfaqur ne tabel).
  searchValue: string = '';
  // 🆕 Loading flag per butonin e export-it — shmangimi i klikimeve te shumefishta
  // gjate fetch-it te tere muajit.
  exportingInProgress: boolean = false;
  // 🆕 Month filter — dy dropdowns te ndara (Year + Month) ne UI, qe end-user
  // mund t'i ndryshoje pa u varur nga month-picker-i native i browser-it
  // (Chrome shpesh fsheh arrow-at e vitit). Te dy default-ojne ne datën aktuale.
  selectedYear: number = new Date().getFullYear();
  selectedMonthNum: number = new Date().getMonth() + 1;   // 1..12

  // Lista e vitit per dropdown. 2025 (kur projekti starton) deri ne vit aktual + 1.
  // Llogaritet nje here ne constructor — pa nevoje per recalc.
  readonly yearOptions: number[] = (() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = 2025; y <= currentYear + 1; y++) years.push(y);
    return years;
  })();

  // Static list e muajve per dropdown
  readonly monthOptions = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ];
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
    this.measureTableWidth();
  }
  toggleSearchInput() {
    this.isInputVisible = !this.isInputVisible; // Toggle input visibility on icon click
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.measureTableWidth(), 0);
    // Re-measure whenever the table's inner size changes (new rows, column reflow, window resize, etc.)
    if (typeof ResizeObserver !== 'undefined' && this.tableScrollRef?.nativeElement) {
      const ro = new ResizeObserver(() => this.measureTableWidth());
      ro.observe(this.tableScrollRef.nativeElement);
      // also observe the inner ngx-datatable element since scrollWidth changes when rows render
      const inner = this.tableScrollRef.nativeElement.querySelector('ngx-datatable');
      if (inner) ro.observe(inner as Element);
    }
    // Polling i shkurter: tabela mund te jete bosh ne ngAfterViewInit (data load asinkron).
    // Re-mat cdo 400ms per 6 sekonda derisa rreshtat te kene ardhur dhe scrollWidth te jete stabilizuar.
    let polls = 0;
    const pollInterval = setInterval(() => {
      this.measureTableWidth();
      polls++;
      if (polls >= 15) clearInterval(pollInterval);
    }, 400);
  }

  // Measure the natural scroll width of the table so the sticky scrollbar's phantom matches it.
  private measureTableWidth(): void {
    if (!this.tableScrollRef?.nativeElement) return;
    const el = this.tableScrollRef.nativeElement;
    const inner = el.querySelector('ngx-datatable') as HTMLElement | null;
    if (!inner) {
      this.tableContentWidth = el.scrollWidth;
      this.showStickyScroll = el.scrollWidth > el.clientWidth + 2;
      return;
    }

    // ngx-datatable e ka width 100% — kolonat brenda mund te jene me gjera, por outer
    // nuk e reflekton kete. Mat nga shume burime dhe merr max-in.
    const candidates: number[] = [];

    // 1) Sum of header cell offsetWidths
    const headerCells = inner.querySelectorAll('.datatable-header-cell');
    if (headerCells && headerCells.length > 0) {
      let sumHeader = 0;
      headerCells.forEach((cell: Element) => { sumHeader += (cell as HTMLElement).offsetWidth; });
      if (sumHeader > 0) candidates.push(sumHeader);
    }

    // 2) Sum of first row's body cell offsetWidths (mund te jene me te gjera se headers)
    const firstRowCells = inner.querySelectorAll('.datatable-body-row:first-child .datatable-body-cell');
    if (firstRowCells && firstRowCells.length > 0) {
      let sumRow = 0;
      firstRowCells.forEach((cell: Element) => { sumRow += (cell as HTMLElement).offsetWidth; });
      if (sumRow > 0) candidates.push(sumRow);
    }

    // 3) header-inner scrollWidth
    const header = inner.querySelector('.datatable-header-inner') as HTMLElement | null;
    if (header) candidates.push(header.scrollWidth);

    // 4) Body / scroll wrappers
    const bodyInner = inner.querySelector('.datatable-body') as HTMLElement | null;
    if (bodyInner) candidates.push(bodyInner.scrollWidth);
    const scrollEl = inner.querySelector('datatable-scroller, .datatable-scroll') as HTMLElement | null;
    if (scrollEl) candidates.push(scrollEl.scrollWidth);

    // 5) ngx-datatable's own scrollWidth
    candidates.push(inner.scrollWidth);

    let measuredContentWidth = candidates.length > 0 ? Math.max(...candidates) : el.scrollWidth;
    measuredContentWidth += 8;

    this.tableContentWidth = Math.max(el.scrollWidth, measuredContentWidth);
    this.showStickyScroll = this.tableContentWidth > el.clientWidth + 2;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.measureTableWidth();
  }

  // Mirror table -> sticky scroll
  onTableScroll(event: Event): void {
    if (this.syncingScroll || !this.stickyScrollRef?.nativeElement) return;
    this.syncingScroll = true;
    this.stickyScrollRef.nativeElement.scrollLeft = (event.target as HTMLDivElement).scrollLeft;
    this.syncingScroll = false;
  }

  // Mirror sticky -> table scroll
  onStickyScroll(event: Event): void {
    if (this.syncingScroll || !this.tableScrollRef?.nativeElement) return;
    this.syncingScroll = true;
    this.tableScrollRef.nativeElement.scrollLeft = (event.target as HTMLDivElement).scrollLeft;
    this.syncingScroll = false;
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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);

    // 🆕 Fetch pending fiscal invoice IDs vetem per role-t qe shofin buton Retry.
    // Endpoint-i kthen 401 per role-t e tjera → pa kete guard, dilte crash notification per cdo user.
    const allowedRolesForRetry = ['COMPANY_ANALYST', 'RadX_Admin', 'RADX_MODERATOR', 'SUPER_ADMIN'];
    if (allowedRolesForRetry.includes(this.userRole || '')) {
      this.chargingHistoryService.getPendingFiscalIds().subscribe(
        (res: any) => {
          this.pendingChargingIds = new Set(res?.chargingHistoryIds || []);
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
            this.onMonthChange();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.onMonthChange();
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
            this.onMonthChange();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
            // console.log('COMPANY_OPERATOR is set to true');
            this.isAble = true;
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.onMonthChange();
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
            this.onMonthChange();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'USER_GROUP_ADMIN':
            this.isAble = true;
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.onMonthChange();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isAble = true;
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.onMonthChange();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'PARTNER_ADMIN':
            this.isAble = true;
            this.isPartnerRole = true;
            this.onMonthChange();
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'PARTNER_MODERATOR':
            this.isAble = true;
            this.isPartnerRole = true;
            this.onMonthChange();
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isAble = true;
            this.isUserRole = true;
            this.onMonthChange();
            break;
          case 'USER_GROUP_USER':
            this.isAble = true;
            this.isUserRole = true;
            this.isUserGroupRole = true;
            this.onMonthChange();
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

  // Ndryshim i page size — client-side; ngx-datatable rifreskon automatikisht
  // faqet mbi `tempChargingHistory`. S'ka nevoje re-fetch nga server-i.
  entriesChange($event) {
    const value = parseInt($event.target.value, 10);
    this.entries = value;
    this.pageSize = value > 0 ? value : 50;
  }

  // 🆕 Helper: kthen vitin + muajin e zgjedhur. Nese ndokush i ben corrupt
  // selectedYear/selectedMonthNum (psh nga URL ose mbi sjellje te papritura),
  // fallback ne muajin aktual.
  private getSelectedYearMonth(): { year: number; month: number } {
    const y = Number.isInteger(this.selectedYear) ? this.selectedYear : new Date().getFullYear();
    const m = (this.selectedMonthNum >= 1 && this.selectedMonthNum <= 12)
      ? this.selectedMonthNum
      : (new Date().getMonth() + 1);
    return { year: y, month: m };
  }

  // 🆕 Ngarkim i tere muajit ne 1 hap — paginated fetch nga backend-i (5000/page),
  // pastaj enrichment + ruajtje ne `this.rows`. Search dhe pagination behen
  // client-side mbi kete set komplet. Zgjidh dy bug-e njekohesisht:
  //   1) Search-i tani mbulon te gjithe muajin, jo vetem faqen aktuale.
  //   2) Sesionet e dites se fundit te muajit nuk humbin (para: server paginonte
  //      dhe user-i shpesh ndalonte para se te arrinte faqen e fundit).
  async onMonthChange(): Promise<void> {
    const { year, month } = this.getSelectedYearMonth();
    try {
      const rawRows = await this.fetchAllMonthRowsRaw(year, month);
      const enriched = this.enrichRowsForExport(rawRows);
      this.rows = enriched;
      this.temp = [...this.rows];
      this.chargingHistory = [...this.rows];
      // Nese ka nje search aktive, aplikoje mbi rreshtat e rinj; ndryshe shfaqi te gjitha.
      const val = (this.searchValue || '').toLowerCase().trim();
      this.tempChargingHistory = val
        ? this.applySearchFilter(this.rows)
        : [...this.rows];
      this.totalRows = this.rows.length;
    } catch (error) {
      this.errorMessage = (error && error.message) || 'Failed to load charging history';
      logger.error(error);
    }
  }

  // 🆕 Sjell TE GJITHA rreshtat e nje muaji (paginated 5000/page), pa enrichment.
  // Perdoret nga onMonthChange (per tabelen) dhe nga loadAllRowsForExport (per Excel/PDF).
  private async fetchAllMonthRowsRaw(year: number, month: number): Promise<any[]> {
    const PAGE_SIZE = 5000;
    const HARD_LIMIT = 100000;
    let offset = 0;
    let aggregated: any[] = [];
    let total = Infinity;
    let iterations = 0;
    while (aggregated.length < total && aggregated.length < HARD_LIMIT) {
      iterations++;
      const filters = this.buildExportFilters(PAGE_SIZE, offset);
      logger.log(`[MonthLoad] iter=${iterations} year=${year} month=${month} offset=${offset} filters=`, filters);
      const data: any = await this.fetchPageForExport(year, month, filters);
      const gotRows = Array.isArray(data?.chargingHistory) ? data.chargingHistory.length : 0;
      logger.log(`[MonthLoad] response: rows=${gotRows} backendTotal=${data?.total}`);
      if (!data || !Array.isArray(data.chargingHistory)) break;
      aggregated = aggregated.concat(data.chargingHistory);
      total = typeof data.total === 'number' ? data.total : aggregated.length;
      if (data.chargingHistory.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    logger.log(`[MonthLoad] DONE — aggregated ${aggregated.length} rows in ${iterations} request(s), backend total=${total}`);
    return aggregated;
  }

  // Updated filterTable function
  // filterTable($event: any) {
  //   const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
  //   // console.log('Search Value:', val);  // Debug log

  //   if (!val) {
  //     // If the search input is cleared, reset temp to original rows
  //     this.tempChargingHistory = [...this.rows];
  //     return;
  //   }

  //   this.tempChargingHistory = this.rows.filter((d) => {
  //     // Check if any property in the object matches the search value
  //     return Object.keys(d).some(key => {
  //       if (typeof d[key] === 'string') {
  //         const match = d[key].toLowerCase().includes(val); // Check if the property contains the search value
  //         if (match) console.log(`Matched: ${d[key]} for ${key}`); // Debug log for matching values
  //         return match;
  //       }
  //       return false; // Ignore non-string properties
  //     });
  //   });
  // }

  filterTable($event: any) {
    const val = $event.target.value.toLowerCase();
    this.searchValue = val; // ruajme per export-in qe te aplikohet i njejti filter

    if (!val) {
      this.tempChargingHistory = [...this.rows];
      return;
    }

    // Recursive function to check nested objects
    function objectContainsValue(obj: any, searchTerm: string): boolean {
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const property = obj[key];
        if (property === null || property === undefined) continue;

        if (typeof property === 'string' || typeof property === 'number') {
          if (property.toString().toLowerCase().includes(searchTerm)) {
            return true;
          }
        } else if (typeof property === 'object') {
          // Recurse into nested object
          if (objectContainsValue(property, searchTerm)) {
            return true;
          }
        }
      }
      return false;
    }

    this.tempChargingHistory = this.rows.filter(record => objectContainsValue(record, val));
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
        // if (data && Array.isArray(data.company_member)) {
        //   // Map through company members and fetch user details for each member
        //   this.users = await Promise.all(data.company_member.map(async (member: any) => {
        //     try {
        //       // const userResponse = member.User;
        //       const user = member.User; // Extract user details from the response
        //       console.log("user",user);
        //       // Combine member and user data
        //       return {
        //         ...member,
        //         user: {
        //           id: user.id, 
        //           name: user.name, 
        //         },
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

        // console.log("Final users array for dropdown:", this.users);
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

        // console.log(this.users); // Check the final combined data structure
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

  // getChargingHistory() {
  //   const filters: any = {};

  //   // Add selected filter values if present
  //   if (this.selectedCompany) {
  //     filters.company_id = this.selectedCompany;
  //   }
  //   if (this.selectedPartner) {
  //     filters.partner_id = this.selectedPartner;
  //   }
  //   if (this.selectedUserGroup) {
  //     filters.usergr_id = this.selectedUserGroup;
  //   }
  //   if (this.selectedUser) {
  //     filters.user_id = this.selectedUser;
  //   }

  //   this.chargingHistoryService.getAllChargings(filters).subscribe(
  //     (data: any) => {
  //       if (data && Array.isArray(data.chargingHistory)) {
  //         this.rows = data.chargingHistory;
  //         this.temp = [...this.rows];
  //         this.chargingHistory = data.chargingHistory;
  //         this.tempChargingHistory = [...this.chargingHistory];

  //         // Fetch additional details for each row
  //         // this.rows.forEach((row, index) => {
  //         //   forkJoin({
  //         //     // company: this.companyService.getCompany(row.company_id),
  //         //     // user: this.userService.getUserById(row.user_id),
  //         //     // userGroup: this.usergroupService.getUserGroup(row.usergr_id),
  //         //     // partner: this.partnerService.getPartner(row.partner_id)
  //         //     company: this.chargingHistory.Company.company_name,
  //         //     user: this.chargingHistory.User.username,
  //         //     userGroup: this.chargingHistory.UserGroup.usergr_name,
  //         //     partner: this.chargingHistory.Partner.partner_name,
  //         //   }).subscribe(
  //         //     ({ company, user, userGroup, partner }) => {
  //         //       this.rows[index].company = company || '';
  //         //       this.rows[index].user = user || '';
  //         //       this.rows[index].userGroup = userGroup || '';
  //         //       this.rows[index].partner = partner || '';

  //         //       // Update temp to reflect the new details
  //         //       this.temp = [...this.rows];
  //         //     },
  //         //     (error) => {
  //         //       this.errorMessage = error.message;
  //         //       console.log('Error fetching additional details:', error);
  //         //     }
  //         //   );
  //         // });
  //       } else {
  //         console.error('Expected an array but got:', data);
  //         this.chargingHistory = [];
  //         this.tempChargingHistory = [];
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  // 🆕 Filter Type Roaming: 'all' | 'own' | 'roaming_in' | 'roaming_out'
  selectedRoamingType: string = 'all';

  getChargingHistory() {
    const filters: any = { limit: this.pageSize, offset: this.currentOffset };

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
    // 🆕 Roaming filter
    if (this.selectedRoamingType && this.selectedRoamingType !== 'all') {
      filters.roaming_type = this.selectedRoamingType;
    }
    // 🆕 Month filter — defaulton ne muajin aktual, ndryshohet nga month picker.
    // Year+month shkojne ne URL (endpoint dedicated), filters mban vetem te tjerat.
    const { year, month } = this.getSelectedYearMonth();
    this.chargingHistoryService.getChargingByMonthAll(year, month, filters).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.chargingHistory)) {
          this.totalRows = typeof data.total === 'number' ? data.total : data.chargingHistory.length;
          this.rows = data.chargingHistory.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 bc_invoice_number vjen nga Charging (jo ChargingHistory) — flat per dashboard
            bc_invoice_number: row.Charging?.bc_invoice_number || row.bc_invoice_number || null,
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem sesionet me ended_time >= 1 Qershor 2026 14:00 marrin buton Retry.
            // Krijon string te krahasueshem "YYYY-MM-DD HH:MM" dhe e krahason me cutoff-in.
            is_after_golive: (row.charging_history_date && row.ended_time)
              ? (row.charging_history_date + ' ' + row.ended_time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo charging_history_id eshte ne pending_fiscal_invoices
            // (cron-i automatik do trajtoje retry — pa nevoje per buton manual)
            in_pending_fiscal: this.pendingChargingIds.has(row.charging_history_id),
            // 🆕 Roaming context per UI
            is_roaming: row.is_roaming === true || row.is_roaming === 1,
            roaming_perspective: row.roaming_perspective || 'own',
            roaming_partner: (row.roaming_perspective === 'host' ? row.HomeCompany?.company_name : null)
                          || (row.roaming_perspective === 'home' ? row.HostCompany?.company_name : null)
                          || null,
            // 🆕 Cmimi per kWh — normalizon RatePerDay ose RatePerDays (varjet sipas
            // Sequelize singular/plural inference). Backend e perfshin si include.
            ratePerDayPrice: row.RatePerDay?.price ?? row.RatePerDays?.price ?? null,
          }));

          this.temp = [...this.rows];
          this.chargingHistory = [...this.rows];
          this.tempChargingHistory = [...this.chargingHistory];
        } else {
          logger.error('Expected an array but got:', data);
          this.chargingHistory = [];
          this.tempChargingHistory = [];
          this.totalRows = 0;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }



  // getChargingHistoryByCompany() {

  //   const filters: any = {};

  //   // Add selected filter values if present
  //   if (this.selectedCompany) {
  //     filters.company_id = this.selectedCompany;
  //   }
  //   if (this.selectedPartner) {
  //     filters.partner_id = this.selectedPartner;
  //   }
  //   if (this.selectedUserGroup) {
  //     filters.usergr_id = this.selectedUserGroup;
  //   }
  //   if (this.selectedUser) {
  //     filters.user_id = this.selectedUser;
  //   }
  //   this.chargingHistoryService.getChargingByCompany(this.company_id, filters).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       // if (data && Array.isArray(data.chargingHistory)) {
  //       //   // If this.chargingHistory is an array
  //       //   this.chargingHistory = data.chargingHistory;
  //       // } else {
  //       //   console.error('Expected an array but got:', data);
  //       //   this.chargingHistory = []; // Set to an empty array if data is not valid
  //       // }
  //       // this.tempChargingHistory = [...this.chargingHistory];
  //       if (data && Array.isArray(data.chargingHistory)) {
  //         this.rows = data.chargingHistory;
  //         this.temp = [...this.rows];
  //         this.chargingHistory = data.chargingHistory;
  //         this.tempChargingHistory = [...this.chargingHistory];

  //         // Fetch additional details for each row
  //         this.rows.forEach((row, index) => {
  //           forkJoin({
  //             company: this.chargingHistory.Company.company_name,
  //             user: this.chargingHistory.User.username,
  //             userGroup: this.chargingHistory.UserGroup.usergr_name,
  //             partner: this.chargingHistory.Partner.partner_name,
  //           }).subscribe(
  //             ({ company, user, userGroup, partner }) => {
  //               this.rows[index].company = company || '';
  //               this.rows[index].user = user || '';
  //               this.rows[index].userGroup = userGroup || '';
  //               this.rows[index].partner = partner || '';

  //               // Update temp to reflect the new details
  //               this.temp = [...this.rows];
  //             },
  //             (error) => {
  //               this.errorMessage = error.message;
  //               console.log('Error fetching additional details:', error);
  //             }
  //           );
  //         });
  //       } else {
  //         console.error('Expected an array but got:', data);
  //         this.chargingHistory = [];
  //         this.tempChargingHistory = [];
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  getChargingHistoryByCompany() {
    const filters: any = { limit: this.pageSize, offset: this.currentOffset };
    logger.log('[FETCH] getChargingHistoryByCompany filters=', filters);

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

    if (this.selectedStartedType) filters.started_type = this.selectedStartedType;
    if (this.selectedFromDate) filters.from_date = this.selectedFromDate;
    if (this.selectedFromTime) filters.from_time = this.selectedFromTime;
    if (this.selectedToDate) filters.to_date = this.selectedToDate;
    if (this.selectedToTime) filters.to_time = this.selectedToTime;
    // 🆕 Roaming filter (Own/Roaming-In/Roaming-Out/All)
    if (this.selectedRoamingType && this.selectedRoamingType !== 'all') {
      filters.roaming_type = this.selectedRoamingType;
    }

    logger.log("getChargingHistoryByCompany - filters",filters)
    const { year, month } = this.getSelectedYearMonth();
    this.chargingHistoryService.getChargingByMonthForCompany(this.company_id, year, month, filters).subscribe(
      (data: any) => {
        logger.log('[RESPONSE] rows received=', data?.chargingHistory?.length, 'total=', data?.total, 'first row id=', data?.chargingHistory?.[0]?.charging_history_id, 'last row id=', data?.chargingHistory?.[data?.chargingHistory?.length - 1]?.charging_history_id);
        if (data && Array.isArray(data.chargingHistory)) {
          this.totalRows = typeof data.total === 'number' ? data.total : data.chargingHistory.length;
          this.rows = data.chargingHistory.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 bc_invoice_number vjen nga Charging (jo ChargingHistory) — flat per dashboard
            bc_invoice_number: row.Charging?.bc_invoice_number || row.bc_invoice_number || null,
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem sesionet me ended_time >= 1 Qershor 2026 14:00 marrin buton Retry.
            // Krijon string te krahasueshem "YYYY-MM-DD HH:MM" dhe e krahason me cutoff-in.
            is_after_golive: (row.charging_history_date && row.ended_time)
              ? (row.charging_history_date + ' ' + row.ended_time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo charging_history_id eshte ne pending_fiscal_invoices
            // (cron-i automatik do trajtoje retry — pa nevoje per buton manual)
            in_pending_fiscal: this.pendingChargingIds.has(row.charging_history_id),
            // 🆕 Roaming context per UI
            is_roaming: row.is_roaming === true || row.is_roaming === 1,
            roaming_perspective: row.roaming_perspective || 'own',
            roaming_partner: (row.roaming_perspective === 'host' ? row.HomeCompany?.company_name : null)
                          || (row.roaming_perspective === 'home' ? row.HostCompany?.company_name : null)
                          || null,
            // 🆕 Cmimi per kWh — normalizon RatePerDay ose RatePerDays (varjet sipas
            // Sequelize singular/plural inference). Backend e perfshin si include.
            ratePerDayPrice: row.RatePerDay?.price ?? row.RatePerDays?.price ?? null,
          }));

          this.temp = [...this.rows];
          this.chargingHistory = [...this.rows];
          this.tempChargingHistory = [...this.chargingHistory];
        } else {
          logger.error('Expected an array but got:', data);
          this.chargingHistory = [];
          this.tempChargingHistory = [];
          this.totalRows = 0;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
    
  }



  getChargingHistoryByUserGroup() {
    const filters: any = { limit: this.pageSize, offset: this.currentOffset };

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

    if (this.selectedStartedType) filters.started_type = this.selectedStartedType;
    if (this.selectedFromDate) filters.from_date = this.selectedFromDate;
    if (this.selectedFromTime) filters.from_time = this.selectedFromTime;
    if (this.selectedToDate) filters.to_date = this.selectedToDate;
    if (this.selectedToTime) filters.to_time = this.selectedToTime;

    const { year, month } = this.getSelectedYearMonth();
    this.chargingHistoryService.getChargingByMonthForUserGroup(this.usergroup_id, year, month, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.chargingHistory)) {
          this.totalRows = typeof data.total === 'number' ? data.total : data.chargingHistory.length;
          this.rows = data.chargingHistory.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 bc_invoice_number vjen nga Charging (jo ChargingHistory) — flat per dashboard
            bc_invoice_number: row.Charging?.bc_invoice_number || row.bc_invoice_number || null,
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem sesionet me ended_time >= 1 Qershor 2026 14:00 marrin buton Retry.
            // Krijon string te krahasueshem "YYYY-MM-DD HH:MM" dhe e krahason me cutoff-in.
            is_after_golive: (row.charging_history_date && row.ended_time)
              ? (row.charging_history_date + ' ' + row.ended_time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo charging_history_id eshte ne pending_fiscal_invoices
            // (cron-i automatik do trajtoje retry — pa nevoje per buton manual)
            in_pending_fiscal: this.pendingChargingIds.has(row.charging_history_id),
            // 🆕 Roaming context per UI
            is_roaming: row.is_roaming === true || row.is_roaming === 1,
            roaming_perspective: row.roaming_perspective || 'own',
            roaming_partner: (row.roaming_perspective === 'host' ? row.HomeCompany?.company_name : null)
                          || (row.roaming_perspective === 'home' ? row.HostCompany?.company_name : null)
                          || null,
            // 🆕 Cmimi per kWh — normalizon RatePerDay ose RatePerDays (varjet sipas
            // Sequelize singular/plural inference). Backend e perfshin si include.
            ratePerDayPrice: row.RatePerDay?.price ?? row.RatePerDays?.price ?? null,
          }));

          this.temp = [...this.rows];
          this.chargingHistory = [...this.rows];
          this.tempChargingHistory = [...this.chargingHistory];
        } else {
          logger.error('Expected an array but got:', data);
          this.chargingHistory = [];
          this.tempChargingHistory = [];
          this.totalRows = 0;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getChargingHistoryByPartner() {
    const filters: any = { limit: this.pageSize, offset: this.currentOffset };

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

    if (this.selectedStartedType) filters.started_type = this.selectedStartedType;
    if (this.selectedFromDate) filters.from_date = this.selectedFromDate;
    if (this.selectedFromTime) filters.from_time = this.selectedFromTime;
    if (this.selectedToDate) filters.to_date = this.selectedToDate;
    if (this.selectedToTime) filters.to_time = this.selectedToTime;

    const { year, month } = this.getSelectedYearMonth();
    this.chargingHistoryService.getChargingByMonthForPartner(this.partner_id, year, month, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.chargingHistory)) {
          this.totalRows = typeof data.total === 'number' ? data.total : data.chargingHistory.length;
          this.rows = data.chargingHistory.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 bc_invoice_number vjen nga Charging (jo ChargingHistory) — flat per dashboard
            bc_invoice_number: row.Charging?.bc_invoice_number || row.bc_invoice_number || null,
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem sesionet me ended_time >= 1 Qershor 2026 14:00 marrin buton Retry.
            // Krijon string te krahasueshem "YYYY-MM-DD HH:MM" dhe e krahason me cutoff-in.
            is_after_golive: (row.charging_history_date && row.ended_time)
              ? (row.charging_history_date + ' ' + row.ended_time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo charging_history_id eshte ne pending_fiscal_invoices
            // (cron-i automatik do trajtoje retry — pa nevoje per buton manual)
            in_pending_fiscal: this.pendingChargingIds.has(row.charging_history_id),
            // 🆕 Roaming context per UI
            is_roaming: row.is_roaming === true || row.is_roaming === 1,
            roaming_perspective: row.roaming_perspective || 'own',
            roaming_partner: (row.roaming_perspective === 'host' ? row.HomeCompany?.company_name : null)
                          || (row.roaming_perspective === 'home' ? row.HostCompany?.company_name : null)
                          || null,
            // 🆕 Cmimi per kWh — normalizon RatePerDay ose RatePerDays (varjet sipas
            // Sequelize singular/plural inference). Backend e perfshin si include.
            ratePerDayPrice: row.RatePerDay?.price ?? row.RatePerDays?.price ?? null,
          }));

          this.temp = [...this.rows];
          this.chargingHistory = [...this.rows];
          this.tempChargingHistory = [...this.chargingHistory];
        } else {
          logger.error('Expected an array but got:', data);
          this.chargingHistory = [];
          this.tempChargingHistory = [];
          this.totalRows = 0;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getChargingHistoryByUser() {
    const filters: any = { limit: this.pageSize, offset: this.currentOffset };

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

    if (this.selectedStartedType) filters.started_type = this.selectedStartedType;
    if (this.selectedFromDate) filters.from_date = this.selectedFromDate;
    if (this.selectedFromTime) filters.from_time = this.selectedFromTime;
    if (this.selectedToDate) filters.to_date = this.selectedToDate;
    if (this.selectedToTime) filters.to_time = this.selectedToTime;

    // Backend perdor req.user.userId — userId nuk shkohet ne URL.
    const { year, month } = this.getSelectedYearMonth();
    this.chargingHistoryService.getChargingByMonthForCurrentUser(year, month, filters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data && Array.isArray(data.chargingHistory)) {
          this.totalRows = typeof data.total === 'number' ? data.total : data.chargingHistory.length;
          this.rows = data.chargingHistory.map((row) => ({
            ...row,
            company: row.Company?.company_name || '',
            user: row.User?.username || '',
            userGroup: row.UserGroup?.usergr_name || '',
            partner: row.Partner?.partner_name || '',
            // 🆕 bc_invoice_number vjen nga Charging (jo ChargingHistory) — flat per dashboard
            bc_invoice_number: row.Charging?.bc_invoice_number || row.bc_invoice_number || null,
            // 🆕 ug_check_fisk_false = true kur UG ka check_fisk=false → fshih buton retry
            ug_check_fisk_false: row.UserGroup ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0) : false,
            // 🆕 is_after_golive — vetem sesionet me ended_time >= 1 Qershor 2026 14:00 marrin buton Retry.
            // Krijon string te krahasueshem "YYYY-MM-DD HH:MM" dhe e krahason me cutoff-in.
            is_after_golive: (row.charging_history_date && row.ended_time)
              ? (row.charging_history_date + ' ' + row.ended_time) >= '2026-06-01 14:00'
              : false,
            // 🆕 in_pending_fiscal — buton fshihet nese kjo charging_history_id eshte ne pending_fiscal_invoices
            // (cron-i automatik do trajtoje retry — pa nevoje per buton manual)
            in_pending_fiscal: this.pendingChargingIds.has(row.charging_history_id),
            // 🆕 Roaming context per UI
            is_roaming: row.is_roaming === true || row.is_roaming === 1,
            roaming_perspective: row.roaming_perspective || 'own',
            roaming_partner: (row.roaming_perspective === 'host' ? row.HomeCompany?.company_name : null)
                          || (row.roaming_perspective === 'home' ? row.HostCompany?.company_name : null)
                          || null,
            // 🆕 Cmimi per kWh — normalizon RatePerDay ose RatePerDays (varjet sipas
            // Sequelize singular/plural inference). Backend e perfshin si include.
            ratePerDayPrice: row.RatePerDay?.price ?? row.RatePerDays?.price ?? null,
          }));

          this.temp = [...this.rows];
          this.chargingHistory = [...this.rows];
          this.tempChargingHistory = [...this.chargingHistory];
        } else {
          logger.error('Expected an array but got:', data);
          this.chargingHistory = [];
          this.tempChargingHistory = [];
          this.totalRows = 0;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }



  // Export the relevant fields to PDF
  // 🆕 Enrichment i njejte me ate ne `getChargingHistory*()` origjinale — perdoret
  // per tabelen kryesore, export Excel, dhe export PDF. Cdo fushe qe HTML e lexon
  // duhet te llogaritet ketu (ndryshe UI dukurite nuk shfaqen sic duhet).
  private enrichRowsForExport(rawRows: any[]): any[] {
    return (rawRows || []).map((row) => ({
      ...row,
      company: row.Company?.company_name || '',
      user: row.User?.username || '',
      userGroup: row.UserGroup?.usergr_name || '',
      partner: row.Partner?.partner_name || '',
      bc_invoice_number: row.Charging?.bc_invoice_number || row.bc_invoice_number || null,
      // ug_check_fisk_false: kur UG-ja ka check_fisk=false → butoni Retry fshihet.
      ug_check_fisk_false: row.UserGroup
        ? (row.UserGroup.check_fisk === false || row.UserGroup.check_fisk === 0)
        : false,
      // is_after_golive: vetem sesionet me ended_time >= 1 Qershor 2026 14:00
      // marrin butonin Retry (para asaj kohe s'ka fiscal integration).
      is_after_golive: (row.charging_history_date && row.ended_time)
        ? (row.charging_history_date + ' ' + row.ended_time) >= '2026-06-01 14:00'
        : false,
      // in_pending_fiscal: kur charging_history_id eshte ne pending_fiscal_invoices
      // (cron-i po provon retry automatik → fshihi butonin manual).
      in_pending_fiscal: this.pendingChargingIds ? this.pendingChargingIds.has(row.charging_history_id) : false,
      is_roaming: row.is_roaming === true || row.is_roaming === 1,
      roaming_perspective: row.roaming_perspective || 'own',
      // roaming_partner: emri i kompanise se pales tjeter ne roaming — perdoret ne badges IN/OUT.
      roaming_partner: (row.roaming_perspective === 'host' ? row.HomeCompany?.company_name : null)
        || (row.roaming_perspective === 'home' ? row.HostCompany?.company_name : null)
        || null,
      ratePerDayPrice: row.RatePerDay?.price ?? row.RatePerDays?.price ?? null,
    }));
  }

  // 🆕 Aplikon te njejtin search filter qe perdor `filterTable()` mbi rreshtat e
  // sjelle nga backend-i. Pa kete, kerkimi qe shfaqet ne UI nuk reflektohet ne export.
  private applySearchFilter(rows: any[]): any[] {
    const val = (this.searchValue || '').toLowerCase().trim();
    if (!val) return rows;
    const objectContainsValue = (obj: any, term: string): boolean => {
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const prop = obj[key];
        if (prop === null || prop === undefined) continue;
        if (typeof prop === 'string' || typeof prop === 'number') {
          if (prop.toString().toLowerCase().includes(term)) return true;
        } else if (typeof prop === 'object') {
          if (objectContainsValue(prop, term)) return true;
        }
      }
      return false;
    };
    return rows.filter(r => objectContainsValue(r, val));
  }

  // 🆕 Ndertesa e filters object — i njejti perdoret nga te 5 endpoint-et.
  private buildExportFilters(limit: number, offset: number): any {
    const filters: any = { limit, offset };
    if (this.selectedCompany) filters.company_id = this.selectedCompany;
    if (this.selectedPartner) filters.partner_id = this.selectedPartner;
    if (this.selectedUserGroup) filters.usergr_id = this.selectedUserGroup;
    if (this.selectedUser) filters.user_id = this.selectedUser;
    if (this.selectedStartedType) filters.started_type = this.selectedStartedType;
    if (this.selectedRoamingType && this.selectedRoamingType !== 'all') {
      filters.roaming_type = this.selectedRoamingType;
    }
    if (this.selectedFromDate) filters.from_date = this.selectedFromDate;
    if (this.selectedFromTime) filters.from_time = this.selectedFromTime;
    if (this.selectedToDate) filters.to_date = this.selectedToDate;
    if (this.selectedToTime) filters.to_time = this.selectedToTime;
    return filters;
  }

  // 🆕 Zgjedh endpoint-in e duhur sipas role-it (i njejti pattern me onMonthChange).
  private fetchPageForExport(year: number, month: number, filters: any): Promise<any> {
    if (this.isRadXRole) {
      return this.chargingHistoryService.getChargingByMonthAll(year, month, filters).toPromise();
    }
    if (this.isCompanyRole) {
      return this.chargingHistoryService.getChargingByMonthForCompany(this.company_id, year, month, filters).toPromise();
    }
    if (this.isUserGroupRole && !this.isUserRole) {
      return this.chargingHistoryService.getChargingByMonthForUserGroup(this.usergroup_id, year, month, filters).toPromise();
    }
    if (this.isPartnerRole) {
      return this.chargingHistoryService.getChargingByMonthForPartner(this.partner_id, year, month, filters).toPromise();
    }
    if (this.isUserRole) {
      return this.chargingHistoryService.getChargingByMonthForCurrentUser(year, month, filters).toPromise();
    }
    return Promise.resolve({ chargingHistory: [], total: 0 });
  }

  // 🆕 Sjell TE GJITHA rreshtat e muajit + aplikon search filter (perdoret nga export).
  // Delegon ne fetchAllMonthRowsRaw + enrichRowsForExport (te njejta si onMonthChange).
  private async loadAllRowsForExport(): Promise<any[]> {
    const { year, month } = this.getSelectedYearMonth();
    const raw = await this.fetchAllMonthRowsRaw(year, month);
    const enriched = this.enrichRowsForExport(raw);
    return this.applySearchFilter(enriched);
  }

  async exportToPDF() {
    if (this.exportingInProgress) return;
    this.exportingInProgress = true;
    let allRows: any[];
    try {
      allRows = await this.loadAllRowsForExport();
    } catch (err) {
      logger.error('Export PDF — fetch failed:', err);
      this.exportingInProgress = false;
      return;
    }
    this.exportingInProgress = false;

    const doc = new jsPDF({ orientation: 'landscape' }); // Set landscape mode

    const tableData = allRows.map(chargingHistory => {
      const totalCost = parseFloat(chargingHistory?.total_cost) || 0;
      const idleFee = parseFloat(chargingHistory?.fullchargefeecost) || 0;
      const feePerMin = parseFloat(chargingHistory?.fullchargefeeperminute) || 0;
      const billableIdleMin = feePerMin > 0 ? Math.round(idleFee / feePerMin) : 0;
      const chargingCost = totalCost - idleFee < 0 ? 0 : totalCost - idleFee;
      return [
        chargingHistory?.charging_history_id || '',
        chargingHistory?.Charger?.charger_name || '',
        chargingHistory?.charging_history_date || '',
        chargingHistory?.strted_time || '',
        chargingHistory?.ended_time || '',
        chargingHistory?.charging_duration || '',
        chargingHistory?.total_energy || '',
        chargingCost.toFixed(2),
        billableIdleMin,
        feePerMin.toFixed(2),
        idleFee.toFixed(2),
        totalCost.toFixed(2),
        chargingHistory?.Company?.company_name || '',
        chargingHistory?.partner || '',
        chargingHistory?.userGroup || '',
        chargingHistory?.user || '',
        chargingHistory && chargingHistory.Card && chargingHistory.Card.serial_no ? chargingHistory.Card.serial_no : 'Remote Start',
      ];
    });

    autoTable(doc, {
      head: [['Charging History ID', 'Charger', 'Date', 'Started Time', 'Ended Time', 'Charging Duration', 'Total Energy',
        'Charging Cost', 'Idle Min', 'Fee per Minute', 'Idle Fee Cost', 'Total Cost',
        'Company Name', 'Partner Name', 'User Group Name', 'User Name', 'Card']],
      body: tableData
    });

    doc.save('chargingHistory.pdf');
  }

  // Export the relevant fields to Excel
  async exportToExcel() {
    if (this.exportingInProgress) return;
    this.exportingInProgress = true;
    let allRows: any[];
    try {
      allRows = await this.loadAllRowsForExport();
    } catch (err) {
      logger.error('Export Excel — fetch failed:', err);
      this.exportingInProgress = false;
      return;
    }
    this.exportingInProgress = false;

    const filteredData = allRows.map(chargingHistory => {
      const totalCost = Number(chargingHistory.total_cost) || 0;
      const idleFee = Number(chargingHistory.fullchargefeecost) || 0;
      const feePerMin = Number(chargingHistory.fullchargefeeperminute) || 0;
      const billableIdleMin = feePerMin > 0 ? Math.round(idleFee / feePerMin) : 0;
      const chargingCost = totalCost - idleFee < 0 ? 0 : totalCost - idleFee;
      return {
        charging_history_id: Number(chargingHistory.charging_history_id) || '',
        charger: chargingHistory.Charger.charger_name,
        charging_history_date: chargingHistory.charging_history_date,
        Started_time: chargingHistory.strted_time,
        Ended_time: chargingHistory.ended_time,
        charging_duration: chargingHistory.charging_duration,
        total_energy: Number(chargingHistory.total_energy),
        charging_cost: Number(chargingCost.toFixed(2)),
        idle_min: billableIdleMin,
        fee_per_minute: Number(feePerMin.toFixed(2)),
        idle_fee_cost: Number(idleFee.toFixed(2)),
        total_cost: totalCost,
        company_name: chargingHistory.Company.company_name,
        partner: chargingHistory.partner,
        userGroup: chargingHistory.userGroup,
        user: chargingHistory.user,
        card: chargingHistory.Card?.serial_no || 'Remote Start'
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Charging History': worksheet },
      SheetNames: ['Charging History']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'chargingHistory');
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  clearFromDateTime(event: Event): void {
    event.stopPropagation();
    this.selectedFromDate = '';
    this.selectedFromTime = '';
    // Reset to page 1 — filter change can shift total.
    this.currentOffset = 0;
    this.onMonthChange();
  }

  clearToDateTime(event: Event): void {
    event.stopPropagation();
    this.selectedToDate = '';
    this.selectedToTime = '';
    this.currentOffset = 0;
    this.onMonthChange();
  }

  // 🆕 Set me charging_history_id qe jane ne pending_fiscal_invoices (cron do provoje vete).
  // Mbushet ne ngOnInit nga GET /api/v1/retryInvoice/pending.
  pendingChargingIds: Set<number> = new Set();

  // 🆕 Retry BC invoice creation per kete charging session.
  // Buton-i shfaqet vetem per role COMPANY_ANALYST (+ admin variants).
  retryingInvoiceIds: Set<number> = new Set();   // mban id-te ne progres per spinner
  retryInvoice(row: any, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();   // mos navigo te detail page
      event.preventDefault();
    }
    const chargingId = row?.charging_id || row?.charging_history_id;
    if (!chargingId) {
      alert('Charging ID mungon — s\'mund te bej retry');
      return;
    }

    const ok = confirm(`A jeni i sigurte qe doni te tentoni krijimin/fiskalizimin e fatures ne BC per Charging ID ${chargingId}?`);
    if (!ok) return;

    this.retryingInvoiceIds.add(chargingId);
    this.chargingHistoryService.retryBCInvoice('charging', row.charging_id || chargingId).subscribe(
      (res: any) => {
        this.retryingInvoiceIds.delete(chargingId);
        if (res?.success) {
          // 🆕 Update row ne memorje me FISK numrin → butoni fshihet menjehere pa refresh tabele
          row.bc_invoice_number = res.invoiceNumber || 'OK';
          alert(`✓ Sukses!\n\nNumri i fatures: ${res.invoiceNumber || 'N/A'}\n\n${res.message || ''}`);
        } else {
          alert(`✗ Deshtoi:\n\n${res?.message || 'Unknown error'}`);
        }
      },
      (err: any) => {
        this.retryingInvoiceIds.delete(chargingId);
        const body = err?.error || err;
        alert(`✗ Deshtoi:\n\n${body?.message || err?.message || 'Unknown error'}\n\nDetaje: ${JSON.stringify(body?.details || {}, null, 2).substring(0, 300)}`);
      }
    );
  }

  isRetrying(row: any): boolean {
    const id = row?.charging_id || row?.charging_history_id;
    return this.retryingInvoiceIds.has(id);
  }

}


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';