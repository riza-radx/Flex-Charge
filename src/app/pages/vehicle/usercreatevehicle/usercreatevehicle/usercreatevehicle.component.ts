import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicleService/vehicle.service';

@Component({
  selector: 'app-usercreatevehicle',
  templateUrl: './usercreatevehicle.component.html',
  styles: [
  ]
})
export class UsercreatevehicleComponent {
  vehicle: any = {
    vinCode: '',
    vehicleNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: null,
    userId: null,
    companyId: null,
    usergrId: null,
    createdTime: new Date().toISOString() // Set the current time
  };

  constructor(private vehicleService: VehicleService, private router: Router) { }

  onSubmit() {
    this.vehicleService.addVehicle(this.vehicle).subscribe({
      next: (response) => {
        logger.log('Vehicle created successfully:', response);
        // Navigate or show success message
        this.router.navigate(['/vehicles']);
      },
      error: (error) => {
        logger.error('Error creating vehicle:', error);
      }
    });
  }

}
