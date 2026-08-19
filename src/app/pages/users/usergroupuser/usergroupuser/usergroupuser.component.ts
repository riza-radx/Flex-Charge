import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/userService/user.service'
import { UserGroupMembersService } from '../../../../services/userGroupMembersService/user-group-members.service'
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-usergroupuser',
  templateUrl: './usergroupuser.component.html',
  styles: [
  ]
})
export class UsergroupuserComponent implements OnInit {
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
    private userGroupMembersService: UserGroupMembersService, 
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

  // ngOnInit() {
  //   // // const id = localStorage.getItem('cugpCred');
  //   // console.log('Local Storage data', localStorage.getItem('cugpCred'));
  //   const cugpCred = localStorage.getItem('cugpCred');
  //   if (cugpCred) {
  //     const parsedCugpCred = JSON.parse(cugpCred);
  //     const usergr_id = parsedCugpCred.usergr_id;
  //     console.log('User Group ID:', usergr_id);
  //     this.getUserGroupMembers(cugpCred)

  //     // Now you can use usergr_id to fetch data or perform other actions
  //     // this.getUserGroupMembers(usergr_id);
  //   } else {
  //     console.error('No cugpCred found in localStorage');
  //   }
    
  //   // this.getUserGroupMembers()
  // }

  // getUserGroupMembers(userId: any) {
  //   this.userGroupMembersService.getUserGroupMemberByUserGroup(userId).subscribe(
  //     (members) => {
  //       console.log(members)
  //       this.rows = [];
  //       members.forEach(member => {
  //         this.userService.getUserById(member.user_id).subscribe(
  //           (userData) => {
  //             this.rows.push(userData);
  //             this.temp = [...this.rows];
  //           },
  //           (error) => {
  //             console.error(`Error fetching user with ID ${member.user_id}:`, error);
  //           }
  //         );
  //       });
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  ngOnInit() {
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const usergr_id = parsedCugpCred.usergr_id;
      logger.log('User Group ID:', usergr_id);
      this.getUserGroupMembers(usergr_id);
    } else {
      logger.error('No cugpCred found in localStorage');
    }
  }

  getUserGroupMembers(usergr_id: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(usergr_id).subscribe(
      (response: any) => {
        if (response && response.success && Array.isArray(response.userGroupMembers)) {
          this.rows = [];
          response.userGroupMembers.forEach(member => {
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
  

}
