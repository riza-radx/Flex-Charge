import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from "../../../../services/transactionService/transaction.service";
import { Router } from '@angular/router';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-radxtransaction',
  templateUrl: './radxtransaction.component.html',
  styles: [
  ]
})
export class RadxtransactionComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = []
  SelectionType = SelectionType;

  constructor(private transactionService: TransactionService, private router: Router) {
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
    // if (event.type === 'click') {
    //   this.router.navigate([`/rfid-cards/transactions/${this.activeRow.transaction_id}`]);  // Navigate to company details page
    // }
  }

  ngOnInit() {
    this.getTransactions()
  }

  getTransactions() {
    this.transactionService.getAllTransactions().subscribe(
      (data) => {
        this.rows = data.transaction;
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
