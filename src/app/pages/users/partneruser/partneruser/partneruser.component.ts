import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/userService/user.service'
import { PartnerMemberService } from "../../../../services/partner-member.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-partneruser',
  templateUrl: './partneruser.component.html',
  styles: [
  ]
})
export class PartneruserComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [
  ];
  SelectionType = SelectionType;

  constructor(
    private userService: UserService, 
    private partnerMemberService: PartnerMemberService, 
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
      const partner_id = parsedCugpCred.partner_id;
      logger.log('User Group ID:', partner_id);
      this.getPartnerMembers(partner_id);
    } else {
      logger.error('No cugpCred found in localStorage');
    }
    // this.getUsers()
  }

  getPartnerMembers(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByUser(partnerId).subscribe(
      (response: any) => {
        logger.log(response);
        if (response && response.success && Array.isArray(response.partnerMembers)) {
          this.rows = [];
          response.partnerMembers.forEach(member => {
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

  getUsers() {
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
