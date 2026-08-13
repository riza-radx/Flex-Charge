import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../../../../services/cardService/card.service'
import { RechargeService } from "../../../../services/rechargeService/recharge.service";
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-addradxrecharges',
  templateUrl: './addradxrecharges.component.html',
  styles: [
  ]
})
export class AddradxrechargesComponent {
  recharge = {
    amount: ''
  };

  constructor(
    private cardService: CardService,
    private rechargeService: RechargeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    this.rechargeService.addRecharge(this.recharge).subscribe(
      (response) => {
        console.log('Recharge added successfully:', response);
        // window.open(response.retreiveOrder, '_blank');
        this.router.navigate(['/profile']);  // Adjust the navigation as needed

      },
      (error) => {
        console.error('Error adding recharge:', error);
      }
    );
  }

}
