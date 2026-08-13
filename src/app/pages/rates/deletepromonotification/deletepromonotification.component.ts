import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoService } from 'src/app/services/promoService/promo.service';

@Component({
  selector: 'app-deletepromonotification',
  templateUrl: './deletepromonotification.component.html'
})
export class DeletepromonotificationComponent implements OnInit {
  notificationId: number;
  notificationTitle: string = '';
  isPopupVisible: boolean = true;
  promo_id: number;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private promoService: PromoService
  ) { }

  ngOnInit(): void {
    this.notificationId = this.route.snapshot.params['id'];
    this.getNotificationDetails(this.notificationId);
    console.log('Notification ID:', this.notificationId);
  }

  getNotificationDetails(id: number): void {
    this.promoService.getPromoNotificationById(id).subscribe({
      next: (res: any) => {
        this.notificationTitle = res.promoNotification?.title || '';
        this.promo_id = res.promoNotification?.promo_id;
        console.log('Notification details:', res);
      },
      error: (err) => {
        console.error('Error fetching notification:', err);
      }
    });
  }

  confirmDelete(): void {
    this.promoService.deletePromoNotification(this.notificationId).subscribe({
      next: (res) => {
        console.log('Notification deleted:', res);
        this.closePopupHandler();
        this.router.navigate(['/rates/promo', this.promo_id]); // redirect tek promo details
      },
      error: (err) => {
        console.error('Error deleting notification:', err);
      }
    });
  }

  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/promo']);
  }
}
