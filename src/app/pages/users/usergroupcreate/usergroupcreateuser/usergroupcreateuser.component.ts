import { Component } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { UserGroupMembersService } from '../../../../services/userGroupMembersService/user-group-members.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usergroupcreateuser',
  templateUrl: './usergroupcreateuser.component.html',
  styles: [
  ]
})
export class UsergroupcreateuserComponent {

  user = {
    name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: ''
  };

  constructor(private authService: AuthService, private userGroupMembersService: UserGroupMembersService, private router: Router) {}

  onSubmit() {
    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        console.log('User created successfully', response);
        const userId = response.id;  // Assume the API returns the user ID in the response
        const companyId = localStorage.getItem('companyId');  // Retrieve the company ID from local storage

        if (!companyId) {
          console.error('Company ID not found in local storage');
          return;
        }

        const userGroupMember = {
          userGroupId: localStorage.getItem('userDroupId'),  // Use the retrieved company ID
          userId: userId,
          type: this.user.role
        };

        this.userGroupMembersService.addUserGroupMember(userGroupMember).subscribe(
          memberResponse => {
            console.log('Company member created successfully', memberResponse);
            this.router.navigate(['/users/user']);
          },
          error => {
            console.error('Error creating company member', error);
          }
        );
      },
      error => {
        console.error('Error creating user', error);
      }
    );
  }

}
