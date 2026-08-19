import { logger } from '@core/logger';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoService } from 'src/app/services/promoService/promo.service';

@Component({
  selector: 'app-radxdeletepromo',
  templateUrl: './radxdeletepromo.component.html'
})
export class RadxdeletepromoComponent implements OnInit {
  promoId: number;
  promoName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private promoService: PromoService
  ) { }

  ngOnInit(): void {
    this.promoId = this.route.snapshot.params['id'];
    this.getPromoDetails(this.promoId);
    logger.log('promoId ID:', this.promoId);
    logger.log('promo Name:', this.promoName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.promoId = row.promo_id;
    this.promoName = row.promo_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.promoService.deletePromo(this.promoId).subscribe({
      next: (response) => {
        logger.log('Promo deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rates/promo']);
      },
      error: (error) => {
        logger.error('Error deleting location:', error);
      }
    });
  }

  getPromoDetails(id: number): void {
    this.promoService.getPromo(id).subscribe({
      next: (response) => {
        this.promoName = response.promo.promo_name;
        logger.log('response:', response);
        logger.log('promoName:', this.promoName);
      },
      error: (error) => {
        logger.error('Error fetching location details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/promo']);
  }
}
