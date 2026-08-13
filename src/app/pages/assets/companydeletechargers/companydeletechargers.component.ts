import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerService } from 'src/app/services/chargerService/charger.service';

@Component({
  selector: 'app-companydeletechargers',
  templateUrl: './companydeletechargers.component.html'
})
export class CompanydeletechargersComponent implements OnInit {
  chargerId: number;
  chargerName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chargerService: ChargerService
  ) { }

  ngOnInit(): void {
    this.chargerId = this.route.snapshot.params['id'];
    this.getChargerDetails(this.chargerId);
    console.log('Charger ID:', this.chargerId);
    console.log('Charger Name:', this.chargerName);
  }

  openDeletePopup(row: any): void {
    this.chargerId = row.charger_id;
    this.chargerName = row.charger_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.chargerService.deleteCharger(this.chargerId).subscribe({
      next: (response) => {
        console.log('Charger deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/assets/chargers']);
      },
      error: (error) => {
        console.error('Error deleting charger:', error);
      }
    });
  }

  getChargerDetails(id: number): void {
    this.chargerService.getCharger(id).subscribe({
      next: (response) => {
        this.chargerName = response.charger.charger_name;
        console.log('response:', response);
        console.log('Charger Name:', this.chargerName);
      },
      error: (error) => {
        console.error('Error fetching charger details:', error);
      }
    });
  }
  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/assets/chargers']);  // Navigate away after closing the popup
  }

}
