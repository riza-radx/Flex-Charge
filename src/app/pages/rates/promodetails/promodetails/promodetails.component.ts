import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoService } from "../../../../services/promoService/promo.service";
// import { RateService } from "../../../services/rateService/rate.service";
// import { RatePerDaysService } from "../../../services/ratePerDaysService/rate-per-days.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}


@Component({
  selector: 'app-promodetails',
  templateUrl: './promodetails.component.html',
  styles: [
  ]
})
export class PromodetailsComponent implements OnInit {
  errorMessage: any;
  id: string;
  promo: any = {}; // Ensure this is an object
  // ratePerDays: any[] = [];
  tempRatePerDays: any[] = [];
  selected: any[] = [];
  entries: number = 10;
  promoId: number;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  activeTab: string = 'notifications';

  // Notifications
  promoNotifications: any[] = [];
  pagedNotifications: any[] = [];
  currentNotificationPage: number = 1;
  notificationItemsPerPage: number = 10;

  // User Offers
  userOffers: any[] = [];
  pagedUserOffers: any[] = [];
  currentUserOfferPage: number = 1;
  userOfferItemsPerPage: number = 10;

  notificationSearchTerm: string = '';
  userOfferSearchTerm: string = '';

  filteredNotifications: any[] = [];
  filteredUserOffers: any[] = [];
  constructor(
    private promoService: PromoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getPromo();
    this.loadPromoNotifications();
    this.loadUserOffers();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    // Handle row activation if needed
  }

  /** ---------------- PROMO ---------------- */
  getPromo() {
    this.promoService.getPromo(this.id).subscribe(
      (data) => {
        if (data && data.promo) {
          this.promo = data.promo;
          this.promoId = this.promo.promo_id;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  // loadPromoNotifications() {
  //   this.promoService.getPromoNotificationsByPromoId(this.id).subscribe({
  //     next: (res: any) => {
  //       if (res.success) {
  //         this.promoNotifications = res.promoNotifications;
  //         this.updatePagedNotifications();
  //       } else {
  //         this.promoNotifications = [];
  //         if (res.message) {
  //           console.warn(res.message); // mund ta shfaqësh në UI ose tooltip
  //         }
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching notifications:', err);
  //       this.promoNotifications = [];
  //     }
  //   });
  // }
  // get totalPages(): number {
  //   return Math.ceil(this.promoNotifications.length / this.itemsPerPage);
  // }
  // updatePagedNotifications() {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;
  //   this.pagedNotifications = this.promoNotifications.slice(start, end);
  // }
  // onPageChange(page: number) {
  //   this.currentPage = page;
  //   this.updatePagedNotifications();
  // }

  // loadUserOffers(): void {
  //   this.promoService.getUserOffersByPromoId(this.id).subscribe({
  //     next: (response) => {
  //       if (response.success && response.offers?.length > 0) {
  //         // Filtro / pastro të dhënat nëse duhet
  //         this.userOffers = response.offers.map((offer: any) => ({
  //           User: offer.User,
  //           BeforeRate: offer.BeforeRate,
  //           NewRate: offer.NewRate,
  //           end_date: offer.end_date,
  //           status: offer.status
  //         }));
  //       } else {
  //         this.userOffers = [];
  //       }
  //       console.log('✅ User Offers:', this.userOffers);
  //     },
  //     error: (error) => {
  //       console.error('❌ Error loading user offers:', error);
  //       this.userOffers = [];
  //     }
  //   });
  // }

  // setTab(tab: string) {
  //   this.activeTab = tab;
  //   if (tab === 'userOffers') {
  //     this.loadUserOffers();
  //   }
  // }

  /** ---------------- NOTIFICATIONS ---------------- */
  loadPromoNotifications() {
    this.promoService.getPromoNotificationsByPromoId(this.id).subscribe({
      next: (res: any) => {
        if (res.success && res.promoNotifications) {
          this.promoNotifications = res.promoNotifications;
        } else {
          this.promoNotifications = [];
        }
        // this.updatePagedNotifications();
        this.filterNotifications();
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.promoNotifications = [];
        // this.updatePagedNotifications();
      }
    });
  }
  filterNotifications() {
    const term = this.notificationSearchTerm.toLowerCase();
    this.filteredNotifications = this.promoNotifications.filter(n =>
      n.title?.toLowerCase().includes(term) ||
      n.body?.toLowerCase().includes(term) ||
      n.notification_type?.toLowerCase().includes(term)
    );
    this.updatePagedNotifications();
  }


  get totalNotificationPages(): number {
    return Math.ceil(this.promoNotifications.length / this.notificationItemsPerPage);
  }

  updatePagedNotifications() {
    const start = (this.currentNotificationPage - 1) * this.notificationItemsPerPage;
    const end = start + this.notificationItemsPerPage;
    this.pagedNotifications = this.filteredNotifications.slice(start, end);
  }

  onNotificationPageChange(page: number) {
    this.currentNotificationPage = page;
    this.updatePagedNotifications();
  }

  /** ---------------- USER OFFERS ---------------- */
  loadUserOffers() {
    this.promoService.getUserOffersByPromoId(this.id).subscribe({
      next: (response) => {
        if (response.success && response.offers?.length > 0) {
          this.userOffers = response.offers.map((offer: any) => ({
            User: offer.User,
            BeforeRate: offer.BeforeRate,
            NewRate: offer.NewRate,
            end_date: offer.end_date,
            status: offer.status
          }));
        } else {
          this.userOffers = [];
        }
        this.filterUserOffers();
        // this.updatePagedUserOffers();
      },
      error: (error) => {
        console.error('❌ Error loading user offers:', error);
        this.userOffers = [];
        // this.updatePagedUserOffers();
      }
    });
  }
  get totalUserOfferPages(): number {
    return Math.ceil(this.userOffers.length / this.userOfferItemsPerPage);
  }
  filterUserOffers() {
    const term = this.userOfferSearchTerm.toLowerCase();
    this.filteredUserOffers = this.userOffers.filter(o =>
      o.User?.username?.toLowerCase().includes(term) ||
      o.BeforeRate?.rate_name?.toLowerCase().includes(term) ||
      o.NewRate?.rate_name?.toLowerCase().includes(term) ||
      o.status?.toLowerCase().includes(term)
    );
    this.updatePagedUserOffers();
  }


  updatePagedUserOffers() {
    const start = (this.currentUserOfferPage - 1) * this.userOfferItemsPerPage;
    const end = start + this.userOfferItemsPerPage;
    this.pagedUserOffers = this.filteredUserOffers.slice(start, end);
  }

  onUserOfferPageChange(page: number) {
    this.currentUserOfferPage = page;
    this.updatePagedUserOffers();
  }

  // =================== TAB HANDLER ===================
  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'userOffers') {
      this.loadUserOffers();
    } else if (tab === 'notifications') {
      this.loadPromoNotifications();
    }
  }
}
