import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReateComponent } from './reate/reate.component';
import { RateDetailsComponent } from './rate-details/rate-details.component';
import { PromodetailsComponent } from './promodetails/promodetails/promodetails.component';
import { VoucherdetailsComponent } from './voucherdetails/voucherdetails/voucherdetails.component';
import { PromoComponent } from './promo/promo.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { CurrencyComponent } from './currency/currency.component';
import { TaxesComponent } from './taxes/taxes.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';

import { RadxcreaterateComponent } from "./radxcreaterate/radxcreaterate/radxcreaterate.component";
import { CompanycreaterateComponent } from "./companycreaterate/companycreaterate/companycreaterate.component";
import { RadxupdaterateComponent } from "./radxupdaterate/radxupdaterate/radxupdaterate.component";
import { CompanyupdaterateComponent } from "./companyupdaterate/companyupdaterate/companyupdaterate.component";

import { RadxcreatepromoComponent } from "./radxcreatepromo/radxcreatepromo/radxcreatepromo.component";
import { RadxupdatepromoComponent } from "./radxupdatepromo/radxupdatepromo/radxupdatepromo.component";
import { CompanycreatepromoComponent } from "./companycreatepromo/companycreatepromo/companycreatepromo.component";
import { CompanyupdatepromoComponent } from "./companyupdatepromo/companyupdatepromo/companyupdatepromo.component";

import { RadxcreatevouchersComponent } from "./radxcreatevouchers/radxcreatevouchers/radxcreatevouchers.component";
import { RadxupdatevouchersComponent } from "./radxupdatevouchers/radxupdatevouchers/radxupdatevouchers.component";
import { CompanycreatevouchersComponent } from "./companycreatevouchers/companycreatevouchers/companycreatevouchers.component";
import { CompanyupdatevouchersComponent } from './companyupdatevouchers/companyupdatevouchers/companyupdatevouchers.component';

import { RadxcreatecurrencyComponent } from './radxcreatecurrency/radxcreatecurrency/radxcreatecurrency.component';
import { CompanycreatecurrencyComponent } from './companycreatecurrency/companycreatecurrency/companycreatecurrency.component';
import { RadxupdatecurrencyComponent } from './radxupdatecurrency/radxupdatecurrency/radxupdatecurrency.component';
import { CompanyupdatecurrencyComponent } from './companyupdatecurrency/companyupdatecurrency/companyupdatecurrency.component';

import { RadxcreatetaxesComponent } from './radxcreatetaxes/radxcreatetaxes/radxcreatetaxes.component';
import { CompanycreatetaxesComponent } from './companycreatetaxes/companycreatetaxes/companycreatetaxes.component';
import { RadxupdatetaxesComponent } from './radxupdatetaxes/radxupdatetaxes/radxupdatetaxes.component';
import { CompanyupdatetaxesComponent } from './companyupdatetaxes/companyupdatetaxes/companyupdatetaxes.component';

import { RadxcreaterateperdaysComponent } from './radxcreaterateperdays/radxcreaterateperdays/radxcreaterateperdays.component';
import { CompanycreaterateperdaysComponent } from './companycreaterateperdays/companycreaterateperdays/companycreaterateperdays.component';
import { RadxupdaterateperdaysComponent } from './radxupdaterateperdays/radxupdaterateperdays/radxupdaterateperdays.component';
import { CompanyupdaterateperdaysComponent } from './companyupdaterateperdays/companyupdaterateperdays/companyupdaterateperdays.component';
import { RadxdeleterateComponent } from './radxdeleterate/radxdeleterate.component';
import { RadxdeletepromoComponent } from './radxdeletepromo/radxdeletepromo.component';
import { RadxdeletevouchersComponent } from './radxdeletevouchers/radxdeletevouchers.component';
import { RadxdeletecurrencyComponent } from './radxdeletecurrency/radxdeletecurrency.component';
import { RadxdeletetaxesComponent } from './radxdeletetaxes/radxdeletetaxes.component';

