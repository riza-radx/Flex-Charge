import { Component } from '@angular/core';
import { PromoService } from "../../../../services/promoService/promo.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-companycreatepromo',
  templateUrl: './companycreatepromo.component.html',
  styles: [
  ]
})
export class CompanycreatepromoComponent {
   promo = {
    promoName: '',
    promoCode: '',
    percentage: 0,
    amount: 0,
    companyId: '',
    isEnabled: false
  };
  useAmount: boolean = false;

  constructor(private promoService: PromoService, private router: Router) {}

  onSubmit() {
    this.promoService.addPromo(this.promo).subscribe(
      (response) => {
        console.log('Promo created successfully', response);
        this.router.navigate(['/promos']);  // Redirect to promos list or another page
      },
      (error) => {
        console.error('Error creating promo', error);
      }
    );
  }

  toggleUseAmount() {
    if (this.useAmount) {
      this.promo.percentage = 0;  // Clear percentage if using amount
    } else {
      this.promo.amount = 0;  // Clear amount if using percentage
    }
  }

}
