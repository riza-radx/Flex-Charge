import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialsRouting } from './financials.routing';
import { FinancialComponent } from './financial/financial.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { RadxfinancialsComponent } from './radxfinancials/radxfinancials/radxfinancials.component';
import { CompanyfinancialsComponent } from './companyfinancials/companyfinancials/companyfinancials.component';
import { PartnerfinancialsComponent } from './partnerfinancials/partnerfinancials/partnerfinancials.component';
import { UsergroupfinancialsComponent } from './usergroupfinancials/usergroupfinancials/usergroupfinancials.component';
import { UserfinancialsComponent } from './userfinancials/userfinancials/userfinancials.component';
import { FormsModule } from '@angular/forms';
import { RadxcreatefinancialsComponent } from './radxcreatefinancials/radxcreatefinancials/radxcreatefinancials.component';
import { CompanycreatefinancialsComponent } from './companycreatefinancials/companycreatefinancials/companycreatefinancials.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPrintModule } from 'ngx-print';
import { FinancialdetailsComponent } from './financialdetails/financialdetails/financialdetails.component';


@NgModule({
  declarations: [
    FinancialComponent,
    RadxfinancialsComponent,
    CompanyfinancialsComponent,
    PartnerfinancialsComponent,
    UsergroupfinancialsComponent,
    UserfinancialsComponent,
    RadxcreatefinancialsComponent,
    CompanycreatefinancialsComponent,
    FinancialdetailsComponent
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
    RouterModule.forChild(FinancialsRouting)
  ]
})
export class FinancialsModule { }
