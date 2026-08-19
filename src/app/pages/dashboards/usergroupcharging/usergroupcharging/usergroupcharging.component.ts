import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargingService } from "../../../../services/chargingService/charging.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { CardService } from "../../../../services/cardService/card.service";
import { RatePerDaysService } from "../../../../services/ratePerDaysService/rate-per-days.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-usergroupcharging',
  templateUrl: './usergroupcharging.component.html',
  styles: [
  ]
})
export class UsergroupchargingComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  chargings: any[] = []; // Store all chargings by all cards
  SelectionType = SelectionType;

  constructor(
    private chargingService: ChargingService, 
    private chargerService: ChargerService, 
    private connectorService: ConnectorService,
    private cardService: CardService,
    private ratePerDaysService: RatePerDaysService,
    private router: Router
  ) {
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    this.temp = this.rows.filter(function(d) {
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
    // this.activeRow = event.row;
    // if (event.type === 'click') {
    //   this.router.navigate([`/monitoring/charging/${this.activeRow.charging_id}`]);  // Navigate to company details page
    // }
  }

  ngOnInit() {
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const usergr_id = parsedCugpCred.usergr_id;
      logger.log('User Group ID:', usergr_id);
      this.getRFIDCards(usergr_id);
    } else {
      logger.error('No cugpCred found in localStorage');
    }
    // this.getChargings();
  }

//   getChargings(cardId: number) {
//     this.chargingService.getChargingByCard(cardId).subscribe(
//       (data) => {
//         this.rows = data.charging;
//         this.temp = [...this.rows];
//         console.log(this.rows);

//         // Fetch charger details for each charging entry
//         this.rows.forEach((row, index) => {
//           this.chargerService.getCharger(row.charger_id).subscribe(
//             (chargerData) => {
//               this.rows[index].charger = chargerData.charger.charger_name;  // Add charger details to the row
//               this.temp = [...this.rows];  // Update temp to reflect changes
//             },
//             (error) => {
//               this.errorMessage = error.message;
//               console.log(error);
//             }
//           );
//           this.connectorService.getConnector(row.connector_id).subscribe(
//             (connectorData) => {
//               this.rows[index].connector = connectorData.connector.connector_name;  // Add connector details to the row
//               this.temp = [...this.rows];  // Update temp to reflect changes
//             },
//             (error) => {
//               this.errorMessage = error.message;
//               console.log(error);
//             }
//           );
//           this.cardService.getCard(row.card_id).subscribe(
//             (cardData) => {
//               this.rows[index].card = cardData.card.serial_no;  // Add card details to the row
//               this.temp = [...this.rows];  // Update temp to reflect changes
//             },
//             (error) => {
//               this.errorMessage = error.message;
//               console.log(error);
//             }
//           );
//           this.ratePerDaysService.getRatePerDay(row.rate_per_days_id).subscribe(
//             (ratePerDaysData) => {
//               this.rows[index].ratePerDay = ratePerDaysData.ratePerDay.day;  // Add rate per days details to the row
//               this.temp = [...this.rows];  // Update temp to reflect changes
//             },
//             (error) => {
//               this.errorMessage = error.message;
//               console.log(error);
//             }
//           );
//         });
        
//       },
//       (error) => {
//         this.errorMessage = error.message
//         console.log(error);
        
//       }
//     )

// }
getRFIDCards(usergrId: number) {
  this.cardService.getCardByUserGroup(usergrId).subscribe(
    (response) => {
      if (response && response.success && Array.isArray(response.card)) {
        // Process each card and fetch its charging history
        logger.log(response.card);
        response.card.forEach((card) => {
          this.getChargings(card.card_id);
        });
      } else {
        logger.error('Expected an array but got:', response.card);
      }
    },
    (error) => {
      this.errorMessage = error.message;
      logger.log(error);
    }
  );
}


getChargings(cardId: number) {
  logger.log(cardId);
  this.chargingService.getChargingByCard(cardId).subscribe(
    (data) => {
      const chargings = data.charging;
      // Combine all chargings into the main array
      this.chargings = [...this.chargings, ...chargings];
      this.rows = this.chargings;
      this.temp = [...this.rows];
      logger.log('Chargings:', this.rows);

      // Fetch additional details for each charging entry
      this.rows.forEach((row, index) => {
        this.chargerService.getCharger(row.charger_id).subscribe(
          (chargerData) => {
            this.rows[index].charger = chargerData.charger.charger_name;  // Add charger details to the row
            this.temp = [...this.rows];  // Update temp to reflect changes
          },
          (error) => {
            this.errorMessage = error.message;
            logger.log(error);
          }
        );
        this.connectorService.getConnector(row.connector_id).subscribe(
          (connectorData) => {
            this.rows[index].connector = connectorData.connector.connector_name;  // Add connector details to the row
            this.temp = [...this.rows];  // Update temp to reflect changes
          },
          (error) => {
            this.errorMessage = error.message;
            logger.log(error);
          }
        );
        this.cardService.getCard(row.card_id).subscribe(
          (cardData) => {
            this.rows[index].card = cardData.card.serial_no;  // Add card details to the row
            this.temp = [...this.rows];  // Update temp to reflect changes
          },
          (error) => {
            this.errorMessage = error.message;
            logger.log(error);
          }
        );
        this.ratePerDaysService.getRatePerDay(row.rate_per_days_id).subscribe(
          (ratePerDaysData) => {
            this.rows[index].ratePerDay = ratePerDaysData.ratePerDay.day;  // Add rate per day details to the row
            this.temp = [...this.rows];  // Update temp to reflect changes
          },
          (error) => {
            this.errorMessage = error.message;
            logger.log(error);
          }
        );
      });
    },
    (error) => {
      this.errorMessage = error.message;
      logger.log(error);
    }
  );
}

}
