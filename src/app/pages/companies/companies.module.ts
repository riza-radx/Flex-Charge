import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutes } from './companies.routing';
import { CompanyComponent } from './company/company.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPrintModule } from 'ngx-print';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { RadxcreatecompanyComponent } from './radxcreatecompany/radxcreatecompany/radxcreatecompany.component';
import { CompanyupdatecompanyComponent } from './companyupdatecompany/companyupdatecompany/companyupdatecompany.component';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanydeletecompanyComponent } from './companydeletecompany/companydeletecompany.component';
import { CompanymembersComponent } from './companymembers/companymembers/companymembers.component';
import { UpdateCompanymembersComponent } from './updateCompanymembers/update-companymembers/update-companymembers.component';
import { CountryService } from 'src/app/services/country/country.service';
// 🆕 Company Agreements (roaming view-only per Company)
import { RoamingAgreementsComponent } from '../roaming-agreements/roaming-agreements.component';

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyDetailsComponent,
    RadxcreatecompanyComponent,
    CompanyupdatecompanyComponent,
    CompanydeletecompanyComponent,
    CompanymembersComponent,
    UpdateCompanymembersComponent,
    RoamingAgreementsComponent
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
    RouterModule.forChild(CompaniesRoutes),
    ReactiveFormsModule,
  ],
  providers: [CountryService],
})
export class CompaniesModule { }
