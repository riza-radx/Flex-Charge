import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyService } from 'src/app/services/currencyService/currency.service';

@Component({
  selector: 'app-companycreatecurrency',
  templateUrl: './companycreatecurrency.component.html',
  styles: [
  ]
})
export class CompanycreatecurrencyComponent {
  currency = {
    currencyName: ''
  };

  constructor(private currencyService: CurrencyService, private router: Router) {}

  onSubmit() {
    this.currencyService.addCurrency(this.currency).subscribe(
      (response) => {
        logger.log('Currency created successfully:', response);
        this.router.navigate(['/currencies']);  // Adjust the navigation as needed
      },
      (error) => {
        logger.error('Error creating currency:', error);
      }
    );
  }

}
