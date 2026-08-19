import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-companyusergroup',
  templateUrl: './companyusergroup.component.html',
  styles: [
  ]
})
export class CompanyusergroupComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [
  ];
  SelectionType = SelectionType;


  constructor(private userGroupService: UserGroupService, private router: Router) {
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
      this.router.navigate([`/users/usergroup/${this.activeRow.usergr_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      logger.log('User Group ID:', company_id);
      this.getUserGroups(company_id);
    } else {
      logger.error('No cugpCred found in localStorage');
    }
    // this.getUserGroups()
  }

  getUserGroups(companyID: number) {
    // Retrieve companyID from local storage
  // const companyID = localStorage.getItem('cugpCred.companyID');
    this.userGroupService.getUserGroupByCompany(companyID).subscribe(
      (data) => {
        // Check if the response has the expected structure
        if (data.success && Array.isArray(data.userGroup)) {
          this.rows = data.userGroup;  // Access the userGroup array from the response
          this.temp = [...this.rows];
        } else {
          logger.error('Unexpected data format:', data);
          this.rows = [];
          this.temp = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log('Error fetching user groups:', error);
      }
    );
  }

}
