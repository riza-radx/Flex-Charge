import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatePerDaysService } from 'src/app/services/ratePerDaysService/rate-per-days.service';

@Component({
  selector: 'app-deleterateperdays',
  templateUrl: './deleterateperdays.component.html',
  styles: [
  ]
})
export class DeleterateperdaysComponent implements OnInit {
  rateId: number;
  id: number;
  rateName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ratePerDaysService: RatePerDaysService
  ) { }

  ngOnInit(): void {
    this.rateId = this.route.snapshot.params['id'];
    this.getRateDetails(this.rateId);
    console.log('rateId ID:', this.rateId);
    console.log('rate Name:', this.rateName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.rateId = row.rate_id;
    this.rateName = row.rate_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.ratePerDaysService.deleteRatePerDay(this.rateId).subscribe({
      next: (response) => {
        console.log('rate deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate([`/rates/rate/${this.id}`]);
      },
      error: (error) => {
        console.error('Error deleting location:', error);
      }
    });
  }

  getRateDetails(id: number): void {
    this.ratePerDaysService.getRatePerDay(id).subscribe({
      next: (response) => {
        this.id = response.ratePerDay.rate_id;
        console.log('response:', response);
        console.log('Id:', this.id);
      },
      error: (error) => {
        console.error('Error fetching location details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    // this.router.navigate(['/rates/rate']); 
  }
}