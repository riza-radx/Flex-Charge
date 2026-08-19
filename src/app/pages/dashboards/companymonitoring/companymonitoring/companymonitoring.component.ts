import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargingService } from "../../../../services/chargingService/charging.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { CardService } from "../../../../services/cardService/card.service";
import { RatePerDaysService } from "../../../../services/ratePerDaysService/rate-per-days.service";
import { ChargingStatusService } from 'src/app/services/chargingStatusService/charging-status.service';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}


@Component({
  selector: 'app-companymonitoring',
  templateUrl: './companymonitoring.component.html',
  styles: [
  ]
})
export class CompanymonitoringComponent implements OnInit {
  errorMessage: any;

chargings: any[] = []; // Store all charging records
  userNames: { [key: number]: string } = {}; // Store user names with charging IDs as keys
  cardSerial: string[] = [];// Store card serial with charging IDs as keys
  chargingTimes: { charging_id: number; started_time: Date }[] = [];
  private intervalId: any; // Store the interval ID for clearings
  chargingDetails: any[] = [];

  constructor(
    private chargingStatusService: ChargingStatusService,
        private chargingService: ChargingService, 
    private chargerService: ChargerService, 
    private connectorService: ConnectorService,
    private cardService: CardService,
    private ratePerDaysService: RatePerDaysService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
    this.startTimeUpdate();
    this.fetchAllChargingDetails();
    // this.getChargings()
}

ngOnDestroy(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId); 
  }
}

fetchAllData(): void {
  this.chargingStatusService.getAllChargings().subscribe({
    next: (response) => {
      if (response.success) {
        this.chargings = response.charging;
        // ⚠️ Fshira `fetchUserNames()` — kalonte të gjithë array-in `this.chargings`
        // si `chargerId` te getCharger, çka bënte URL të keqformuar
        // `chargerbyid/[object Object],[object Object]...` që kthente 404.
        // Emrat e user-ave nuk shfaqen te ky component, pra ishte dead code.
        //
        // Fshira gjithashtu duplikimin e `fetchCardSerial()` (thirrej 2x).
        this.fetchCardSerial();
        this.fetchChargingTimes();
      } else {
        logger.error('Error fetching charging records:', response.message);
      }
    },
    error: (err) => logger.error('Error fetching charging records:', err)
  });
}

fetchCardSerial(): void {
  // Për sesionet e roaming-ut karta i përket kompanisë tjetër (Pavilion),
  // ndaj getCard mund të kthejë 403. Trajtojmë error-in pa e lënë të
  // shpërthejë deri te interceptor-i global (që redirect-on te dashboard).
  this.chargings.forEach((charging, index) => {
    if (!charging?.card_id) return; // remote start pa kartë → skip
    this.cardService.getCard(charging.card_id).subscribe({
      next: (serial) => {
        this.cardSerial[index] = serial?.card?.serial_no || '';
      },
      error: (err) => {
        // Fallback silent — mos dërgo 403/404 te error handler global.
        this.cardSerial[index] = '';
        if (err?.status !== 403 && err?.status !== 404) {
          logger.error('Card serial fetch failed:', err?.status);
        }
      }
    });
  });
}
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


startTimeUpdate(): void {
  this.intervalId = setInterval(() => {
    this.chargingTimes = this.chargingTimes.map(charging => ({
      ...charging,
      time_difference: this.calculateTimeDifference(charging.started_time)
    }));
  }, 1000); 
}

calculateTimeDifference(startTime: Date): string {
  // console.log("Started Time", startTime)
  const now = new Date();
  const diffInMs = now.getTime() - new Date(startTime).getTime();
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  // const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
  return `${this.pad(hours)}:${this.pad(minutes)}`;
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
