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
  selector: 'app-companyfinancials',
  templateUrl: './companyfinancials.component.html',
  styles: [
  ]
})
export class CompanyfinancialsComponent {
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
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      console.log('User Group ID:', company_id);
      this.getVReports(company_id);
    } else {
      console.error('No cugpCred found in localStorage');
    }
    // this.getVReports();
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
      this.router.navigate([`/reports/financial/${this.activeRow.usergr_id}`]);
    }
  }

  getVReports(companyId: number) {
    const id = localStorage.getItem('cugpCred.userId');
    this.reportService.getAllReportByCompany(companyId).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.reports)) {
          // If data.report is an array
          this.reports = data.reports;
        } else if (data && data.reports && typeof data.report === 'object') {
          // If data.report is a single object
          this.reports = [data.reports];
        } else {
          console.error('Expected an array but got:', data);
          this.reports = []; // Set to an empty array if data is not valid
        }
        this.tempReports = [...this.reports];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
}