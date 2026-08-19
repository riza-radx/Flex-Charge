import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";


@Component({
  selector: 'app-companycreatelocations',
  templateUrl: './companycreatelocations.component.html',
  styles: [
  ]
})
export class CompanycreatelocationsComponent {
  location: any = {
    locationName: '',
    address: '',
    city: '',
    country: '',
    latitude: null,
    longitude: null
  };

  constructor(private locationService: ChargerLocationService, private router: Router) { }

  onSubmit() {
    this.locationService.createChargerLocation(this.location).subscribe({
      next: (response) => {
        logger.log('Location created successfully:', response);
        // Navigate or show success message
        this.router.navigate(['/locations']);
      },
      error: (error) => {
        logger.error('Error creating location:', error);
      }
    });
  }

}
