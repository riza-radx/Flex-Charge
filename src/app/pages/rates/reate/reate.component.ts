import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RateService } from "../../../services/rateService/rate.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-reate',
  templateUrl: './reate.component.html',
  styles: [
  ]
})
export class ReateComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  userRole: string | null = null;
  isRadXAdmin: boolean = false;
  isRadXModerator: boolean = false;
  isSuperUser: boolean = false;
  isCompanyAdmin: boolean = false;
  isCompanyModerator: boolean = false;
  isCompanyOperator: boolean = false;
  isCompanyTechnicalOperator: boolean = false;
  isCompanyMaintenanceSpecialist: boolean = false;
  isCompanyCallCenter: boolean = false;
  isCompanyAnalyst: boolean = false;
  isUserGroupAdmin: boolean = false;
  isUserGroupModerator: boolean = false;
  isUserGroupUser: boolean = false;
  isPartnerAdmin: boolean = false;
  isPartnerModerator: boolean = false;
  isUser: boolean = false;

  constructor(private rateService: RateService, private router: Router) {
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
      this.router.navigate([`/rates/rate/${this.activeRow.rate_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    // Retrieve user role from localStorage
    this.userRole = localStorage.getItem('userRole');

    if (this.userRole) {
      switch (this.userRole) {
        case 'RadX_Admin':
          this.isRadXAdmin = true;
          break;
        case 'RADX_MODERATOR':
          this.isRadXModerator = true;
          break;
        case 'COMPANY_ADMIN':
          this.isCompanyAdmin = true;
          break;
        case 'SUPER_USER':
          this.isSuperUser = true;
          break;
        case 'COMPANY_OPERATOR':
          this.isCompanyOperator = true;
          break;
        case 'COMPANY_MODERATOR':
          this.isCompanyModerator = true;
          break;
        case 'COMPANY_TECHNICAL_OPERATOR':
          this.isCompanyTechnicalOperator = true;
          break;
        case 'COMPANY_MAINTENANCE_SPECIALIST':
          this.isCompanyMaintenanceSpecialist = true;
          break;
        case 'COMPANY_CALL_CENTER':
          this.isCompanyCallCenter = true;
          break;
        case 'COMPANY_ANALYST':
          this.isCompanyAnalyst = true;
          break;
        case 'USER_GROUP_ADMIN':
          this.isUserGroupAdmin = true;
          break;
        case 'USER_GROUP_MODERATOR':
          this.isUserGroupModerator = true;
          break;
        case 'USER_GROUP_USER':
          this.isUserGroupUser = true;
          break;
        case 'PARTNER_ADMIN':
          this.isPartnerAdmin = true;
          break;
        case 'PARTNER_MODERATOR':
          this.isPartnerModerator = true;
          break;
        case 'USER':
case 'COMPANY_USER':
          this.isUser = true;
          break;
        default:
          console.error('Unknown user role:', this.userRole);
          this.router.navigate(['/login']); // Redirect to login or error page
      }
    }
    // this.getRate();
  }

  getRate() {
    this.rateService.getAllRates().subscribe(
      (data) => {
        this.rows = data.rates;
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
