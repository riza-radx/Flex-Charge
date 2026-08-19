import { logger } from '@core/logger';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../../services/userService/user.service';
import { PaymentMethodService } from 'src/app/services/paymentMethodService/payment-method.service';

import { MatDialog } from '@angular/material/dialog';

import { StripeElementsOptions, Appearance, StripeCardElementOptions } from '@stripe/stripe-js';

import { StripePaymentElementComponent, StripeService, StripeCardComponent, StripeCardNumberComponent, StripeCardExpiryComponent, StripeCardCvcComponent } from 'ngx-stripe';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styles: []
})
export class SettingComponent implements OnInit {
  // @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @ViewChild(StripeCardNumberComponent) cardNumber: StripeCardNumberComponent;
  @ViewChild(StripeCardExpiryComponent) cardExpiry: StripeCardExpiryComponent;
  @ViewChild(StripeCardCvcComponent) cardCvc: StripeCardCvcComponent;
  
  // cardOptions: StripeCardElementOptions = {
  //   style: {
  //     base: {
  //       iconColor: '#666EE8',
  //       color: '#31325F',
  //       fontWeight: '300',
  //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //       fontSize: '18px',
  //       '::placeholder': {
  //         color: '#CFD7E0'
  //       }
  //     }
  //   }
  // };

  // elementsOptions: StripeElementsOptions = {
  //   locale: 'en'
  // };

  // stripeTest: FormGroup;
  // @ViewChild(StripeCardComponent)
  // card: StripeCardComponent;
  // Update Password Form
  updatePassword = {
    oldPassword: '',
    newPassword: ''
  };
  

  updatePasswordErrorMessage: string | null = null;
  updatePasswordSuccessMessage: string | null = null;
  entries: number = 10;
  selected: any[] = [];
  temp: any[] = [];
  rows: any[] = [];
  SelectionType = SelectionType;
  user_id: any;
  // stripeTest: FormGroup;
  pokPayForm: FormGroup;
  userGroupLogo: File | null = null;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  errorMessage: string = '';
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

