import { Component, OnInit } from '@angular/core';
import { RechargeService } from "../../../../services/rechargeService/recharge.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethodService } from "../../../../services/paymentMethodService/payment-method.service";
import { CardService } from "../../../../services/cardService/card.service";
import { AuthService } from 'src/app/services/authService/auth.service';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-createrecharges',
  templateUrl: './createrecharges.component.html',
  styles: []
})
export class CreaterechargesComponent implements OnInit {
  rechargeForm: FormGroup;
  cardId: string;
  paymentMethods: any[] = [];
  rfidCard: any[] = [];
  card: any;
  errorMessage: string = '';
  user_id: any;
  userRole: string | null = null;
  user: any;
  fromProfile: boolean = false;
  forAdminRecharge: boolean = false;
  fromUserDetail: boolean = false;
  userdetailId: any;
  totalAmount: number = 0;
  constructor(
    private rechargeService: RechargeService,
    private cardService: CardService,
    private paymentMethodService: PaymentMethodService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
  ) {
    // Initialize the recharge form with only the amount and source
    this.rechargeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]],
      source: [''],
      total_amount: [null],
      promoCode: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['fromProfile']) {
        this.fromProfile = true;  // Set to true if from profile
      }
      if (params['fromUserDetail']) {
        this.fromUserDetail = true;  // Set to true if from profile
        this.userdetailId = params['userId'];
      }
    });
    this.rechargeForm.get('amount')?.valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });
    this.userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
    const cugpCred = localStorage.getItem('cugpCred');

    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const userGroup_id = parsedCugpCred.usergr_id;


      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.forAdminRecharge = true;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            break;
          case 'RADX_MODERATOR':
            this.forAdminRecharge = false;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            break;
          case 'COMPANY_ADMIN':
            this.forAdminRecharge = true;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
            this.forAdminRecharge = false;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            break;
          case 'COMPANY_USER':
            this.forAdminRecharge = false;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            break;
          case 'USER':
            this.forAdminRecharge = false;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            this.forAdminRecharge = false;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            console.log('User ID:', this.userdetailId);

            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.forAdminRecharge = false;
            this.getPaymentMethodByCurrentUser();
            this.getCurrentUser();
            break;
          default:
            console.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        console.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }

    // Get the cardId from the route
    this.cardId = this.route.snapshot.paramMap.get('id') as string;

  }

  getCard() {
    this.cardService.getCard(this.cardId).subscribe(
      (response) => {
        if (response.success && response.card) {
          this.card = response.card;

          // // Check if the card belongs to a user or user group
          // if (this.card.user_id) {
          //   this.getPaymentMethodByUser(this.card.user_id);
          // } else if (this.card.usergr_id) {
          //   this.getPaymentMethodByUserGroup(this.card.usergr_id);
          // } else {
          //   this.errorMessage = 'Card does not belong to a user or a user group.';
          // }
        } else {
          this.card = null;
          this.errorMessage = 'Card not found.';
        }
        console.log(this.card);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      (data) => {
        console.log("Current User", data.user.userId);
        this.getUser(data.user.userId)
        this.user_id = data.user.userId;
        console.log("Current user_id" + this.user_id);
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getUser(userId: number) {
    console.log("User Id On getUser Function", userId)
    this.userService.getUserById(userId).subscribe(
      (data) => {
        console.log("User Details", data)
        this.user = data;
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  // Fetch payment methods by user ID
  getPaymentMethodByUser(userId: string) {
    this.paymentMethodService.getPaymentMethodByUser(userId).subscribe(
      (response) => {
        if (response.success && response.paymentMethod) {
          this.paymentMethods = response.paymentMethod;
          console.log("this.paymentMethods = response.paymentMethod;", this.paymentMethods);
          this.populatePaymentMethodOptions();
        }
      },
      (error) => {
        console.log('Error fetching payment methods for user:', error);
      }
    );
  }
  // Fetch payment methods by current user ID
  getPaymentMethodByCurrentUser() {
    this.paymentMethodService.getPaymentMethodByCurrentUser().subscribe(
      (response) => {
        if (response.success && response.paymentMethod) {
          this.paymentMethods = response.paymentMethod;
          console.log("this.paymentMethods = response.paymentMethod;", this.paymentMethods);
          this.populatePaymentMethodOptions();
        }
      },
      (error) => {
        console.log('Error fetching payment methods for user:', error);
      }
    );
  }

  // Fetch payment methods by user group ID
  getPaymentMethodByUserGroup(userGroupId: string) {
    this.paymentMethodService.getPaymentMethodByUserGroup(userGroupId).subscribe(
      (response) => {
        if (response.success && response.paymentMethod) {
          this.paymentMethods = response.paymentMethod;
          this.populatePaymentMethodOptions();
        }
      },
      (error) => {
        console.log('Error fetching payment methods for user group:', error);
      }
    );
  }

  // Populate the source field with payment method options
  populatePaymentMethodOptions() {
    this.rechargeForm.get('source')?.setValue(this.paymentMethods.length ? this.paymentMethods[0].id : ''); // Set default option
  }

  // Function to get the current date in YYYY-MM-DD format
  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts date in 'YYYY-MM-DD' format
  }

  // Function to get the current time in HH:mm format
  getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0].slice(0, 5); // Extracts time in 'HH:mm' format
  }

  // Submit the recharge form
  onSubmitAdmin() {
    if (this.rechargeForm.invalid) {
      this.rechargeForm.markAllAsTouched(); // Ensure validation errors are displayed
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const rechargeData = {
      payment_method_id: this.rechargeForm.value.source,
      date: this.getCurrentDate(),
      time: this.getCurrentTime(),
      amount: this.rechargeForm.value.amount,
      promoCode: this.rechargeForm.value.promoCode,
      totalAmount: 0,
    };

    console.log("rechargeData", rechargeData);

    if (this.fromProfile) {
      this.rechargeService.addRechargeForUserAdmin(this.user_id, rechargeData).subscribe(
        (response) => {
          console.log('Recharge created successfully from profile onSubmitAdmin', response);
          // window.open(response.retreiveOrder, '_blank');
          this.router.navigate([`/profile`]);
        },
        (error) => {
          this.handleRechargeError(error);
        }
      );
    }
  }
  // Submit the recharge form
  onSubmit() {
    if (this.rechargeForm.invalid) {
      this.rechargeForm.markAllAsTouched(); // Ensure validation errors are displayed
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const amount = this.rechargeForm.value.amount;
    const totalAmount = this.totalAmount;

    const rechargeData = {
      payment_method_id: this.rechargeForm.value.source,
      date: this.getCurrentDate(),
      time: this.getCurrentTime(),
      amount: amount,
      promoCode: this.rechargeForm.value.promoCode,
      total_amount: totalAmount
    };

    console.log("rechargeData", rechargeData);

    if (this.fromProfile) {
      this.rechargeService.addRechargeForUser(this.user_id, rechargeData).subscribe(
        (response) => {
          console.log('Recharge created successfully from profile', response);
          console.log('Recharge created successfully from profile', this.user_id);
          window.open(response.retreiveOrder, '_blank');
          this.router.navigate(['/profile']);
        },
        (error) => {
          this.handleRechargeError(error);
        }
      );
    } else if (this.fromUserDetail) {
      this.rechargeService.addRechargeForUser(this.userdetailId, rechargeData).subscribe(
        (response) => {
          console.log('Recharge created successfully from user detail', response);
          console.log('Recharge created successfully from user detail', this.userdetailId);
          window.open(response.retreiveOrder, '_blank');
          this.router.navigate(['/users/user', this.userdetailId]);
        },
        (error) => {
          this.handleRechargeError(error);
        }
      );
    }
  }
  handleRechargeError(error: any) {
    if (error.status === 400) {
      this.errorMessage = 'Invalid input. Please check the entered details.';
    } else if (error.status === 401) {
      this.errorMessage = 'Unauthorized request. Please log in and try again.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else {
      this.errorMessage = 'Failed to process the recharge. Please try again.';
    }
    console.error('Recharge error:', error);
  }

  updateTotalAmount() {
    const amount = this.rechargeForm.get('amount')?.value;
    if (amount && amount > 0) {
      this.totalAmount = parseFloat((amount + amount * 0.025).toFixed(2));
    } else {
      this.totalAmount = 0;
    }
  }

}
