import { Routes } from "@angular/router";

import { LoginComponent } from "../../pages/examples/login/login.component";
import { PricingComponent } from "../../pages/examples/pricing/pricing.component";
import { LockComponent } from "../../pages/examples/lock/lock.component";
import { RegisterComponent } from "../../pages/examples/register/register.component";
import { ForgotpasswordComponent } from "../../pages/examples/forgotpassword/forgotpassword/forgotpassword.component";
import { ResetpasswordComponent } from "../../pages/examples/resetpassword/resetpassword/resetpassword.component";
import { VerifyemailComponent } from "../../pages/examples/verifyemail/verifyemail/verifyemail.component";

import { PresentationComponent } from "../../pages/presentation/presentation.component";

export const AuthLayoutRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        component: LoginComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "lock",
        component: LockComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "forgotpassword",
        component: ForgotpasswordComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "resetpassword/:id",
        component: ResetpasswordComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "verify/:email/:token",
        component: VerifyemailComponent
      }
    ]
  },

  {
    path: "",
    children: [
      {
        path: "register",
        component: RegisterComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "pricing",
        component: PricingComponent
      }
    ]
  }
];
