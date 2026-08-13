import { Routes } from "@angular/router";

import { ProfileComponent } from "./profile/profile.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { AppnotificationsComponent } from './appnotifications/appnotifications.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword/resetpassword.component';

export const ExamplesRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "timeline",
        component: TimelineComponent
      },
      {
        path: "appnotifications",
        component: AppnotificationsComponent
      }
    ]
  }
];
