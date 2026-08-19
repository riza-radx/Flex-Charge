import { logger } from '@core/logger';
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router'; // Import Router for navigation
import { AuthService } from "../../../services/authService/auth.service";
import { NgForm } from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { VerifyPhonePopupComponent } from "../verify-phone-popup/verify-phone-popup.component";
import { CountryService } from "src/app/services/country/country.service";
// import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecaptchaErrorParameters } from "ng-recaptcha";
@Component({
  selector: "app-register",
  templateUrl: "register.component.html"
})
export class RegisterComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
  focus;
  focus1;
  focus2;
  focus3;
  focus4;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  errorMessage: string;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  isValidRecaptcha: boolean = false;
  bsModalRef?: BsModalRef;
  countries: any[] = [];
  selectedCountryCode: string = '';
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
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    this.register();
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private countryService: CountryService,
    // private reCaptchaV3Service: ReCaptchaV3Service,
    private modalService: BsModalService
  ) { }

  ngOnInit() { 
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
  }

  // public resolved(captchaResponse: string): void {
  //   console.log(`Resolved captcha with response: ${captchaResponse}`);
  //   if (captchaResponse !== null) {
  //     this.isValidRecaptcha === true
  //   }

  // }
  public resolved(captchaResponse: string): void {
    logger.log(`Resolved captcha with response: ${captchaResponse}`);
    this.isValidRecaptcha = !!captchaResponse; // Properly update the flag
  }
  

  public onError(errorDetails: RecaptchaErrorParameters): void {
    logger.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  register() {
    this.markFormGroupTouched(this.userForm);

    if (this.userForm.invalid) {
      // If the form is invalid, do not proceed with the submission
      return;
    }
    const userData = {
      name: this.name,
      username: this.username,
      email: this.email,
      phone_number: this.phoneNumber,
      password: this.password,
      created_date: new Date().toISOString()
    };

    logger.log("before submitting", userData)

    this.authService.userRegister(userData).subscribe(
      (response: any) => {
        logger.log(response);
        // Handle successful registration, possibly navigate to login or dashboard
        // this.router.navigate(['/examples/login']);
        if (response.token) {
          logger.log("response.tokenUser.userId", response.tokenUser.userId)
          this.openVerifyPhonePopup(response.tokenUser.userId);
          // Handle successful registration
          this.router.navigate(['/login']);
        } else {
          // Handle registration failure
          this.errorMessage = response.message || 'Registration failed. Please try again.';
        }
      },
      (error) => {
        // Handle error
        this.errorMessage = error.error.message || 'Registration failed. Please try again.';
        logger.error('Registration error', error);
      }
    );
  }
  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
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

  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;

    // Ensure the phone number field starts with the selected country code
    if (!this.phoneNumber.startsWith(this.selectedCountryCode)) {
      this.phoneNumber = this.selectedCountryCode + this.phoneNumber.replace(/^\+\d+/, '');
    }
  }

  formatPhoneNumber() {
    if (!this.phoneNumber.startsWith(this.selectedCountryCode)) {
      this.phoneNumber = this.selectedCountryCode + this.phoneNumber.replace(/^\+\d+/, '');

    }
  }
}
