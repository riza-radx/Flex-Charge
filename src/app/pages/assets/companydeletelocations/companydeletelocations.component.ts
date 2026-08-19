import { logger } from '@core/logger';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerLocationService } from 'src/app/services/chargerLocationService/charger-location.service';

@Component({
  selector: 'app-companydeletelocations',
  templateUrl: './companydeletelocations.component.html'
})
export class CompanydeletelocationsComponent implements OnInit {
  locationId: number;
  locationName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: ChargerLocationService
  ) { }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['id'];
    this.getLocationDetails(this.locationId);
    logger.log('Charger ID:', this.locationId);
    logger.log('Charger Name:', this.locationName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.locationId = row.location_id;
    this.locationName = row.location_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.locationService.deleteChargerLocation(this.locationId).subscribe({
      next: (response) => {
        logger.log('Location deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/assets/locations']);
      },
      error: (error) => {
        logger.error('Error deleting location:', error);
      }
    });
  }

  getLocationDetails(id: number): void {
    this.locationService.getChargerLocation(id).subscribe({
      next: (response) => {
        this.locationName = response.location.location_name;
        logger.log('response:', response);
        logger.log('locationName:', this.locationName);
      },
      error: (error) => {
        logger.error('Error fetching location details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/assets/locations']);
  }
}
