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
    console.log('currency ID:', this.currencyId);
    console.log('currency Name:', this.currencyName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.currencyId = row.currency_id;
    this.currencyName = row.currency_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.currencyService.deleteCurrency(this.currencyId).subscribe({
      next: (response) => {
        console.log('Currency deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rates/currency']);
      },
      error: (error) => {
        console.error('Error deleting Currency:', error);
      }
    });
  }

  getCurrencyDetails(id: number): void {
    this.currencyService.getCurrency(id).subscribe({
      next: (response) => {
        this.currencyName = response.currency.currency_name;
        console.log('response:', response);
        console.log('currencyName:', this.currencyName);
      },
      error: (error) => {
        console.error('Error fetching currency details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/currency']);
  }
}
