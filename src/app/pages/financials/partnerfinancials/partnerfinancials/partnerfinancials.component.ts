import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from "../../../../services/reportService/report.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-partnerfinancials',
  templateUrl: './partnerfinancials.component.html',
  styles: [
  ]
})
export class PartnerfinancialsComponent {
  entries: number = 10;
  selected: any[] = [];
  tempReports = [];
  activeRow: any;
  errorMessage: any;
  reports: any = [];
  SelectionType = SelectionType;
  // userGroup: any;
  // userGroupId: string;
  userGroupMembers: any[] = [];
  // chargingHistory: any[] = [];
  // rfidCard: any[] = [];
  // vehicle: any[] = [];
  // errorMessage: any;
  id: string;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getVReports();
    // this.route.paramMap.subscribe(params => {
    //   this.userGroupId = params.get('id');
    //   this.getUserGroup(this.userGroupId);
    // });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
    if (event.type === 'click') {
      this.router.navigate([`/reports/financial/${this.activeRow.reports_id}`]);
    }
  }

  getVReports() {
    const id = localStorage.getItem('cugpCred.partner_id');
    this.reportService.getAllReportByPartner(id).subscribe(
      (data: any) => {
        logger.log(data);
        if (data && Array.isArray(data.report)) {
          // If data.report is an array
          this.reports = data.report;
        } else if (data && data.report && typeof data.report === 'object') {
          // If data.report is a single object
          this.reports = [data.report];
        } else {
          logger.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

}
