import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerService } from "../../../../services/chargerService/charger.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-companychargers',
  templateUrl: './companychargers.component.html',
  styles: [
  ]
})
export class CompanychargersComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  constructor(private chargerService: ChargerService, private router: Router) {
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
      this.router.navigate([`/assets/chargers/${this.activeRow.charger_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      logger.log('User Group ID:', company_id);
      this.getChargers(company_id);
    } else {
      logger.error('No cugpCred found in localStorage');
    }
    // this.getChargers()
  }

  getChargers(companyId: number) {
    this.chargerService.getChargerByCompany(companyId).subscribe(
      (data) => {
        logger.log(data);
        this.rows = data.charger;
        this.temp = [...this.rows];
        logger.log(this.rows);
        
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);
        
      }
    )
  }

}

