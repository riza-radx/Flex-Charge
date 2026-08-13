import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerStatusService } from "../../../../services/chargerStatusService/charger-status.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-companystationstatus',
  templateUrl: './companystationstatus.component.html',
  styles: [
  ]
})
export class CompanystationstatusComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  constructor(
    private chargerStatusService: ChargerStatusService, 
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
      this.router.navigate([`/monitoring/stationStatus/${this.activeRow.charger_status_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      console.log('User Group ID:', company_id);
      this.getChargers(company_id);
    } else {
      console.error('No cugpCred found in localStorage');
    }
    // this.getChargerStatus();
  }

  getChargers(companyId: number) {
    console.log('Requesting chargers for company ID:', companyId);
  
    this.chargerService.getChargerByCompany(companyId).subscribe(
      (response) => {
        console.log('Charger response:', response);
  
        if (response && response.success && Array.isArray(response.charger)) {
          if (response.charger.length === 0) {
            console.log('No chargers found for company ID:', companyId);
          } else {
            // Process each charger and fetch its charging history
            response.charger.forEach((charger) => {
              console.log('Processing charger:', charger);
              this.getChargerStatus(charger.charger_id); // Assuming charger_id exists
            });
          }
        } else {
          console.error('Expected an array but got:', response.charger);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching chargers:', error);
      }
    );
  }

  getChargerStatus(chargerId: number) {
    this.chargerStatusService.getChargerStatusByCharger(chargerId).subscribe(
      (data) => {
        this.rows = data.charger_status;
        this.temp = [...this.rows];
        console.log(this.rows);

        // Fetch charger details for each charging entry
        this.rows.forEach((row, index) => {
          this.chargerService.getCharger(row.charger_id).subscribe(
            (chargerData) => {
              console.log(chargerData);
              this.rows[index].charger = chargerData.charger.charger_name;  // Add charger details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              console.log(error);
            }
          );
        });
        
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);
        
      }
    )

}

}
