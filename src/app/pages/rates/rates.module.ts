import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";

import { RatesRouting } from './rates.routing';
import { ReateComponent } from './reate/reate.component';
import { PromoComponent } from './promo/promo.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { CurrencyComponent } from './currency/currency.component';
import { TaxesComponent } from './taxes/taxes.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { RateDetailsComponent } from './rate-details/rate-details.component';
import { RadxrateComponent } from './radxrate/radxrate/radxrate.component';
import { CompanyrateComponent } from './companyrate/companyrate/companyrate.component';
import { RadxpromoComponent } from './radxpromo/radxpromo/radxpromo.component';
import { CompanypromoComponent } from './companypromo/companypromo/companypromo.component';
import { RadxvouchersComponent } from './radxvouchers/radxvouchers/radxvouchers.component';
import { CompanyvouchersComponent } from './companyvouchers/companyvouchers/companyvouchers.component';
import { RadxcurrencyComponent } from './radxcurrency/radxcurrency/radxcurrency.component';
import { CompanycurrencyComponent } from './companycurrency/companycurrency/companycurrency.component';
import { RadxtaxesComponent } from './radxtaxes/radxtaxes/radxtaxes.component';
import { CompanytaxesComponent } from './companytaxes/companytaxes/companytaxes.component';
import { RadxcreaterateComponent } from './radxcreaterate/radxcreaterate/radxcreaterate.component';
import { CompanycreaterateComponent } from './companycreaterate/companycreaterate/companycreaterate.component';
import { RadxupdaterateComponent } from './radxupdaterate/radxupdaterate/radxupdaterate.component';
import { CompanyupdaterateComponent } from './companyupdaterate/companyupdaterate/companyupdaterate.component';
import { RadxcreatepromoComponent } from './radxcreatepromo/radxcreatepromo/radxcreatepromo.component';
import { CompanycreatepromoComponent } from './companycreatepromo/companycreatepromo/companycreatepromo.component';
import { RadxupdatepromoComponent } from './radxupdatepromo/radxupdatepromo/radxupdatepromo.component';
import { CompanyupdatepromoComponent } from './companyupdatepromo/companyupdatepromo/companyupdatepromo.component';
import { RadxcreatevouchersComponent } from './radxcreatevouchers/radxcreatevouchers/radxcreatevouchers.component';
import { CompanycreatevouchersComponent } from './companycreatevouchers/companycreatevouchers/companycreatevouchers.component';
import { RadxupdatevouchersComponent } from './radxupdatevouchers/radxupdatevouchers/radxupdatevouchers.component';
import { CompanyupdatevouchersComponent } from './companyupdatevouchers/companyupdatevouchers/companyupdatevouchers.component';
import { RadxcreatecurrencyComponent } from './radxcreatecurrency/radxcreatecurrency/radxcreatecurrency.component';
import { CompanycreatecurrencyComponent } from './companycreatecurrency/companycreatecurrency/companycreatecurrency.component';
import { RadxupdatecurrencyComponent } from './radxupdatecurrency/radxupdatecurrency/radxupdatecurrency.component';
import { CompanyupdatecurrencyComponent } from './companyupdatecurrency/companyupdatecurrency/companyupdatecurrency.component';
import { RadxcreatetaxesComponent } from './radxcreatetaxes/radxcreatetaxes/radxcreatetaxes.component';
import { CompanycreatetaxesComponent } from './companycreatetaxes/companycreatetaxes/companycreatetaxes.component';
import { RadxupdatetaxesComponent } from './radxupdatetaxes/radxupdatetaxes/radxupdatetaxes.component';
import { CompanyupdatetaxesComponent } from './companyupdatetaxes/companyupdatetaxes/companyupdatetaxes.component';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RadxcreaterateperdaysComponent } from './radxcreaterateperdays/radxcreaterateperdays/radxcreaterateperdays.component';
import { CompanycreaterateperdaysComponent } from './companycreaterateperdays/companycreaterateperdays/companycreaterateperdays.component';
import { RadxupdaterateperdaysComponent } from './radxupdaterateperdays/radxupdaterateperdays/radxupdaterateperdays.component';
import { CompanyupdaterateperdaysComponent } from './companyupdaterateperdays/companyupdaterateperdays/companyupdaterateperdays.component';
import { RadxdeleterateComponent } from './radxdeleterate/radxdeleterate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RadxdeletepromoComponent } from './radxdeletepromo/radxdeletepromo.component';
import { RadxdeletevouchersComponent } from './radxdeletevouchers/radxdeletevouchers.component';
import { RadxdeletecurrencyComponent } from './radxdeletecurrency/radxdeletecurrency.component';
import { RadxdeletetaxesComponent } from './radxdeletetaxes/radxdeletetaxes.component';
import { PromodetailsComponent } from './promodetails/promodetails/promodetails.component';
import { VoucherdetailsComponent } from './voucherdetails/voucherdetails/voucherdetails.component';
import { UpdaterateperdaysComponent } from './updaterateperdays/updaterateperdays.component';
import { DeleterateperdaysComponent } from './deleterateperdays/deleterateperdays.component';
import { UsevoucherComponent } from './usevoucher/usevoucher.component';
import { UserusevoucherComponent } from './userusevoucher/userusevoucher.component';
import { UsergroupusevoucherComponent } from './usergroupusevoucher/usergroupusevoucher/usergroupusevoucher.component';
import { PromoCreateNotificationComponent } from './promcreateonotification/promocreatenotification.component';
import { UpdatePromoNotificationComponent } from './updatepromonotification/updatepromonotification.component';
import { DeletepromonotificationComponent } from './deletepromonotification/deletepromonotification.component';
// 🆕 Bursa Prices — ALPEX day-ahead pricing per chargers me uses_bursa_price=true
import { BursaPricesComponent } from '../bursa-prices/bursa-prices.component';
// import { DeletepromonotificationComponent } from './deletepromonotification/deletepromonotification.component';

