import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthLayoutRoutes } from "./auth-layout.routing";

import { LoginComponent } from "../../pages/examples/login/login.component";
import { PricingComponent } from "../../pages/examples/pricing/pricing.component";
import { LockComponent } from "../../pages/examples/lock/lock.component";
import { RegisterComponent } from "../../pages/examples/register/register.component";

import { ForgotpasswordComponent } from '../../pages/examples/forgotpassword/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from '../../pages/examples/resetpassword/resetpassword/resetpassword.component';
import { VerifyemailComponent } from '../../pages/examples/verifyemail/verifyemail/verifyemail.component';
import { VerifyPhonePopupComponent } from "src/app/pages/examples/verify-phone-popup/verify-phone-popup.component";
import { ComponentsModule } from "src/app/components/components.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { RecaptchaFormsModule, RecaptchaModule } from "ng-recaptcha";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ComponentsModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    RecaptchaModule,
    // RecaptchaFormsModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    PricingComponent,
    LockComponent,
    RegisterComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    VerifyemailComponent,
    VerifyPhonePopupComponent
  ]
})
export class AuthLayoutModule { }