  // cardOptions = {
  //   style: {
  //     base: {
  //       color: '#32325d',
  //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //       fontSmoothing: 'antialiased',
  //       fontSize: '16px',
  //       '::placeholder': {
  //         color: '#aab7c4'
  //       }
  //     },
  //     invalid: {
  //       color: '#fa755a',
  //       iconColor: '#fa755a'
  //     }
  //   }
  // };
  // elementsOptions: StripeElementsOptions = {
  //   locale: 'en',
  //   // appearance: {
  //   //   theme: 'stripe',
  //   //   labels: 'floating',
  //   //   variables: {
  //   //     colorPrimary: '#673ab7',
  //   //   },
  //   // },
  // };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private paymentMethodService: PaymentMethodService,
    // private stripeService: StripeService
  ) { }

  ngOnInit(): void {
    // this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);
    const cugpCred = localStorage.getItem('cugpCred');
    const parsedCugpCred = JSON.parse(cugpCred);
    this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
    // this.fetchPaymentMethods();
    this.fetchPaymentMethodsByUser()
    // this.stripeTest = this.fb.group({
    //   name: ['', [Validators.required]]
    // });

    this.pokPayForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      locality: ['', Validators.required],
      postalCode: ['', Validators.required],
      countryCode: ['', Validators.required],
      // administrativeArea: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expirationYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      securityCode: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
    
  }

  filterTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      // If the search input is cleared, reset temp to original rows
      this.temp = [...this.rows];
      return;
    }

    this.temp = this.rows.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }

  onUpdatePasswordSubmit(): void {
    this.userService.updateUserPassword(this.updatePassword).subscribe(
      () => {
        this.updatePasswordSuccessMessage = 'Password updated successfully!';
        this.updatePasswordErrorMessage = null;
      },
      () => {
        this.updatePasswordErrorMessage = 'Error updating password.';
        this.updatePasswordSuccessMessage = null;
      }
    );
  }

  entriesChange(event: Event): void {
    this.entries = (event.target as HTMLInputElement).valueAsNumber;
  }

  // onBillingDetailsSubmit(): void {
  //   if (this.stripeTest.valid) {
  //     // Stripe card element setup
  //     this.stripeService.elements(this.elementsOptions).subscribe(elements => {
  //       const card = elements.create('card', this.cardOptions);
  //       card.mount('#card-element');

  //       this.stripeService.createPaymentMethod({
  //         type: 'card',
  //         card,
  //         billing_details: {
  //           name: this.stripeTest.get('name')?.value
  //         }
  //       }).subscribe((result) => {
  //         if (result.paymentMethod) {
  //           // Save the payment method in the backend
  //           this.paymentMethodService.addStripePaymentMethod(result.paymentMethod.id).subscribe(
  //             () => {
  //               console.log('Payment method added successfully.');
  //               this.fetchPaymentMethodsByUser();
  //             },
  //             (error) => {
  //               console.error('Error adding payment method:', error);
  //             }
  //           );
  //         } else if (result.error) {
  //           console.error('Stripe error:', result.error.message);
  //         }
  //       });
  //     });
  //   } else {
  //     console.error('Invalid form submission:', this.stripeTest);
  //   }
  // }
  // onBillingDetailsSubmit(): void {
  //   console.log(this.stripeTest)
  //   if (this.stripeTest.valid) {
  //     // Use ngx-stripe to create the payment method
  //     this.stripeService
  //       .createPaymentMethod({
  //         type: 'card',
  //         card: this.card.element, // Ensure this.card is set via @ViewChild
  //         billing_details: {
  //           name: this.stripeTest.get('name')?.value,
  //         },
  //       })
  //       .subscribe((result) => {
  //         if (result.paymentMethod) {
  //           // Add the payment method to the backend
  //           console.log('This works')
            // this.paymentMethodService
            //   .addStripePaymentMethod(result.paymentMethod.id)
            //   .subscribe(
            //     () => {
            //       console.log('Payment method added successfully.');
            //       this.fetchPaymentMethodsByUser();
            //     },
            //     (error) => {
            //       console.error('Error adding payment method:', error);
            //     }
  //           //   );
  //         } else if (result.error) {
  //           console.error('Stripe error:', result.error.message);
  //         }
  //       });
  //   } else {
  //     console.error('Invalid form submission:', this.stripeTest);
  //   }
  // }

  // onBillingDetailsSubmit(): void {
  //   if (this.stripeTest.valid) {
  //     console.log(this.card)
  //     this.stripeService
  //       .createToken(this.card.element, { name: this.stripeTest.get('name')?.value })
  //       .subscribe((result) => {
  //         if (result.token) {
  //           console.log('Token created:', result.token);
  //           // Send token to backend
  //           this.paymentMethodService.addStripePaymentMethod(result.token.id).subscribe(
  //             () => {
  //               console.log('Token sent to backend successfully.');
  //               // Optional: Fetch updated payment methods
  //               this.fetchPaymentMethodsByUser();
  //             },
  //             (error) => {
  //               console.error('Error sending token to backend:', error);
  //             }
  //           );
  //         } else if (result.error) {
  //           console.error('Error creating token:', result.error.message);
  //         }
  //       });
  //   } else {
  //     console.error('Form is invalid:', this.stripeTest);
  //   }
  // }
  paymentMethodId: String = '';
  // onBillingDetailsSubmit(): void {
  //   if (this.stripeTest.valid) {
  //     const name = this.stripeTest.get('name')?.value;

  //     this.stripeService
  //       .createPaymentMethod({
  //         type: 'card',
  //         card: this.cardNumber.element, // Pass the card number element
  //         billing_details: { name: null }, // Include billing details
  //         }
  //       )
  //       .subscribe((result) => {
  //         if (result.paymentMethod) {
  //           console.log('Token created:', result.paymentMethod);const pack = {
  //             PaymentMethodID: result.paymentMethod,
  //             // customer: this.stripeBillingId,
  
  //           };
  //            // Send token to the backend
  //         this.paymentMethodService
  //         .addStripePaymentMethod({
  //           name,
  //           cardToken: pack.PaymentMethodID // Pass the token ID to the backend
  //         })
  //         .subscribe(
  //           () => {
  //             console.log('Payment method added successfully.');
  //             this.fetchPaymentMethodsByUser();
  //           },
  //           (error) => {
  //             console.error('Error adding payment method:', error);
  //           }
  //         );
  //     } else if (result.error) {
  //       console.error('Error creating token:', result.error.message);
  //     }
  //   });
  //   } else {
  //     console.error('Form is invalid:', this.stripeTest);
  //   }
  // }
  


  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  fetchPaymentMethods(): void {
    this.paymentMethodService.getAllPaymentMethod().subscribe(
      (data: any) => {
        if (data.success && data.paymentMethod) {
          this.rows = data.paymentMethod;
          this.temp = [...this.rows];
        }
      },
      error => {
        logger.error('Error fetching payment methods:', error);
      }
    );
  }
  onUserImageSubmit(): void {
    this.errorMessage = null;
  
    if (!this.userGroupLogo) {
      this.errorMessage = 'Please select an image to upload.';
      logger.error('No file selected for upload');
      return;
    }
  
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('userImage', this.userGroupLogo, this.userGroupLogo.name);
  
    // Call service to update user image
    this.userService.updateUserImage(formData).subscribe({
      next: (response) => {
        logger.log('User image updated successfully:', response);
        setTimeout(() => {
          this.router.navigate(['/profile']); // Navigate after success
          window.location.reload();
        }, 1000);
      },
      error: (error) => {
        logger.error('Error updating user image:', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }
  
  getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Invalid file format or request. Please check your image and try again.';
    } else if (error.status === 401) {
      return 'Unauthorized access. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to update the image.';
    } else if (error.status === 404) {
      return 'User not found.';
    } else if (error.status === 413) {
      return 'File size too large. Please upload a smaller image.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }

  
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userGroupLogo = file;
      logger.log('File selected:', file.name);
    } else {
      logger.error('No file selected');
    }
  }
  

  fetchPaymentMethodsByUser(): void {
    this.paymentMethodService.getPaymentMethodByCurrentUser().subscribe(
      (data: any) => {
        if (data.success && data.paymentMethod) {
          this.rows = data.paymentMethod;
          this.temp = [...this.rows];
        }

        logger.log("this.user_id",this.user_id);
      },
      error => {
        logger.error('Error fetching payment methods:', error);
      }
    );
  }

  onPokBillingDetailsSubmit(): void {
    if (this.pokPayForm.invalid) {
      return; // Exit if the form is invalid
    }

    // Prepare the data based on the form inputs
    const cardData = {
      keyId: 'yourKeyId', // You may fetch this from an API or context
      encryptedCardNumber: this.pokPayForm.value.cardNumber, // Assuming you will encrypt it or handle it securely
      numericCardType: 'yourCardType', // Replace with actual card type
      expirationYear: this.pokPayForm.value.expirationYear,
      expirationMonth: this.pokPayForm.value.expirationMonth,

      firstName: this.pokPayForm.value.firstName,
      lastName: this.pokPayForm.value.lastName,
      address1: this.pokPayForm.value.address1,
      locality: this.pokPayForm.value.locality,
      postalCode: this.pokPayForm.value.postalCode,
      countryCode: this.pokPayForm.value.countryCode,
      administrativeArea: this.pokPayForm.value.administrativeArea,
      email: this.pokPayForm.value.email,

      securityCode: this.pokPayForm.value.securityCode, // CVC code
    };

    // Send the collected data to your backend or Stripe API
    this.paymentMethodService.addPokPaymentMethod(cardData).subscribe(
      (response) => {
        logger.log('Payment method saved:', response);
        this.fetchPaymentMethodsByUser();
      },
      (error) => {
        logger.error('Error saving payment method:', error);
      }
    );
  }
}
