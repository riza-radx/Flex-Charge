import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserGroupDetailsComponent } from './user-group-details/user-group-details.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';

import { RadxcreateuserComponent } from "./radxcreateuser/radxcreateuser/radxcreateuser.component";
import { RadxupdateuserComponent } from "./radxupdateuser/radxupdateuser/radxupdateuser.component";
import { RadxcreateusergroupComponent } from "./radxcreateusergroup/radxcreateusergroup/radxcreateusergroup.component";
import { RadxupdateusergroupComponent } from "./radxupdateusergroup/radxupdateusergroup/radxupdateusergroup.component";

import { CompanycreateuserComponent } from "./companycreate/companycreateuser/companycreateuser.component";
import { CompanyupdateuserComponent } from "./companyupdate/companyupdateuser/companyupdateuser.component";
import { CompanycreateusergroupComponent } from "./companycreateusergroup/companycreateusergroup/companycreateusergroup.component";
import { CompanyupdateusergroupComponent } from "./companyupdateusergroup/companyupdateusergroup/companyupdateusergroup.component";
import { CompanydeleteusergroupComponent } from "./companydeleteusergroup/companydeleteusergroup/companydeleteusergroup.component";

import { UsergroupcreateuserComponent } from "./usergroupcreate/usergroupcreateuser/usergroupcreateuser.component";
import { UsergroupupdateuserComponent } from "./usergroupupdate/usergroupupdateuser/usergroupupdateuser.component";
import { UsergroupmembersComponent } from "./usergroupmembers/usergroupmembers/usergroupmembers.component";

import { PartnercreateuserComponent } from "./partnercreate/partnercreateuser/partnercreateuser.component";
import { PartnerupdateuserComponent } from "./partnerupdate/partnerupdateuser/partnerupdateuser.component";
import { CompanydeleteuserComponent } from './companydeleteuser/companydeleteuser.component';

import { UpdateUsergroupmembersComponent } from './updateUsergroupmembers/update-usergroupmembers/update-usergroupmembers.component';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
export const UsersRoutes: Routes = [
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user",
            component: UserComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/:id",
            component: UserDetailsComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "usergroup",
            component: UserGroupComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "addusergroupmember/:id",
            component: UsergroupmembersComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "updateusergroupmember/:id",
            component: UpdateUsergroupmembersComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "usergroup/:id",
            component: UserGroupDetailsComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/create/radx",
            component: RadxcreateuserComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/update/radx/:id",
            component: RadxupdateuserComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "usergroup/create/radx",
            component: RadxcreateusergroupComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "usergroup/update/radx/:id",
            component: RadxupdateusergroupComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/create/company",
            component: CompanycreateuserComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/update/company/:id",
            component: CompanyupdateuserComponent
          }
        ]
    },
    {
      path: "",
      canActivate: [AuthGuard],
      children: [
        {
          path: "user/delete/company/:id",
          component: CompanydeleteuserComponent
        }
      ]
  },
    {
      path: "",
      canActivate: [AuthGuard],
      children: [
        {
          path: "usergroup/delete/company/:id",
          component: CompanydeleteusergroupComponent
        }
      ]
  },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "usergroup/create/company",
            component: CompanycreateusergroupComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "usergroup/update/company/:id",
            component: CompanyupdateusergroupComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/create/usergroup",
            component: UsergroupcreateuserComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/update/usergroup/:id",
            component: UsergroupupdateuserComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/create/partner",
            component: PartnercreateuserComponent
          }
        ]
    },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [
          {
            path: "user/update/partner/:id",
            component: PartnerupdateuserComponent
          }
        ]
    }
];
