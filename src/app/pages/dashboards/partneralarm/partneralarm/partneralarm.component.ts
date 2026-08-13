import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlarmService } from "../../../../services/alarmService/alarm.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-partneralarm',
  templateUrl: './partneralarm.component.html',
  styles: [
  ]
})
export class PartneralarmComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;
  alarms: any[] = []; // Store all alarms by all charger

  constructor(
    private alarmService: AlarmService, 
    private connectorService: ConnectorService, 
    private chargerService: ChargerService, 
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
    // this.activeRow = event.row;
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/monitoring/alarm/${this.activeRow.alarm_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    // const cugpCred = localStorage.getItem('cugpCred');
    // if (cugpCred) {
    //   const parsedCugpCred = JSON.parse(cugpCred);
    //   const partner_id = parsedCugpCred.partner_id;
    //   console.log('User Group ID:', partner_id);
    //   this.getChargers(partner_id);
    // } else {
    //   console.error('No cugpCred found in localStorage');
    // }
    // this.getAlarms()
  }

//   getChargers(partnerId: number) {
//     console.log('Requesting chargers for company ID:', partnerId);
  
//     this.chargerService.getChargerByPartner(partnerId).subscribe(
//       (response) => {
//         console.log('Charger response:', response);
  
//         if (response && response.success && Array.isArray(response.charger)) {
//           if (response.charger.length === 0) {
//             console.log('No chargers found for company ID:', partnerId);
//           } else {
//             // Process each charger and fetch its charging history
//             response.charger.forEach((charger) => {
//               console.log('Processing charger:', charger);
//               this.getAlarms(charger.charger_id); // Assuming charger_id exists
//             });
//           }
//         } else {
//           console.error('Expected an array but got:', response.charger);
//         }
//       },
//       (error) => {
//         this.errorMessage = error.message;
//         console.error('Error fetching chargers:', error);
//       }
//     );
//   }


//   getAlarms(chargerId: number) {
//     this.alarmService.getAlarmByCharger(chargerId).subscribe(
//       (data) => {
//         console.log(data);
//         // this.rows = data.alarms;
//         // this.temp = [...this.rows];
//         // console.log(this.rows);
//         const alarms = data.alarms;
//       // Combine all chargings into the main array
//       this.alarms = [...this.alarms, ...alarms];
//       this.rows = this.alarms;
//       this.temp = [...this.rows];
//       console.log('Alarms:', this.rows);

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
//         });
        
//       },
//       (error) => {
//         this.errorMessage = error.message
//         console.log(error);
        
//       }
//     )

// }

}