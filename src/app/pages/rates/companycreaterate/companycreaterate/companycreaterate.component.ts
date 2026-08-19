import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RateService } from "../../../../services/rateService/rate.service";

@Component({
  selector: 'app-companycreaterate',
  templateUrl: './companycreaterate.component.html',
  styles: [
  ]
})
export class CompanycreaterateComponent {
  rate = {
    name: '',
    companyId: '',
    defaultPrice: 0,
    percentage: 0,
    isDefault: false   // 🆕 Set si default per kompani (single-default i menaxhuar nga backend hook)
  };
  errorMessage: string | null = null;

  constructor(private rateService: RateService, private router: Router) {}

  onSubmit() {
    this.rateService.addRate(this.rate).subscribe(
      (response) => {
        // Redirect to the rate details page with the newly created rate ID
        this.router.navigate([`/rates/rate`]);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error creating rate:', error);
      }
    );
  }

}
