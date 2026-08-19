import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerService } from "../../../services/chargerService/charger.service";
import { PartnerService } from "../../../services/partnerService/partner.service";
import { PartnerMemberService } from "../../../services/partner-member.service";
import { ChargerLocationService } from "../../../services/chargerLocationService/charger-location.service";
import { UserService } from '../../../services/userService/user.service';
import { ReportService } from '../../../services/reportService/report.service';
import { CompanyService } from '../../../services/companyService/company.service';
import { DocumentService } from "../../../services/documentService/document.service";
import { CardService } from '../../../services/cardService/card.service';

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ChargingHistoryService } from 'src/app/services/chargingHistoryService/charging-history.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html'
})
export class PartnerDetailsComponent {
  chargers: any[] = [];
  partner: any[] = [];
  company: any;
  partnerMembers: any[] = [];
  chargerLocations: any[] = [];
  reports: any[] = [];
  documents: any[] = [];
  tempChargers = [];
  tempPartner = [];
  tempPartnerMembers = [];
  tempChargerLocations = [];
  tempReports = [];
  tempDocuments = [];
  // 🆕 Distributor cards (kartat qe kane distributor_id = partneri i hapur)
  distributorCards: any[] = [];
  tempDistributorCards: any[] = [];
  errorMessage: any;
  id: string;
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;
  chargingHistory: any = [];
  tempChargingHistory = [];
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
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
    private chargerService: ChargerService,
    private partnerService: PartnerService,
    private partnerMemberService: PartnerMemberService,
    private chargerLocationService: ChargerLocationService,
    private userService: UserService,
    private reportService: ReportService,
    private companyService: CompanyService,
    private chargingHistoryService: ChargingHistoryService,
    private documentService: DocumentService,
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;

    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    // this.loadCompanies();
    //   this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXRole = true;
            this.getChargers();
            this.getPartner();
            this.getChargerLocations();
            this.getPartnerMembers();
            this.getVReports();
            this.getchargingHistory(this.id);
            this.getDocuments(this.id);
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.getChargers();
            this.getPartner();
            this.getChargerLocations();
            this.getPartnerMembers();
            this.getVReports();
            this.getchargingHistory(this.id);
            this.getDocuments(this.id);
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.getChargers();
            this.getPartner();
            this.getChargerLocations();
            this.getPartnerMembers();
            this.getVReports();
            this.getchargingHistory(this.id);
            this.getDocuments(this.id);
            this.getDistributorCards(this.id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.getChargers();
            this.getPartner();
            this.getChargerLocations();
            this.getPartnerMembers();
            this.getVReports();
            this.getchargingHistory(this.id);
            this.getDocuments(this.id);
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getChargers();
            this.getPartner();
            this.getChargerLocations();
            this.getPartnerMembers();
            this.getVReports();
            this.getchargingHistory(this.id);
            this.getDocuments(this.id);
            this.getDistributorCards(this.id);
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
    // this.getPartners()
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }


  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  openDocument(row: any) {
    const documentUrl = row.file_path;
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      logger.error('Document URL is not available');
    }
  }

  onActivateDoc(event) {
    if (event.type === 'dblclick') {
      this.openDocument(event.row);
    }
  }

  filterMemberTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempPartnerMembers = [...this.partnerMembers];
      return;
    }

    this.tempPartnerMembers = this.partnerMembers.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  filterChargerLocationsTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempChargerLocations = [...this.chargerLocations];
      return;
    }

    this.tempChargerLocations = this.chargerLocations.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  filterReportsTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempReports = [...this.reports];
      return;
    }

    this.tempReports = this.reports.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  filterChargersTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempChargers = [...this.chargers];
      return;
    }

    this.tempChargers = this.chargers.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  filterDocumentsTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      // If the search input is cleared, reset tempDocuments to original documents
      this.tempDocuments = [...this.documents];
      return;
    }

    this.tempDocuments = this.documents.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  onActivate(event) {
    this.activeRow = event.row;
    if (event.type === 'click') {
      if (this.activeRow.reports_id) {
        this.router.navigate([`/reports/financial/${this.activeRow.reports_id}`]);
      } else if (this.activeRow.card_id) {
        this.router.navigate([`/rfid-cards/rfidcard/${this.activeRow.card_id}`]);
      } else if (this.activeRow.user_id) {
        this.router.navigate([`/users/user/${this.activeRow.user_id}`]);
      } else if (this.activeRow.charger_id) {
        this.router.navigate([`/assets/chargers/${this.activeRow.charger_id}`]);
      } else if (this.activeRow.location_id) {
        this.router.navigate([`/assets/locations/${this.activeRow.location_id}`]);
      }
      logger.log('activeRow', this.activeRow);
    }
  }

  getDocuments(id: string) {
    this.documentService.getDocumentByPartner(id).subscribe(
      (data: any) => {
        logger.log(data);
        if (data && Array.isArray(data.documents)) {
          this.documents = data.documents;
          this.tempDocuments = [...this.documents];
        } else {
          logger.error('Expected an array but got:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // getChargers() {
  //   this.chargerService.getChargerByPartner(this.id).subscribe(
  //     (data) => {
  //       this.chargers = data;
  //       this.tempChargers = [...this.chargers];
  //       console.log(data);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }
  // getChargerLocations() {
  //   this.chargerLocationService.getChargerLocationByPartner(this.id).subscribe(
  //     (data) => {
  //       this.chargerLocations = data;
  //       this.tempChargerLocations = [...this.chargers];
  //       console.log(data);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }

  // getPartner() {
  //   this.partnerService.getPartner(this.id).subscribe(
  //     (data) => {
  //       this.partner = data;
  //       this.tempPartner = [...this.partner];
  //       console.log(data);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }
  // getPartnerMembers() {
  //   this.partnerMemberService.getPartnerMemberByPartner(this.id).subscribe(
  //     (data) => {
  //       this.partnerMembers = data;
  //       this.tempPartnerMembers = [...this.partnerMembers];
  //       console.log(data);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }
  getVReports() {
    this.reportService.getAllReportByPartner(this.id).subscribe(
      (data: any) => {
        logger.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.report is an array
          this.reports = data.reports;
        } else if (data && data.reports && typeof data.reports === 'object') {
          // If data.report is a single object
          this.reports = [data.reports];
        } else {
          logger.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getChargers() {
    this.chargerService.getChargerByPartner(this.id).subscribe(
      (data) => {
        this.chargers = data.charger;
        this.tempChargers = [...this.chargers];
        // if (Array.isArray(data)) {
        // } else {
        //   console.error("Chargers data is not an array:", data);
        // }
        logger.log(data);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // getChargerLocations() {
  //   this.chargerLocationService.getChargerLocationByPartner(this.id).subscribe(
  //     (data) => {
  //       if (Array.isArray(data)) {
  //         this.chargerLocations = data;
  //         this.tempChargerLocations = [...this.chargerLocations];
  //       } else {
  //         console.error("Charger locations data is not an array:", data);
  //       }
  //       console.log(data);
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }

  getChargerLocations() {
    this.chargerLocationService.getChargerLocationByPartner(this.id).subscribe(
      (data) => {
        if (data && Array.isArray(data.location)) {
          this.chargerLocations = data.location;
          this.tempChargerLocations = [...this.chargerLocations];
        } else {
          logger.error("Charger locations data is not an array:", data);
        }
        logger.log(data);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getPartner() {
    this.partnerService.getPartner(this.id).subscribe(
      (data) => {
        this.partner = data;
        logger.log(data);
        this.getCompany(data.partner.company_id)
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data) => {
        this.company = data.company.company_name;
        logger.log(data);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // getPartnerMembers() {
  //   this.partnerMemberService.getPartnerMemberByPartner(this.id).subscribe(
  //     // (data) => {
  //     //   if (Array.isArray(data)) {
  //     //     this.partnerMembers = data;
  //     //     this.tempPartnerMembers = [...this.partnerMembers];
  //     //   } else {
  //     //     console.error("Partner members data is not an array:", data);
  //     //   }
  //     //   console.log(data);
  //     // },
  //     async (data: any) => {
  //       if (data && Array.isArray(data.company_member)) {
  //         this.tempPartnerMembers = await Promise.all(data.partnerMember.map(async (member: any) => {
  //           const userResponse = await this.userService.getUserById(member.user_id).toPromise();
  //           const user = userResponse.user; // Access the user from the response
  //           // Combine member and user into a single object
  //           return {
  //             ...member,
  //             user: user // Directly include the user data
  //           };
  //         }));
  //       } else {
  //         console.error('Expected an array but got:', data);
  //         this.tempPartnerMembers = [];
  //       }
  //       console.log(this.tempPartnerMembers);
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  getPartnerMembers() {
    this.partnerMemberService.getPartnerMemberByPartner(this.id).subscribe(
      async (data: any) => {
        logger.log(data);
        if (data && Array.isArray(data.partnerMember)) {
          this.tempPartnerMembers = await Promise.all(data.partnerMember.map(async (member: any) => {
            const userResponse = await this.userService.getUserById(member.user_id).toPromise();
            const user = userResponse.user; // Extract the user data
            // Combine member and user into a single object
            return {
              ...member,
              user: user // Attach the user data
            };
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.tempPartnerMembers = [];
        }
        logger.log(this.tempPartnerMembers);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log('Error fetching partner members:', error);
      }
    );
  }

  getchargingHistory(id: string) {
    this.chargingHistoryService.getChargingByPartner(id).subscribe(
      (data: any) => {
        logger.log(data);
        if (data && Array.isArray(data.chargingHistory)) {
          this.chargingHistory = data.chargingHistory;
          this.tempChargingHistory = [...this.chargingHistory];
        } else {
          logger.error('Expected an array but got:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // 🆕 Sjell kartat qe kane distributor_id te barabarte me partnerId qe po shohim.
  // Thirret vetem per COMPANY_ADMIN — endpoint-i backend perdor ownership check.
  getDistributorCards(partnerId: string) {
    this.cardService.getCardByDistributor(partnerId).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.card)) {
          this.distributorCards = data.card;
          this.tempDistributorCards = [...this.distributorCards];
        } else {
          this.distributorCards = [];
          this.tempDistributorCards = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  filterDistributorCardsTable($event: any) {
    const val = ($event.target.value || '').toLowerCase();
    if (!val) {
      this.tempDistributorCards = [...this.distributorCards];
      return;
    }
    this.tempDistributorCards = this.distributorCards.filter((d) =>
      Object.keys(d).some(k => typeof d[k] === 'string' && d[k].toLowerCase().includes(val))
    );
  }

  // 🆕 Helper — kthene emrin e distributorit ne format te lexueshem per export
  private formatDistributorNameForExport(card: any): string {
    if (!card?.is_distributor_card) return '';
    return card.distributor_name || '(pa emer)';
  }

  private toBool(v: any): boolean {
    return v === true || v === 1 || v === '1' || v === 'true';
  }

  private formatSaleStatusForExport(card: any): string {
    return this.toBool(card?.is_sold) ? 'Sold' : 'Not Sold';
  }

  private formatSoldAtForExport(card: any): string {
    if (!this.toBool(card?.is_sold) || !card?.sold_at) return '';
    try { return new Date(card.sold_at).toLocaleString('en-GB'); } catch { return String(card.sold_at); }
  }

  private buildDistributorCardsExportRows() {
    return (this.tempDistributorCards || []).map(card => ({
      'Block Number': card?.block_no || '',
      'Serial Number': card?.serial_no || '',
      'Status': card?.status || '',
      'Balance': card?.balance != null ? Number(card.balance).toFixed(2) : '',
      'Company': card?.company_name || card?.company?.company_name || '',
      'User Group': card?.usergr_name || card?.userGroup?.usergr_name || '',
      'User': card?.username || card?.user?.username || '',
      'Expiry Date': card?.expiry_date ? new Date(card.expiry_date).toLocaleDateString() : '',
      'Created At': card?.created_time ? new Date(card.created_time).toLocaleDateString() : '',
      'Created By': card?.madeBy || '',
      'Modified By': card?.modifiedBy || '',
      'Distributor Name': this.formatDistributorNameForExport(card),
      'Sale Status': this.formatSaleStatusForExport(card),
      'Sold At': this.formatSoldAtForExport(card),
      'Sold To': card?.sold_to_user_name || '',
      'Sold Amount (ALL)': card?.sold_amount != null ? Number(card.sold_amount).toFixed(2) : ''
    }));
  }

  /** 🆕 Export Distributor Cards → PDF (landscape, te gjitha fushat e tabeles) */
  exportDistributorCardsPDF(): void {
    if (!this.tempDistributorCards || this.tempDistributorCards.length === 0) return;
    const rows = this.buildDistributorCardsExportRows();
    const headers = Object.keys(rows[0]);
    const body = rows.map(r => headers.map(h => (r as any)[h] || ''));

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50);
    doc.text('Distributor Cards', 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(100);
    const partnerName = (this as any).partner?.partner_name || (this as any).partners?.[0]?.partner_name || '';
    doc.text(`Partner: ${partnerName}`, 14, 21);
    doc.text(`Gjeneruar: ${new Date().toLocaleString('en-GB')}`, 14, 26);

    autoTable(doc, {
      startY: 30,
      head: [headers],
      body,
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [127, 188, 66], textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { left: 5, right: 5 }
    });
    doc.save(`distributor_cards_${new Date().getTime()}.pdf`);
  }

  /** 🆕 Export Distributor Cards → Excel (te gjitha fushat e tabeles) */
  exportDistributorCardsExcel(): void {
    if (!this.tempDistributorCards || this.tempDistributorCards.length === 0) return;
    const rows = this.buildDistributorCardsExportRows();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    const cols = Object.keys(rows[0]).map(k => ({ wch: Math.max(k.length + 2, 14) }));
    (worksheet as any)['!cols'] = cols;
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Distributor Cards': worksheet },
      SheetNames: ['Distributor Cards']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, `distributor_cards_${new Date().getTime()}.xlsx`);
  }

}

