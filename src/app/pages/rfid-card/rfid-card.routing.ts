import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfidCardCComponent } from './rfid-card-c/rfid-card-c.component';
import { RfidCardDetailsComponent } from './rfid-card-details/rfid-card-details.component';
import { RechargesComponent } from './recharges/recharges.component';
import { RechargeDetailsComponent } from './recharge-details/recharge-details.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';

import { RadxcreaterfidcardComponent } from "./radxcreaterfidcard/radxcreaterfidcard/radxcreaterfidcard.component";
import { RadxupdaterfidcardComponent } from "./radxupdaterfidcard/radxupdaterfidcard/radxupdaterfidcard.component";
import { CompanycreaterfidcardComponent } from "./companycreaterfidcard/companycreaterfidcard/companycreaterfidcard.component";
import { CompanyupdaterfidcardComponent } from "./companyupdaterfidcard/companyupdaterfidcard/companyupdaterfidcard.component";
import { RadxdeleterfidcardComponent } from './radxdeleterfidcard/radxdeleterfidcard.component';
import { AddradxrechargesComponent } from './addradxrecharges/addradxrecharges/addradxrecharges.component';
import { CreaterechargesComponent } from './createrecharges/createrecharges/createrecharges.component';
import { AddradxusergrouprechargesComponent } from './addusergrouprecharges/addradxusergrouprecharges/addradxusergrouprecharges.component';
import { AddradxuserrechargesComponent } from './addradxuserrecharges/addradxuserrecharges.component';
import { AllRechargersComponent } from './all-rechargers/all-rechargers.component';
import { TransferMoneyComponent } from './transfer-money/transfer-money.component';
import { AuditLogComponent } from '../audit-log/audit-log.component';
import { CompanyBankAccountsComponent } from '../company-bank-accounts/company-bank-accounts.component';
// 🆕 RoamingAgreements eshte zhvendosur tek /companies/agreements

export const RfidCardRouting: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "rfidcard",
        component: RfidCardCComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "rfidcard/:id",
        component: RfidCardDetailsComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreaterfidcard",
        component: RadxcreaterfidcardComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "updateradxrfidcard/:id",
        component: RadxupdaterfidcardComponent
      }
    ]
  }, {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "deleteradxrfidcard/:id",
        component: RadxdeleterfidcardComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companycreaterfidcard",
        component: CompanycreaterfidcardComponent
      }
    ]
  },

  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "recharges",
        component: RechargesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "recharge",
        component: CreaterechargesComponent
      }
    ]
  },

  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "recharges/:id",
        component: RechargeDetailsComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "addrecharges/:id",
        component: AddradxuserrechargesComponent
      },
      {
        path: "addusergrouprecharges/:id",
        component: AddradxusergrouprechargesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "transactions",
        component: TransactionsComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "transactions/:id",
        component: TransactionDetailsComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "allrecharges",
        component: AllRechargersComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "transfer-money",
        component: TransferMoneyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "audit-logs",
        component: AuditLogComponent
      },
      {
        // 🆕 Page i ri per menaxhimin e llogarive bankare
        path: "bank-accounts",
        component: CompanyBankAccountsComponent
      }
    ]
  },
]
