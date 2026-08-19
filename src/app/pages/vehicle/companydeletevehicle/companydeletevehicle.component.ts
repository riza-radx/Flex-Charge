import { logger } from '@core/logger';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicleService/vehicle.service';

@Component({
  selector: 'app-companydeletevehicle',
  templateUrl: './companydeletevehicle.component.html'
})
export class CompanydeletevehicleComponent implements OnInit {
  vehicleId: number;
  vehicleVinCode: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.params['id'];
    this.getVehicleDetails(this.vehicleId);
    logger.log('Charger ID:', this.vehicleId);
    logger.log('vehicleVinCode:', this.vehicleVinCode);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.vehicleId = row.vehicle_id;
    this.vehicleVinCode = row.vin_code;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.vehicleService.deleteVehicle(this.vehicleId).subscribe({
      next: (response) => {
        logger.log('Vehicle deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/assets/vehicle']);
      },
      error: (error) => {
        logger.error('Error deleting Vehicle:', error);
      }
    });
  }

  getVehicleDetails(id: number): void {
    this.vehicleService.getVehicle(id).subscribe({
      next: (response) => {
        this.vehicleVinCode = response.vehicle.vin_code;
        logger.log('response:', response);
        logger.log('VehicleName:', this.vehicleVinCode);
      },
      error: (error) => {
        logger.error('Error fetching Vehicle details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/assets/vehicle']);
  }
}
