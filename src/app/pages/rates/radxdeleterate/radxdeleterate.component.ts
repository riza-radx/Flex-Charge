import { logger } from '@core/logger';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RateService } from 'src/app/services/rateService/rate.service';

@Component({
  selector: 'app-radxdeleterate',
  templateUrl: './radxdeleterate.component.html'
})
export class RadxdeleterateComponent implements OnInit {
  rateId: number;
  rateName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rateService: RateService
  ) { }

  ngOnInit(): void {
    this.rateId = this.route.snapshot.params['id'];
    this.getRateDetails(this.rateId);
    logger.log('rateId ID:', this.rateId);
    logger.log('rate Name:', this.rateName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.rateId = row.rate_id;
    this.rateName = row.rate_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.rateService.deleteRate(this.rateId).subscribe({
      next: (response) => {
        logger.log('rate deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rates/rate']);
      },
      error: (error) => {
        logger.error('Error deleting location:', error);
      }
    });
  }

  getRateDetails(id: number): void {
    this.rateService.getRate(id).subscribe({
      next: (response) => {
        this.rateName = response.rate.rate_name;
        logger.log('response:', response);
        logger.log('rateName:', this.rateName);
      },
      error: (error) => {
        logger.error('Error fetching location details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/rate']);
  }
}
