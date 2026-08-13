import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { RecaptchaFormsModule, RecaptchaModule } from "ng-recaptcha";

import { ProfileComponent } from "./profile/profile.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from "@angular/router";
import { ExamplesRoutes } from "./examples.routing";
import { AppnotificationsComponent } from './appnotifications/appnotifications.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { ForgotpasswordComponent } from './forgotpassword/forgotpassword/forgotpassword.component';
// import { ResetpasswordComponent } from './resetpassword/resetpassword/resetpassword.component';
// import { VerifyemailComponent } from './verifyemail/verifyemail/verifyemail.component';

@NgModule({
  declarations: [ProfileComponent, TimelineComponent, AppnotificationsComponent],
  imports: [
    CommonModule,
    RecaptchaModule,
        RecaptchaFormsModule,
    RouterModule.forChild(ExamplesRoutes),
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    NgxDatatableModule,
  ]
})
export class ExamplesModule { }
