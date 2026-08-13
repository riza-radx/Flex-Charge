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
    console.log('Charger ID:', this.vehicleId);
    console.log('vehicleVinCode:', this.vehicleVinCode);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.vehicleId = row.vehicle_id;
    this.vehicleVinCode = row.vin_code;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.vehicleService.deleteVehicle(this.vehicleId).subscribe({
      next: (response) => {
        console.log('Vehicle deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/assets/vehicle']);
      },
      error: (error) => {
        console.error('Error deleting Vehicle:', error);
      }
    });
  }

  getVehicleDetails(id: number): void {
    this.vehicleService.getVehicle(id).subscribe({
      next: (response) => {
        this.vehicleVinCode = response.vehicle.vin_code;
        console.log('response:', response);
        console.log('VehicleName:', this.vehicleVinCode);
      },
      error: (error) => {
        console.error('Error fetching Vehicle details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/assets/vehicle']);
  }
}
