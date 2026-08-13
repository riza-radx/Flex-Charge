import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";

import { RfidCardRouting } from './rfid-card.routing';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { RfidCardCComponent } from './rfid-card-c/rfid-card-c.component';
import { RechargesComponent } from './recharges/recharges.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RfidCardDetailsComponent } from './rfid-card-details/rfid-card-details.component';
import { RechargeDetailsComponent } from './recharge-details/recharge-details.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { RadxrfidcardComponent } from './radxrfidcard/radxrfidcard/radxrfidcard.component';
import { CompanyrfidcardComponent } from './companyrfidcard/companyrfidcard/companyrfidcard.component';
import { PartnerrfidcardComponent } from './partnerrfidcard/partnerrfidcard/partnerrfidcard.component';
import { UsergrouprfidcardComponent } from './usergrouprfidcard/usergrouprfidcard/usergrouprfidcard.component';
import { UserrfidcardComponent } from './userrfidcard/userrfidcard/userrfidcard.component';
import { RadxrechargesComponent } from './radxrecharges/radxrecharges/radxrecharges.component';
import { CompanyrechargesComponent } from './companyrecharges/companyrecharges/companyrecharges.component';
import { RadxtransactionComponent } from './radxtransaction/radxtransaction/radxtransaction.component';
import { CompanytransactionComponent } from './companytransaction/companytransaction/companytransaction.component';
import { RadxcreaterfidcardComponent } from './radxcreaterfidcard/radxcreaterfidcard/radxcreaterfidcard.component';
import { CompanycreaterfidcardComponent } from './companycreaterfidcard/companycreaterfidcard/companycreaterfidcard.component';
import { RadxupdaterfidcardComponent } from './radxupdaterfidcard/radxupdaterfidcard/radxupdaterfidcard.component';
import { CompanyupdaterfidcardComponent } from './companyupdaterfidcard/companyupdaterfidcard/companyupdaterfidcard.component';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { RadxdeleterfidcardComponent } from './radxdeleterfidcard/radxdeleterfidcard.component';
import { AddradxrechargesComponent } from './addradxrecharges/addradxrecharges/addradxrecharges.component';
import { CreaterechargesComponent } from './createrecharges/createrecharges/createrecharges.component';
import { AddradxusergrouprechargesComponent } from './addusergrouprecharges/addradxusergrouprecharges/addradxusergrouprecharges.component';
import { AddradxuserrechargesComponent } from './addradxuserrecharges/addradxuserrecharges.component';
import { CountryService } from 'src/app/services/country/country.service';
import { AllRechargersComponent } from './all-rechargers/all-rechargers.component';
import { TransferMoneyComponent } from './transfer-money/transfer-money.component';
import { AuditLogComponent } from '../audit-log/audit-log.component';
import { CompanyBankAccountsComponent } from '../company-bank-accounts/company-bank-accounts.component';
// 🆕 RoamingAgreementsComponent eshte zhvendosur tek CompaniesModule (Company Agreements)



@NgModule({
  declarations: [
    RfidCardCComponent,
    RechargesComponent,
    TransactionsComponent,
    RfidCardDetailsComponent,
    RechargeDetailsComponent,
    TransactionDetailsComponent,
    RadxrfidcardComponent,
    CompanyrfidcardComponent,
    PartnerrfidcardComponent,
    UsergrouprfidcardComponent,
    UserrfidcardComponent,
    RadxrechargesComponent,
    CompanyrechargesComponent,
    RadxtransactionComponent,
    CompanytransactionComponent,
    RadxcreaterfidcardComponent,
    CompanycreaterfidcardComponent,
    RadxupdaterfidcardComponent,
    CompanyupdaterfidcardComponent,
    RadxdeleterfidcardComponent,
    AddradxrechargesComponent,
    CreaterechargesComponent,
    AddradxusergrouprechargesComponent,
    AddradxuserrechargesComponent,
    AllRechargersComponent,
    TransferMoneyComponent,
    AuditLogComponent,
    CompanyBankAccountsComponent
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
    RouterModule.forChild(RfidCardRouting),
    ReactiveFormsModule
  ],
  providers: [CountryService],
})
export class RfidCardModule { }