@NgModule({
  declarations: [
    ReateComponent,
    PromoComponent,
    VouchersComponent,
    CurrencyComponent,
    TaxesComponent,
    RateDetailsComponent,
    RadxrateComponent,
    CompanyrateComponent,
    RadxpromoComponent,
    CompanypromoComponent,
    RadxvouchersComponent,
    CompanyvouchersComponent,
    RadxcurrencyComponent,
    CompanycurrencyComponent,
    RadxtaxesComponent,
    CompanytaxesComponent,
    RadxcreaterateComponent,
    CompanycreaterateComponent,
    RadxupdaterateComponent,
    CompanyupdaterateComponent,
    RadxcreatepromoComponent,
    CompanycreatepromoComponent,
    RadxupdatepromoComponent,
    CompanyupdatepromoComponent,
    RadxcreatevouchersComponent,
    CompanycreatevouchersComponent,
    RadxupdatevouchersComponent,
    CompanyupdatevouchersComponent,
    RadxcreatecurrencyComponent,
    CompanycreatecurrencyComponent,
    RadxupdatecurrencyComponent,
    CompanyupdatecurrencyComponent,
    RadxcreatetaxesComponent,
    CompanycreatetaxesComponent,
    RadxupdatetaxesComponent,
    CompanyupdatetaxesComponent,
    RadxcreaterateperdaysComponent,
    CompanycreaterateperdaysComponent,
    RadxupdaterateperdaysComponent,
    CompanyupdaterateperdaysComponent,
    RadxdeleterateComponent,
    RadxdeletepromoComponent,
    RadxdeletevouchersComponent,
    RadxdeletecurrencyComponent,
    RadxdeletetaxesComponent,
    PromodetailsComponent,
    VoucherdetailsComponent,
    UpdaterateperdaysComponent,
    DeleterateperdaysComponent,
    UsevoucherComponent,
    UserusevoucherComponent,
    UsergroupusevoucherComponent,
    PromoCreateNotificationComponent,
    UpdatePromoNotificationComponent,
    DeletepromonotificationComponent,
    BursaPricesComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    NgxPrintModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forChild(RatesRouting),
    ReactiveFormsModule
  ]
})
export class RatesModule { }