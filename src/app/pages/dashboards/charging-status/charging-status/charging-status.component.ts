import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ChargingStatusService } from 'src/app/services/chargingStatusService/charging-status.service';

@Component({
  selector: 'app-charging-status',
  templateUrl: './charging-status.component.html'
})
export class ChargingStatusComponent  implements OnInit {
  chargings: any[] = []; // Store all charging records
  userNames: { [key: number]: string } = {}; // Store user names with charging IDs as keys
  cardSerial: string[] = [];// Store card serial with charging IDs as keys
  chargingTimes: { charging_id: number; started_time: Date }[] = [];
  private intervalId: any; // Store the interval ID for clearings
  chargingDetails: any[] = [];

  constructor(private chargingStatusService: ChargingStatusService
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
    this.startTimeUpdate();
    this.fetchAllChargingDetails();
}

ngOnDestroy(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId); // Clear the interval when component is destroyed
  }
}

fetchAllData(): void {
  this.chargingStatusService.getAllChargings().subscribe({
    next: (response) => {
      if (response.success) {
        this.chargings = response.charging;
        this.fetchUserNames();
        this.fetchCardSerial();
        this.fetchCardSerial();
        this.fetchChargingTimes();
        // console.log('Charging records fetched successfully:', this.chargings);
        // console.log('cardSerial :', this.cardSerial);
      } else {
        logger.error('Error fetching charging records:', response.message);
      }
    },
    error: (err) => logger.error('Error fetching charging records:', err)
  });
}

fetchUserNames(): void {
  this.chargingStatusService.getUserNamesForAllChargings(this.chargings).subscribe({
    next: (names) => this.userNames = names,
    error: (err) => logger.error('Error fetching user names:', err)
  });
}

fetchCardSerial(): void {
  this.chargings.forEach((charging, index) => {
    this.chargingStatusService.getCardSerialByChargingId(charging.charging_id).subscribe({
      next: (serial) => {
        this.cardSerial[index] = serial; // Ensure this.cardSerial is an array
      },
      error: (err) => logger.error('Error fetching card serial:', err)
    });
  });
}

// fetchChargingTimes(): void {
//   this.chargingStatusService.getAllChargingTimes().subscribe({
//     next: (data) => {
//       if (data.success) {
//         this.chargingTimes = data.chargingTimes;
//         console.log('fetchChargingTimes alone method', this.chargingTimes)
//       } else {
//         console.error('Error fetching charging times:', data.message);
//       }
//     },
//     error: (err) => console.error('Error fetching charging times:', err)
//   });
// }
fetchChargingTimes(): void {
  this.chargingStatusService.getAllChargingTimes().subscribe({
    next: (data) => {
      if (data.success) {
        this.chargingTimes = data.chargingTimes.map((charging: any) => ({
          charging_id: charging.charging_id,
          started_time: new Date(charging.strted_time)
        }));
      } else {
        logger.error('Error fetching charging times:', data.message);
      }
    },
    error: (err) => logger.error('Error fetching charging times:', err)
  });
}

// getTimeDifference(chargingId: number): string | null {
//   const chargingTime = this.chargingTimes.find(time => time.charging_id === chargingId);
//   return chargingTime ? chargingTime.time_difference : null;
// }

startTimeUpdate(): void {
  this.intervalId = setInterval(() => {
    this.chargingTimes = this.chargingTimes.map(charging => ({
      ...charging,
      time_difference: this.calculateTimeDifference(charging.started_time)
    }));
  }, 1000); // Update every second
}

calculateTimeDifference(startTime: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(startTime).getTime();
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
  return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
}

pad(value: number): string {
  return value.toString().padStart(2, '0');
}

fetchAllChargingDetails(): void {
  this.chargingStatusService.getAllChargingDetails().subscribe({
    next: (response) => {
      if (response.success) {
        this.chargingDetails = response.chargings;
        // console.log('this.chargingDetails', this.chargingDetails);
      } else {
        logger.error('Error fetching charging details:', response.message);
      }
    },
    error: (err) => logger.error('Error fetching charging details:', err)
  });
}

getChargerName(chargingId: number): string {
  const detail = this.chargingDetails.find(d => d.charging_id === chargingId);
  return detail ? detail.Charger.charger_name : 'N/A';
}

getConnectorName(chargingId: number): string {
  const detail = this.chargingDetails.find(d => d.charging_id === chargingId);
  return detail ? detail.Connector.connector_name : 'N/A';
}

getLocationCity(chargingId: number): string {
  const detail = this.chargingDetails.find(d => d.charging_id === chargingId);
  return detail ? detail.Charger.Location.city : 'N/A';
}

}