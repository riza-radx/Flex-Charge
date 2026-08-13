import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';

@Component({
  selector: 'app-companydeleteusergroup',
  templateUrl: './companydeleteusergroup.component.html'
})
export class CompanydeleteusergroupComponent {
  userGroupId: number;
  userGroupName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userGroupService: UserGroupService
  ) { }

  ngOnInit(): void {
    this.userGroupId = this.route.snapshot.params['id'];
    this.getUserGroupDetails(this.userGroupId);
    console.log('Charger ID:', this.userGroupId);
    console.log('Charger Name:', this.userGroupName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.userGroupId = row.id;
    this.userGroupName = row.userGroupName;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.userGroupService.deleteUserGroup(this.userGroupId).subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        this.closePopupHandler();
        // this.router.navigate(['/users/user']);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  getUserGroupDetails(id: number): void {
    this.userGroupService.getUserGroup(id).subscribe({
      next: (response) => {
        console.log('response:', response);
        this.userGroupName = response.userGroup.usergr_name;
        console.log('userGroupName:', this.userGroupName);
      },
      error: (error) => {
        console.error('Error fetching User details:', error);
      }
    });
  }


  // closePopupHandler(): void {
  //   this.isPopupVisible = false;
  //   this.router.navigate(['/users/user']); 
  // }
  closePopupHandler(): void {
    this.isPopupVisible = false; // Hide the popup
    setTimeout(() => {
      this.router.navigate(['/users/usergroup']); // Ensure navigation happens after the popup is closed
    }, 300);
  }

}
