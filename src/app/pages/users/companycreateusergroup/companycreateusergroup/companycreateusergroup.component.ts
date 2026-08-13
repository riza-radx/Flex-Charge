import { Component } from '@angular/core';
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-companycreateusergroup',
  templateUrl: './companycreateusergroup.component.html',
  styles: [
  ]
})
export class CompanycreateusergroupComponent {

  userGroup = {
    usergr_name: '',
    usergr_description: '',
    usergr_addres: '',
    usergr_city: '',
    usergr_country: '',
    usergr_phone_no: '',
    usergr_email: '',
    company_id: ''  // This should be set from local storage
  };

  constructor(private userGroupService: UserGroupService, private router: Router) {
    // Get company ID from local storage
    const companyId = localStorage.getItem('company_id');
    if (companyId) {
      this.userGroup.company_id = companyId;
    }
  }

  onSubmit() {
    this.userGroupService.addUserGroup(this.userGroup).subscribe(
      response => {
        console.log('User group created successfully', response);
        // Navigate to another page or display a success message
        this.router.navigate(['/users/usergroup']);
      },
      error => {
        console.error('Error creating user group', error);
      }
    );
  }

}

