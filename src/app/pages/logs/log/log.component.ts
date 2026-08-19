import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from "../../../services/logService/log.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styles: [
  ]
})
export class LogComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  constructor(private logService: LogService, private router: Router) {
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
    this.temp = this.rows.filter(function (d) {
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
      this.router.navigate([`/logs/log/${this.activeRow.log_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.getIpData()
  }

  getIpData() {
    this.logService.getIPInfo().subscribe(
      (data) => {
        // this.logs = data.log;
        // this.tempLogs = [...this.logs];
        // console.log("IP Info", data)
        this.getLogs(data.timezone);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getLogs(timezone: any) {
    this.logService.getAllLogs(timezone).subscribe(
      (data) => {
        this.rows = data.logs;
        this.temp = [...this.rows];
        // console.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }

}
