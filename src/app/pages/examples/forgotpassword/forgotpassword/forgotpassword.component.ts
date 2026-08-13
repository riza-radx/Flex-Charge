import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from '@angular/router'; // Import Router for navigation
import { AuthService } from "../../../../services/authService/auth.service";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styles: [
  ]
})
export class ForgotpasswordComponent implements OnInit {

  focus;
    focus1;
    email: string;
    errorMessage: string;
    emailSentMessage: string;
    isSmallScreen: boolean = window.innerWidth < 768;
    isInputVisible: boolean = false;
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
    constructor(private authService: AuthService, private router: Router) { }
  
    ngOnInit() { }

    // forgotPassword() {
    //   const userData = {
    //     email: this.email,
    //   };
    //   this.authService.forgotPassword(userData).subscribe(
    //     (response: any) => {
    //       console.log(response);
    //     },
    //     (error) => {
    //       // Handle error
    //       this.errorMessage = error.error.message || 'Login failed. Please try again.';
    //       console.error('Login error', error);
    //     }
    //   );
    // }
    forgotPassword() {
      const userData = {
        email: this.email,
      };
      this.authService.forgotPasswordWhitelabel(userData).subscribe(
        (response: any) => {
          console.log(response);
          this.emailSentMessage = 'An email is sent to your email. Please check your email you provided.'; // Set success message
          this.errorMessage = ''; // Clear any error message
        },
        (error) => {
          this.errorMessage = error.error.message || 'An error occurred. Please try again.';
          this.emailSentMessage = ''; // Clear any success message if there's an error
          console.error('Login error', error);
        }
      );
    }

}