import { UpdaterateperdaysComponent } from './updaterateperdays/updaterateperdays.component';
import { DeleterateperdaysComponent } from './deleterateperdays/deleterateperdays.component';
import { UsevoucherComponent } from './usevoucher/usevoucher.component';
import { UserusevoucherComponent } from './userusevoucher/userusevoucher.component';
import { UsergroupusevoucherComponent } from './usergroupusevoucher/usergroupusevoucher/usergroupusevoucher.component';
import { PromoCreateNotificationComponent } from './promcreateonotification/promocreatenotification.component';
import { UpdatePromoNotificationComponent } from './updatepromonotification/updatepromonotification.component';
import { DeletepromonotificationComponent } from './deletepromonotification/deletepromonotification.component';
// 🆕 Bursa Prices — ALPEX day-ahead market pricing
import { BursaPricesComponent } from '../bursa-prices/bursa-prices.component';
// import { DeletepromonotificationComponent } from './deletepromonotification/deletepromonotification.component';

export const RatesRouting: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "rate",
        component: ReateComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "rate/:id",
        component: RateDetailsComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "promo/:id",
        component: PromodetailsComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "vouchers/:id",
        component: VoucherdetailsComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreaterate",
        component: RadxcreaterateComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxupdaterate/:id",
        component: RadxupdaterateComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxdeleterate/:id",
        component: RadxdeleterateComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companycreaterate",
        component: CompanycreaterateComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companyupdaterate/:id",
        component: CompanyupdaterateComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreatepromo",
        component: RadxcreatepromoComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxupdatepromo/:id",
        component: RadxupdatepromoComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxdeletepromo/:id",
        component: RadxdeletepromoComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companycreatepromo",
        component: CompanycreatepromoComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companyupdatepromo/:id",
        component: CompanyupdatepromoComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreatevouchers",
        component: RadxcreatevouchersComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxupdatevouchers/:id",
        component: RadxupdatevouchersComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxdeletevouchers/:id",
        component: RadxdeletevouchersComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companycreatevouchers",
        component: CompanycreatevouchersComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companyupdatevouchers/:id",
        component: CompanyupdatevouchersComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreatecurrency",
        component: RadxcreatecurrencyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxupdatecurrency/:id",
        component: RadxupdatecurrencyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxdeletecurrency/:id",
        component: RadxdeletecurrencyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companycreatecurrency",
        component: CompanycreatecurrencyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companyupdatecurrency/:id",
        component: CompanyupdatecurrencyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreatetaxes",
        component: RadxcreatetaxesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxupdatetaxes/:id",
        component: RadxupdatetaxesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxdeletetaxes/:id",
        component: RadxdeletetaxesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companycreatetaxes",
        component: CompanycreatetaxesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companyupdatetaxes/:id",
        component: CompanyupdatetaxesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "promo",
        component: PromoComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "vouchers",
        component: VouchersComponent
      }
    ]
  },

  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "usevoucher",
        component: UsevoucherComponent
      },
      {
        path: "userusevoucher/:id",
        component: UserusevoucherComponent
      }
      ,
      {
        path: "usergroupusevoucher/:id",
        component: UsergroupusevoucherComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "currency",
        component: CurrencyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "taxes",
        component: TaxesComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "radxcreaterateperdays/:id",
        component: RadxcreaterateperdaysComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "updaterateperdays/:id",
        component: UpdaterateperdaysComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "deleterateperdays/:id",
        component: DeleterateperdaysComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "companycreaterateperdays/:id",
        component: CompanycreaterateperdaysComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "createpromonotification/:id",
        component: PromoCreateNotificationComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "updatepromonotification/:id",
        component: UpdatePromoNotificationComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "deletepromonotification/:id",
        component: DeletepromonotificationComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        // 🆕 Bursa Prices — ALPEX day-ahead market pricing
        path: "bursa-prices",
        component: BursaPricesComponent
      }
    ]
  },
]
