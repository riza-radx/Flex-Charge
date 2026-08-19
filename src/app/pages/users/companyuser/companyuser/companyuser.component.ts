import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/userService/user.service';
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-companyuser',
  templateUrl: './companyuser.component.html',
  styles: [
  ]
})
export class CompanyuserComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  constructor(
    private userService: UserService, 
    private companyMemberService: CompanyMemberService, 
    private router: Router

  ) {
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
      this.router.navigate([`/users/user/${this.activeRow.id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      logger.log('User Group ID:', company_id);
      this.getCompanyMembers(company_id);
    } else {
      logger.error('No cugpCred found in localStorage');
    }
    // this.getUsers()
  }

  getCompanyMembers(company_id: number) {
    this.companyMemberService.getCompanyMemberByCompany(company_id).subscribe(
      (response: any) => {
        logger.log(response);
        if (response && response.success && Array.isArray(response.company_member)) {
          this.rows = [];
          response.company_member.forEach(member => {
            this.userService.getUserById(member.user_id).subscribe(
              (userData) => {
                // console.log(userData.user);
                this.rows.push(userData.user);
                this.temp = [...this.rows];
                logger.log(this.temp);
              },
              (error) => {
                logger.error(`Error fetching user with ID ${member.user_id}:`, error);
              }
            );
          });
        } else {
          logger.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getUsers(companyId: number) {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.rows = data.users;
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
