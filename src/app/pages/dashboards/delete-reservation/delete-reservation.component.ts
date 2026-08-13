import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { ReservationService } from 'src/app/services/reservationService/reservation.service';

@Component({
  selector: 'app-delete-reservation',
  templateUrl: './delete-reservation.component.html'
})
export class DeleteReservationComponent {
  reservationId: any;
  ocppId : any;
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private chargerService: ChargerService
  ) { }

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('reservation_id'));
    this.ocppId = this.route.snapshot.paramMap.get('ocppId') || '';
    console.log('row reservation_id:', this.reservationId);
    console.log('row ocppId:', this.ocppId);
  }

  openDeletePopup(row: any): void {
    console.log('row reservation_id:', row);
    this.reservationId = row.reservation_id;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.chargerService.cancelReservation(this.ocppId , this.reservationId).subscribe({
      next: (response) => {
        console.log('Reservation canceled successfully:', response);
        this.closePopupHandler();
      },
      error: (error) => {
        console.error('Error deleting reservation:', error);
      }
    });
  }

  closePopupHandler(): void {
    this.isPopupVisible = false; // Hide the popup
    setTimeout(() => {
      this.router.navigate(['/monitoring/reservation']); // Ensure navigation happens after the popup is closed
    }, 300);
  }

}
