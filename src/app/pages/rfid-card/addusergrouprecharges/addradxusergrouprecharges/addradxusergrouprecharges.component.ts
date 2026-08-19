import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { RechargeService } from "../../../../services/rechargeService/recharge.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethodService } from "../../../../services/paymentMethodService/payment-method.service";
import { CardService } from "../../../../services/cardService/card.service";
import { AuthService } from 'src/app/services/authService/auth.service';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-addradxusergrouprecharges',
  templateUrl: './addradxusergrouprecharges.component.html',
  styles: [
  ]
})
export class AddradxusergrouprechargesComponent {
  rechargeForm: FormGroup;
  usergrId: number;
  paymentMethods: any[] = [];
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private rechargeService: RechargeService,
    private paymentMethodService: PaymentMethodService
  ) {
    // Initialize the recharge form with only the amount and source
    // 🆕 topup_note eshte i detyrueshem — arsyeja e TopUp-it
    this.rechargeForm = this.fb.group({
      amount: ['', [Validators.required]],
      source: [''],
      promoCode: [''],
      topup_note: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.usergrId = Number(this.route.snapshot.paramMap.get('id'));
    logger.log("this.usergrId", this.usergrId)
    if (!this.usergrId) {
      this.errorMessage = 'usergrId ID is missing!';
    } else {
      // this.fetchPaymentMethods();
      this.getPaymentMethodByCurrentUser();
    }
  }


  getPaymentMethodByCurrentUser() {
    this.paymentMethodService.getPaymentMethodByCurrentUser().subscribe(
      (response) => {
        if (response.success && response.paymentMethod) {
          this.paymentMethods = response.paymentMethod;
          logger.log("this.paymentMethods = response.paymentMethod;", this.paymentMethods);
          this.populatePaymentMethodOptions();
        }
      },
      (error) => {
        logger.log('Error fetching payment methods for user:', error);
      }
    );
  }
  populatePaymentMethodOptions() {
    this.rechargeForm.get('source')?.setValue(this.paymentMethods.length ? this.paymentMethods[0].id : ''); // Set default option
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getCurrentTime(): string {
    return new Date().toTimeString().slice(0, 5);
  }

  onSubmit() {
    if (this.rechargeForm.invalid) {
      this.rechargeForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
  
    const rechargeData = {
      payment_method_id: this.rechargeForm.value.source,
      date: this.getCurrentDate(),
      time: this.getCurrentTime(),
      amount: this.rechargeForm.value.amount,
      promoCode: this.rechargeForm.value.promoCode,
      topup_note: (this.rechargeForm.value.topup_note || '').trim()    // 🆕 Arsyeja e TopUp-it
    };
  
    logger.log("rechargeData", rechargeData);
    logger.log("this.usergrId", this.usergrId);
  
    this.rechargeService.addRechargeForUserGroupAdmin(this.usergrId, rechargeData).subscribe(
      (response) => {
        logger.log('Recharge successful:', response);
        // window.open(response.retreiveOrder, '_blank');
        this.router.navigate(['/users/usergroup', this.usergrId]);
      },
      (error) => {
        this.handleRechargeError(error);
      }
    );
  }
  
  // Common error handler method
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
    logger.error('Recharge error:', error);
  }
}
