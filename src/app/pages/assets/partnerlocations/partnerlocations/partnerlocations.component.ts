import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-partnerlocations',
  templateUrl: './partnerlocations.component.html',
  styles: [
  ]
})
export class PartnerlocationsComponent implements OnInit {
    entries: number = 10;
    selected: any[] = [];
    temp = [];
    activeRow: any;
    errorMessage: any;
    rows: any = [];
    SelectionType = SelectionType;
  
    constructor(private chargerLocationService: ChargerLocationService, private router: Router) {
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
        this.router.navigate([`/assets/locations/${this.activeRow.location_id}`]);  // Navigate to company details page
      }
    }
  
    ngOnInit() {
      const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const partner_id = parsedCugpCred.partner_id;
      console.log('User Group ID:', partner_id);
      this.getLocations(partner_id);
    } else {
      console.error('No cugpCred found in localStorage');
    }
      // this.getLocations()
    }
  
    getLocations(partnerId: number) {
      this.chargerLocationService.getChargerLocationByPartner(partnerId).subscribe(
        (data) => {
          if (Array.isArray(data.location)) {
            this.rows = data.location;
            this.temp = [...this.rows];
          } else {
            console.error('Unexpected data structure:', data);
          }
        },
        (error) => {
          this.errorMessage = error.message;
          console.log(error);
        }
      );
    }
  
  }
  
