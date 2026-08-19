import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { AuthService } from '../../../../services/authService/auth.service';
import { PartnerMemberService } from '../../../../services/partner-member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partnercreateuser',
  templateUrl: './partnercreateuser.component.html',
  styles: [
  ]
})
export class PartnercreateuserComponent {

  user = {
    name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: ''
  };

  constructor(private authService: AuthService, private partnerMemberService: PartnerMemberService, private router: Router) {}

  onSubmit() {
    this.authService.userRegisterFromDashboard(this.user).subscribe(
      (response: any) => {
        logger.log('User created successfully', response);
        const userId = response.id;  // Assume the API returns the user ID in the response
        const companyId = localStorage.getItem('partnerId');  // Retrieve the company ID from local storage

        if (!companyId) {
          logger.error('Company ID not found in local storage');
          return;
        }

        const partnerMember = {
          partnerId: localStorage.getItem('userRole'),  // Use the retrieved company ID
          userId: userId,
          type: this.user.role
        };

        this.partnerMemberService.addPartnerMember(partnerMember).subscribe(
          memberResponse => {
            logger.log('Company member created successfully', memberResponse);
            this.router.navigate(['/users/user']);
          },
          error => {
            logger.error('Error creating company member', error);
          }
        );
      },
      error => {
        logger.error('Error creating user', error);
      }
    );
  }

}
