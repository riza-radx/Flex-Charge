import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from "../../../../services/cardService/card.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { UserService } from 'src/app/services/userService/user.service';
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
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-radxrfidcard',
  templateUrl: './radxrfidcard.component.html',
  styles: [
  ]
})
export class RadxrfidcardComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  // Variables for filters
  companies: any[] = [];
  userGroups: any[] = [];
  users: any[] = [];
  currentMonthCountEntry: number = 0;
  selectedCompany: string = '';
  selectedUserGroup: string = '';
  selectedUser: string = '';
  selectedCardStatus: string[] = [];
  expiryFrom: string = '';
  expiryTo: string = '';
  exactExpiryDate: string = '';
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

  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  company_id: any;
  user_id: any;
  usergr_id: any;
  partner_id: any;
  isAble: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  filter$ = new Subject<string>();
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
    private cardService: CardService,
    private router: Router,
    private companyService: CompanyService,
    private companyMemberService: CompanyMemberService,
    private usergroupService: UserGroupService,
    private userGroupMembersService: UserGroupMembersService,
    private partnerMemberService: PartnerMemberService,
    private userService: UserService,

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
  // filterTable($event: any) {
  //   const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

  //   if (!val) {
  //     // If the search input is cleared, reset temp to original rows
  //     this.temp = [...this.rows];
  //     return;
  //   }

  //   this.temp = this.rows.filter((d) => {
  //     // Check if any property in the object matches the search value
  //     return Object.keys(d).some(key => {
  //       if (typeof d[key] === 'string') {
  //         return d[key].toLowerCase().includes(val); // Check if the property contains the search value
  //       }
  //       return false; // Ignore non-string properties
  //     });
  //   });
  // }

  // filterTable(val: string) {
  //   if (!val) {
  //     this.temp = [...this.rows];  // Reset to original data if input is empty
  //     return;
  //   }

  //   this.temp = this.rows.filter((d) => {
  //     return Object.keys(d).some((key) => {
  //       if (typeof d[key] === 'string') {
  //         return d[key].toLowerCase().includes(val.toLowerCase());
  //       }
  //       return false;
  //     });
  //   });
  // }
  filterTable(val: string) {
    if (!val) {
      this.temp = [...this.rows];  // Reset to original data
      return;
    }

    const searchVal = val.toLowerCase();

    this.temp = this.rows.filter((row) => {
      return Object.keys(row).some((key) => {
        const value = row[key];
        return value !== null && value !== undefined &&
          value.toString().toLowerCase().includes(searchVal);
      });
    });
  }
  onSearchInput($event: any) {
    const val = $event.target.value;
    this.filter$.next(val);  // Push the value to the Subject for debouncing
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // this.activeRow = event.row;
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/rfid-cards/rfidcard/${this.activeRow.card_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.filter$
      .pipe(
        debounceTime(300), // Wait 300ms after the last keystroke
        distinctUntilChanged() // Avoid processing the same value multiple times
      )
      .subscribe((val) => {
        this.filterTable(val);  // Call the filter function with the value
      });
    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergr_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.getRFIDCards();
            this.loadAllCompanies();
            this.loadAllUserGroups();
            this.loadAllUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.isAble = true;
            this.getRFIDCards();
            this.loadAllCompanies();
            this.loadAllUserGroups();
            this.loadAllUsers();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.isAble = true;
            this.loadCompanyMembers(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.getRFIDCardsByCompany();
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true;
            this.isAble = true;
            this.loadCompanyMembers(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.getRFIDCardsByCompany();
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true;
            this.isAble = true;
            this.loadCompanyMembers(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.getRFIDCardsByCompany();
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true;
            this.isAble = true;
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true;
            this.isAble = true;
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true;
            this.isAble = true;
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyRole = true;
            this.isCompanyAnalyst = true;
            this.isCompanyRole = true;
            //  this.isAble = true;
            this.loadCompanyMembers(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.getRFIDCardsByCompany();
            break;
          case 'USER_GROUP_ADMIN':
            this.isAble = true;
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.loadUsersByUserGroup(this.usergr_id);
            this.getRFIDCardsByUserGroup();
            break;
          case 'USER_GROUP_MODERATOR':
            this.isAble = true;
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.loadUsersByUserGroup(this.usergr_id);
            this.getRFIDCardsByUserGroup();
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            this.isAble = false;
            this.loadUsersByUserGroup(this.usergr_id);
            this.getRFIDCardsByUser();
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.isAble = false;
            this.loadAllCompanies();
            this.loadUsersByPartner(this.partner_id);
            // this.getPartnerMembers(partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isUserRole = true;
            this.isAble = false;
            this.isUser = true;
            this.getRFIDCardsByUser();
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
    // this.getRFIDCards()
  }

  fetchCurrentMonthCount() {
    this.cardService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        console.error('Error fetching vehicle count:', error);
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
        console.log(error);
      }
    );
  }

  // Load user groups for dropdown
  loadAllUserGroups() {
    this.usergroupService.getAllUserGroups().subscribe(
      (data) => {
        this.userGroups = data.userGroup;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUsersByUserGroup(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      (data) => {
        console.log(data);

        // Ensure that data contains the company_member array
        if (data && Array.isArray(data.userGroupMembers)) {
          // Reset the users array
          this.users = [];

          // Iterate over company_member array and push the `User` objects to the `users` array
          data.userGroupMembers.forEach((member) => {
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

  loadUsersByPartner(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
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

  // Load users for dropdown
  loadAllUsers() {
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
  // Load user groups for dropdown
  loadUserGroupsByCompany(companyId: number) {
    this.usergroupService.getUserGroupByCompany(companyId).subscribe(
      (data: any) => {
        this.userGroups = data.userGroup;
        console.log('Companies:', this.userGroups);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  // Load users for dropdown
  loadCompanyMembers(companyId: number) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        this.users = data.users;
      },
      (error) => {
        console.error('Error fetching company members:', error);
      }
    );
  }

  getRFIDCards() {
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

    this.cardService.getAllCards(filters).subscribe(
      (data) => {
        // console.log(" filters", filters)
        this.rows = data.cards;
        // console.log("data.cards , filters", data.cards , filters)
        this.temp = [...this.rows];
        // console.log(this.rows);
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getRFIDCardsByCompany() {
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

    if (this.selectedCardStatus && this.selectedCardStatus.length > 0) {
      filters.status = this.selectedCardStatus;
    }
    if (this.expiryFrom) {
      filters.expiry_from = this.expiryFrom;
    }
    if (this.expiryTo) {
      filters.expiry_to = this.expiryTo;
    }
    if (this.exactExpiryDate) {
      filters.expiry_date = this.exactExpiryDate;
    }

    this.cardService.getCardByCompany(this.company_id, filters).subscribe(
      (data) => {
        // console.log("data.cards", data)
        this.rows = data.card;
        this.temp = [...this.rows];
        // console.log(this.rows);
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }



  getRFIDCardsByUserGroup() {
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
    this.cardService.getCardByUserGroup(this.usergr_id, filters).subscribe(
      (data) => {
        this.rows = data.card;
        // console.log("data.cards", data.card)
        this.temp = [...this.rows];
        // console.log(this.rows);

        // });
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getRFIDCardsByUser() {
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
    this.cardService.getCardUser(this.user_id, filters).subscribe(
      (data) => {
        // console.log(data)
        this.rows = data.card;
        // console.log("data.cards", data.card)
        this.temp = [...this.rows];
        // console.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  // Export the relevant fields to PDF
  // Helper — kthene emrin e distributorit ne format te lexueshem per export
  private formatDistributorName(card: any): string {
    if (!card?.is_distributor_card) return '';
    return card.distributor_name || '(pa emer)';
  }

  private formatMultipleSession(card: any): string {
    return card?.multiple_charging_session === 'true' ? 'Yes' : 'No';
  }

  private toBool(v: any): boolean {
    return v === true || v === 1 || v === '1' || v === 'true';
  }

  private formatSaleStatus(card: any): string {
    if (!card?.is_distributor_card) return '';
    return this.toBool(card?.is_sold) ? 'Sold' : 'Not Sold';
  }

  private formatSoldAt(card: any): string {
    if (!this.toBool(card?.is_sold) || !card?.sold_at) return '';
    try { return new Date(card.sold_at).toLocaleString('en-GB'); } catch { return String(card.sold_at); }
  }

  // 🆕 Export me te gjitha fushat qe shfaqen te tabela.
  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const tableData = this.temp.map(card => [
      card?.block_no || '',
      card?.serial_no || '',
      card?.status || '',
      this.formatMultipleSession(card),
      card?.company_name || card?.company?.company_name || '',
      card?.usergr_name || card?.userGroup?.usergr_name || '',
      card?.username || card?.user?.username || '',
      card?.madeBy || '',
      card?.modifiedBy || '',
      card?.expiry_date ? new Date(card.expiry_date).toLocaleDateString() : '',
      card?.created_time ? new Date(card.created_time).toLocaleDateString() : '',
      this.formatDistributorName(card),
      this.formatSaleStatus(card),
      this.formatSoldAt(card),
      card?.sold_to_user_name || '',
      card?.sold_amount != null ? Number(card.sold_amount).toFixed(2) : ''
    ]);

    autoTable(doc, {
      head: [['Block Number', 'Serial Number', 'Status', 'Multiple Session', 'Company', 'User Group', 'User', 'Created By', 'Modified By', 'Expiry Date', 'Created At', 'Distributor Name', 'Sale Status', 'Sold At', 'Sold To', 'Sold Amount (ALL)']],
      body: tableData,
      margin: { left: 5, right: 5 },
      styles: { fontSize: 6, cellPadding: 1.2 },
      headStyles: { fillColor: [127, 188, 66], textColor: 255, fontSize: 7 },
      alternateRowStyles: { fillColor: [248, 249, 250] }
    });

    doc.save('rfid_cards_' + new Date().getTime() + '.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    const filteredData = this.temp.map(card => ({
      'Block Number': card?.block_no || '',
      'Serial Number': card?.serial_no || '',
      'Status': card?.status || '',
      'Multiple Session': this.formatMultipleSession(card),
      'Company': card?.company_name || card?.company?.company_name || '',
      'User Group': card?.usergr_name || card?.userGroup?.usergr_name || '',
      'User': card?.username || card?.user?.username || '',
      'Created By': card?.madeBy || '',
      'Modified By': card?.modifiedBy || '',
      'Expiry Date': card?.expiry_date ? new Date(card.expiry_date).toLocaleDateString() : '',
      'Created At': card?.created_time ? new Date(card.created_time).toLocaleDateString() : '',
      'Distributor Name': this.formatDistributorName(card),
      'Sale Status': this.formatSaleStatus(card),
      'Sold At': this.formatSoldAt(card),
      'Sold To': card?.sold_to_user_name || '',
      'Sold Amount (ALL)': card?.sold_amount != null ? Number(card.sold_amount).toFixed(2) : ''
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    // Auto-adjust column widths
    const cols = Object.keys(filteredData[0] || {}).map(k => ({ wch: Math.max(k.length + 2, 14) }));
    (worksheet as any)['!cols'] = cols;
    const workbook: XLSX.WorkBook = {
      Sheets: { 'RFID Cards': worksheet },
      SheetNames: ['RFID Cards']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'rfid_cards');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';