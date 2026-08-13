import { Component } from '@angular/core';
import { CardService } from "../../../../services/cardService/card.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-companycreaterfidcard',
  templateUrl: './companycreaterfidcard.component.html',
  styles: [
  ]
})
export class CompanycreaterfidcardComponent {

  card = {
    serialNo: '',
    blockNo: '',
    balance: 0,
    userId: '',
    companyId: '',
    usergrId: '',
    status: '',
    is_distributor_card: false,
    distributor_name: ''
  };

  constructor(private cardService: CardService, private router: Router) {}

  onSubmit() {
    this.cardService.addCard(this.card).subscribe(
      response => {
        console.log('RFID Card created successfully', response);
        this.router.navigate(['/partners']);
      },
      error => {
        console.error('Error creating RFID Card', error);
        // Handle error response
      }
    );
  }

}
