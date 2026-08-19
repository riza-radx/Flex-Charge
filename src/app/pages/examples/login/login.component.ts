import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from '@angular/router'; // Import Router for navigation
import { AuthService } from "../../../services/authService/auth.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { VerifyPhonePopupComponent } from "../verify-phone-popup/verify-phone-popup.component";
import { UserService } from "src/app/services/userService/user.service";
import { RecaptchaErrorParameters } from "ng-recaptcha";

@Component({
  selector: "app-login",
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  email: string;
  password: string;
  errorMessage: string;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  isValidRecaptcha: boolean = false;
  isPhoneVerified: any;
  @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.isSmallScreen = event.target.innerWidth < 768;
  //   // Hide input when switching to small screen
  //   if (this.isSmallScreen) {
  //     this.isInputVisible = false;
  //   }
  // }
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  constructor(private authService: AuthService,private userService: UserService,private modalService: BsModalService, private router: Router) { }

  ngOnInit() { }

  // login() {
  //   const userData = {
  //     email: this.email,
  //     password: this.password
  //   };

  //   this.authService.userLogin(userData).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       // Handle successful registration, possibly navigate to login or dashboard
  //       // this.router.navigate(['/examples/login']);
  //       if (response.success && response.login && response.login.token) {

  //         // Save the token in localStorage
  //         localStorage.setItem('authToken', response.login.token);
  //         localStorage.setItem('refreshToken', response.login.refreshToken);

  //         // Save the user role in localStorage
  //         const userRole = response.login.correctUser.role;
  //         localStorage.setItem('userRole', userRole);
  //         // Handle successful registration
  //         // this.router.navigate(['/dashboard']);
  //         // Make the getCUGPBasedOnUserRole request
  //         this.authService.getCUGPBasedOnUserRole().subscribe(
  //           (cugpResponse: any) => {
  //             console.log('CUGP Response:', cugpResponse);
  //             // localStorage.setItem('cugpCred', cugpResponse);
  //             localStorage.setItem('cugpCred', JSON.stringify(cugpResponse));
  //             // Handle successful CUGP response
  //             // Store any relevant data, navigate, or perform actions based on the response
  //             console.log('Navigating to dashboard...');
  //             this.router.navigate(['/dashboard']);  // For example, navigating to dashboard
  //           },
  //           (cugpError) => {
  //             console.error('CUGP error:', cugpError);
  //             this.errorMessage =  'Error fetching CUGP data. Please try again.';
  //           }
  //         );
  //       } else {
  //         // Handle registration failure
  //         this.errorMessage = 'Login failed. Please try again.';
  //       }
  //     },
  //     (error) => {
  //       // Handle error
  //       this.errorMessage = 'Login failed. Please try again.';
  //       console.error('Login error', error);
  //     }
  //   );
  // }

  public resolved(captchaResponse: string): void {
      logger.log(`Resolved captcha with response: ${captchaResponse}`);
      this.isValidRecaptcha = !!captchaResponse; // Properly update the flag
    }
    
  
    public onError(errorDetails: RecaptchaErrorParameters): void {
      logger.log(`reCAPTCHA error encountered; details:`, errorDetails);
    }

    
  // login() {
  //   const userData = {
  //     email: this.email,
  //     password: this.password
  //   };
  
  //   this.authService.userLogin(userData).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       // Check if the response is successful and contains a token
  //       if (response.success && response.login && response.login.token) {
          
  //         // Save the token in localStorage
  //         localStorage.setItem('authToken', response.login.token);
  //         localStorage.setItem('refreshToken', response.login.refreshToken);
  
  //         // Save the user role in localStorage
  //         const userRole = response.login.correctUser.role;
  //         this.isPhoneVerified = response.login.correctUser.isPhoneVerified;
  //         // this.getUserDetails(response.login.correctUser.userId);
  //         localStorage.setItem('userRole', userRole);
  //         console.log('response.login.correctUser', response.login.correctUser);
          
  //         // Check if the user's phone is verified
  //         // if (this.isPhoneVerified === true) {
  //           // Phone is verified, proceed with fetching CUGP data
  //           this.authService.getCUGPBasedOnUserRole().subscribe(
  //             (cugpResponse: any) => {
  //               console.log('CUGP Response:', cugpResponse);
  //               localStorage.setItem('cugpCred', JSON.stringify(cugpResponse));
  //               // Navigate to the dashboard
  //               console.log('Navigating to dashboard...');
  //               this.router.navigate(['/dashboard']);
  //             },
  //             (cugpError) => {
  //               console.error('CUGP error:', cugpError);
  //               this.errorMessage = 'Error fetching CUGP data. Please try again.';
  //             }
  //           );
  //         // } else {
  //         //   // If phone is not verified, show a message or block login
  //         //   this.errorMessage = 'Your phone number is not verified. Please verify your phone to proceed.';
  //         //   // Optionally, show the verification popup
  //         //   this.openVerifyPhonePopup(response.login.correctUser.userId);
  //         // }
          
  //       } else {
  //         // Handle login failure
  //         this.errorMessage = 'Login failed. Please try again.';
  //       }
  //     },
  //     (error) => {
  //       // Handle error during login
  //       this.errorMessage = 'Login failed. Please try again.';
  //       console.error('Login error', error);
  //     }
  //   );
  // }
  login() {
    const userData = {
      email: this.email,
      password: this.password
    };
  
    this.authService.userLogin(userData).subscribe(
      (response: any) => {
        logger.log(response);
  
        if (response.success && response.login && response.login.token) {
          this.isPhoneVerified = response.login.correctUser.isPhoneVerified;
        //  this.phoneCheckAttempted = true;
  
          if (this.isPhoneVerified === true || this.isPhoneVerified === '1') {
            // Save tokens
            localStorage.setItem('authToken', response.login.token);
            localStorage.setItem('refreshToken', response.login.refreshToken);
  
            // Save role
            const userRole = response.login.correctUser.role;
            localStorage.setItem('userRole', userRole);
  
            // Fetch CUGP and navigate
            this.authService.getCUGPBasedOnUserRole().subscribe(
              (cugpResponse: any) => {
                logger.log('CUGP Response:', cugpResponse);
                localStorage.setItem('cugpCred', JSON.stringify(cugpResponse));
                this.router.navigate(['/dashboard']);
              },
              (cugpError) => {
                logger.error('CUGP error:', cugpError);
                this.errorMessage = 'Error fetching CUGP data. Please try again.';
              }
            );
          } else {
            // Phone is not verified
            this.errorMessage = 'Your phone number is not verified!';
          }
  
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      (error) => {
        this.errorMessage = 'Login failed. Please try again.';
        logger.error('Login error', error);
      }
    );
  }
  
  
  getUserDetails(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        logger.log("response.user.isPhoneVerified",response.user.isPhoneVerified)
        this.isPhoneVerified = response.user.isPhoneVerified;
      },
      error: (error) => {
        logger.error('Error fetching User details:', error);
      }
    });
  }
   openVerifyPhonePopup(userId: string) {
      const modalRef: BsModalRef = this.modalService.show(VerifyPhonePopupComponent, {
        initialState: {
          userId: userId
        }
      });
    
      modalRef.content.onClose.subscribe((result: { confirmed: boolean; verificationCode?: string }) => {
        if (result.confirmed && result.verificationCode) {
          const body = { verificationCode: result.verificationCode };
          
          // Sending verification code to backend
          this.authService.userVerifyPhone(userId, body).subscribe(
            (response) => {
              logger.log('Verification successful', response);
              // Handle success (e.g., navigate or show a success message)
            },
            (error) => {
              this.errorMessage = error.message || 'Verification failed. Please try again.';
              logger.log('Verification error', error);
            }
          );
        } else {
          logger.log('Phone verification canceled or no verification code provided');
        }
      });
    }
}
