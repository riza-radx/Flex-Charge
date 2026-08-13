import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerComponent } from './partner/partner.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { PartnermembersComponent } from './partnermembers/partnermembers/partnermembers.component';
import { RadxcreatepartnerComponent } from "./radxcreatepartner/radxcreatepartner/radxcreatepartner.component";
import { RadxupdatepartnerComponent } from "./radxupdatepartner/radxupdatepartner/radxupdatepartner.component";
import { CompanycreatepartnerComponent } from "./companycreatepartner/companycreatepartner/companycreatepartner.component";
import { CompanyupdatepartnerComponent } from "./companyupdatepartner/companyupdatepartner/companyupdatepartner.component";
import { AuthGuard } from '../../services/authGuard/auth.guard';
import { CompanydeletepartnerComponent } from './companydeletepartner/companydeletepartner.component';
import { UpdatePartnermembersComponent } from './updatePartnermembers/update-partnermembers/update-partnermembers.component';


export const PartnersRouting: Routes = [
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "partner",
        component: PartnerComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "partner/:id",
        component: PartnerDetailsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "addmember/:id",
        component: PartnermembersComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "updatemember/:id",
        component: UpdatePartnermembersComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreatepartner",
        component: RadxcreatepartnerComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "radxupdatepartner/:id",
        component: RadxupdatepartnerComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "companycreatepartner",
        component: CompanycreatepartnerComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "companyupdatepartner/:id",
        component: CompanyupdatepartnerComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "companydeletepartner/:id",
        component: CompanydeletepartnerComponent
      }
    ]
  }
]
