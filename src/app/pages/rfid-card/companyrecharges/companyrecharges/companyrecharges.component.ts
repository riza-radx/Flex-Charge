import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RechargeService } from '../../../../services/rechargeService/recharge.service'
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-companyrecharges',
  templateUrl: './companyrecharges.component.html',
  styles: [
  ]
})
export class CompanyrechargesComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  constructor(private rechargeService: RechargeService, private router: Router) {
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
    const val = ($event.target.value || '').toString().toLowerCase();
    if (!val) {
      this.temp = [...this.rows];
      return;
    }
    this.temp = this.rows.filter((d) => {
      for (const key in d) {
        if (d[key] === null || d[key] === undefined) { continue; }
        if (String(d[key]).toLowerCase().indexOf(val) !== -1) {
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
    // if (event.type === 'click') {
    //   this.router.navigate([`/rfid-cards/recharges/${this.activeRow.recharge_id}`]);  // Navigate to company details page
    // }
  }

  ngOnInit() {
    this.getRecharges()
  }

  getRecharges() {
    this.rechargeService.getAllRecharges().subscribe(
      (data) => {
        this.rows = data.recharges;
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
