import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ChargerStatusService } from 'src/app/services/chargerStatusService/charger-status.service';
// import { StationProfileService } from 'src/app/services/station-profile/station-profile.service';

@Component({
  selector: 'app-station-profile',
  templateUrl: './station-profile.component.html'
})
export class StationProfileComponent implements OnInit {
  chargers: any[] = [];
  isPopupVisible = false;
  chargerAddresses: any;

  constructor(
    // private stationProfileService: StationProfileService,
    private chargerStatusService: ChargerStatusService
  ) { }

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData(): void {
    // this.stationProfileService.getAllChargers().subscribe({
    //   next: (response) => {
    //     if (response && response.success) {
    //       this.chargers = response.chargers;
    //       this.fetchAddressesForChargers();
    //       this.fetchChargerStatuses(); 
    //     }
    //   },
    //   error: (err) => console.error('Error fetching chargers:', err)
    // });
  }

  // fetchAddressesForChargers(): void {
  //   this.chargers.forEach(charger => {
  //     this.stationProfileService.getchargerAdress(charger.charger_id).subscribe({
  //       next: (response) => {
  //         if (response && response.success) {
  //           charger.address = response.address;
  //           console.log("charger",charger)
  //         }
  //       },
  //       error: (err) => console.error('Error fetching charger locations:', err)
  //     });
  //   });
  // }

  fetchChargerStatuses(): void {
    this.chargers.forEach(charger => {
      this.chargerStatusService.getChargerStatusByCharger(charger.charger_id).subscribe({
        next: (response) => {
          if (response && response.success) {
            const status = response.charger_status[0];
            charger.real_time_status = status.real_time_status;
            charger.rated_power = status.rated_power;
            charger.online_time = status.online_time;
            charger.current_power = status.current_power;
            logger.log("Charger Status:", charger);
          }
        },
        error: (err) => logger.error('Error fetching charger status:', err)
      });
    });
  }


  showMoreDetails(): void {
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

}