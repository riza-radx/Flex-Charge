import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { SuccessurlComponent } from './successurl/successurl.component';
import { FailureurlComponent } from './failureurl/failureurl.component';


@NgModule({
  declarations: [
    PaymentComponent,
    SuccessurlComponent,
    FailureurlComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
