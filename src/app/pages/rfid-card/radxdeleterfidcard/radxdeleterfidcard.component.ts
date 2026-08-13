import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from 'src/app/services/cardService/card.service';

@Component({
  selector: 'app-radxdeleterfidcard',
  templateUrl: './radxdeleterfidcard.component.html'
})
export class RadxdeleterfidcardComponent implements OnInit {
  cardId: number;
  cardSerial: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cardService: CardService
  ) { }

  ngOnInit(): void {
    this.cardId = this.route.snapshot.params['id'];
    this.getCardDetails(this.cardId);
    console.log('cardId ID:', this.cardId);
    console.log('cardSerial:', this.cardSerial);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.cardId = row.card_id;
    this.cardSerial = row.card.serial_no;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.cardService.deleteCard(this.cardId).subscribe({
      next: (response) => {
        console.log('Card deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rfid-cards/rfidcard']);
      },
      error: (error) => {
        console.error('Error deleting location:', error);
      }
    });
  }

  getCardDetails(id: number): void {
    this.cardService.getCard(id).subscribe({
      next: (response) => {
        this.cardSerial = response.card.serial_no;
        console.log('response:', response);
        console.log('cardSerial:', this.cardSerial);
      },
      error: (error) => {
        console.error('Error fetching location details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rfid-cards/rfidcard']);
  }

}
