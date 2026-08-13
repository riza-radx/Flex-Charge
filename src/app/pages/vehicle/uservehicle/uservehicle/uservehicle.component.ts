import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from "../../../../services/vehicleService/vehicle.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-uservehicle',
  templateUrl: './uservehicle.component.html',
  styles: [
  ]
})
export class UservehicleComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  constructor(private vehicleService: VehicleService, private router: Router) {
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
      this.router.navigate([`/assets/vehicle/${this.activeRow.vehicle_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.getVehicles()
  }

  getVehicles() {
    this.vehicleService.getAllVehicles().subscribe(
      (data) => {
        this.rows = data.vehicle;
        this.temp = [...this.rows];
        console.log(this.rows);
        
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);
        
      }
    )
  }

}
