import { logger } from '@core/logger';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-verify-phone-popup',
  templateUrl: './verify-phone-popup.component.html',
  styles: [
  ]
})
export class VerifyPhonePopupComponent {

  verificationCode: string = '';
  userId: string = '';  // This will hold the userId passed from RegisterComponent

  errorMessage: string;

  @Output() onClose = new EventEmitter<{ confirmed: boolean, phoneNumber?: string }>();

  constructor(public bsModalRef: BsModalRef, private authService: AuthService, private router: Router) {
    // Retrieve the userId passed from initialState
    this.userId = bsModalRef?.content?.userId || '';
  }

  verifyCode() {
    if (!this.verificationCode) return;
  
    // Create the request body with the verification code
    const body = { verificationCode: this.verificationCode };
  
    // Pass the body along with the userId to the service method
    this.authService.userVerifyPhone(this.userId, body).subscribe(
      response => {
        logger.log('Verification successful', response);
        // Phone is verified, proceed with fetching CUGP data
        this.authService.getCUGPBasedOnUserRole().subscribe(
          (cugpResponse: any) => {
            logger.log('CUGP Response:', cugpResponse);
            localStorage.setItem('cugpCred', JSON.stringify(cugpResponse));
            // Navigate to the dashboard
            logger.log('Navigating to dashboard...');
            this.router.navigate(['/dashboard']);
          },
          (cugpError) => {
            logger.error('CUGP error:', cugpError);
            this.errorMessage = 'Error fetching CUGP data. Please try again.';
          }
        );
        this.onClose.emit({ confirmed: true, phoneNumber: response.phoneNumber });
        this.bsModalRef.hide();
      },
      error => {
        logger.error('Verification failed', error);
      }
    );
  }
  

  onCancel() {
    this.onClose.emit({ confirmed: false });
    this.bsModalRef.hide();
  }
}
