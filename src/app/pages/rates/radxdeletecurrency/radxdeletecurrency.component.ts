import { logger } from '@core/logger';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from 'src/app/services/currencyService/currency.service';

@Component({
  selector: 'app-radxdeletecurrency',
  templateUrl: './radxdeletecurrency.component.html'
})
export class RadxdeletecurrencyComponent implements OnInit {

  currencyId: number;
  currencyName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.currencyId = this.route.snapshot.params['id'];
    this.getCurrencyDetails(this.currencyId);
    logger.log('currency ID:', this.currencyId);
    logger.log('currency Name:', this.currencyName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.currencyId = row.currency_id;
    this.currencyName = row.currency_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.currencyService.deleteCurrency(this.currencyId).subscribe({
      next: (response) => {
        logger.log('Currency deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rates/currency']);
      },
      error: (error) => {
        logger.error('Error deleting Currency:', error);
      }
    });
  }

  getCurrencyDetails(id: number): void {
    this.currencyService.getCurrency(id).subscribe({
      next: (response) => {
        this.currencyName = response.currency.currency_name;
        logger.log('response:', response);
        logger.log('currencyName:', this.currencyName);
      },
      error: (error) => {
        logger.error('Error fetching currency details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/currency']);
  }
}
