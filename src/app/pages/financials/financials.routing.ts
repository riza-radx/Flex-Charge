import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialComponent } from './financial/financial.component';
import { FinancialdetailsComponent } from './financialdetails/financialdetails/financialdetails.component';
import { RadxcreatefinancialsComponent } from './radxcreatefinancials/radxcreatefinancials/radxcreatefinancials.component';
import { CompanycreatefinancialsComponent } from './companycreatefinancials/companycreatefinancials/companycreatefinancials.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';

export const FinancialsRouting: Routes =  [
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "financial",
        component: FinancialComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "financial/:id",
        component: FinancialdetailsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreatefinancial",
        component: RadxcreatefinancialsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "companycreatefinancial",
        component: CompanycreatefinancialsComponent
      }
    ]
  }
]
