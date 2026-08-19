import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from 'src/app/services/currencyService/currency.service';

@Component({
  selector: 'app-radxupdatecurrency',
  templateUrl: './radxupdatecurrency.component.html',
  styles: [
  ]
})
export class RadxupdatecurrencyComponent implements OnInit {

  currencyForm: FormGroup;
  currencyId: number;

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currencyForm = this.fb.group({
      currencyName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currencyId = this.route.snapshot.params['id'];
    this.getCurrencyById(this.currencyId);
    logger.log('this.currencyId:', this.currencyId);
    // throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.currencyForm.invalid) {
      // If the form is invalid, mark all fields as touched to show error messages
      this.currencyForm.markAllAsTouched();
      return;
    }
    const currencyData = this.currencyForm.value;
    logger.log('Submitting currencyData:', currencyData);

    this.currencyService.updateCurrency(this.currencyId, currencyData).subscribe({
      next: (response) => {
        if (response) {
          logger.log('Currency  updated successfully:', response);
          this.router.navigate(['/rates/currency']);
        } else {
          logger.error('Failed to update currency:', response);
        }
      },
      error: (error) => {
        logger.error('Error updating currency:', error);
      }
    });
  }

  getCurrencyById(id: number): void {
    this.currencyService.getCurrency(id).subscribe({
      next: (response) => {
        logger.log('ID:', id);
        logger.log('API response:', response);
        const currency = response.currency;

        // Ensure the response data matches the form structure
        this.currencyForm.patchValue({
          currencyName: currency.currency_name
        });

      },
      error: (error) => {
        logger.error('Error fetching charger details:', error);
      }
    });
  }
}
