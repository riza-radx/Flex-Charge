import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RateService } from 'src/app/services/rateService/rate.service';

@Component({
  selector: 'app-radxdeleterate',
  templateUrl: './radxdeleterate.component.html'
})
export class RadxdeleterateComponent implements OnInit {
  rateId: number;
  rateName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rateService: RateService
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
    this.rateService.deleteRate(this.rateId).subscribe({
      next: (response) => {
        console.log('rate deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rates/rate']);
      },
      error: (error) => {
        console.error('Error deleting location:', error);
      }
    });
  }

  getRateDetails(id: number): void {
    this.rateService.getRate(id).subscribe({
      next: (response) => {
        this.rateName = response.rate.rate_name;
        console.log('response:', response);
        console.log('rateName:', this.rateName);
      },
      error: (error) => {
        console.error('Error fetching location details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/rate']);
  }
}
