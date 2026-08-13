import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersRouting } from './partners.routing';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { PartnerComponent } from './partner/partner.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPrintModule } from 'ngx-print';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { RadxpartnerComponent } from './radxpartner/radxpartner/radxpartner.component';
import { CompanypartnerComponent } from './companypartner/companypartner/companypartner.component';
import { RadxcreatepartnerComponent } from './radxcreatepartner/radxcreatepartner/radxcreatepartner.component';
import { CompanycreatepartnerComponent } from './companycreatepartner/companycreatepartner/companycreatepartner.component';
import { RadxupdatepartnerComponent } from './radxupdatepartner/radxupdatepartner/radxupdatepartner.component';
import { CompanyupdatepartnerComponent } from './companyupdatepartner/companyupdatepartner/companyupdatepartner.component';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanydeletepartnerComponent } from './companydeletepartner/companydeletepartner.component';
import { PartnermembersComponent } from './partnermembers/partnermembers/partnermembers.component';
import { UpdatePartnermembersComponent } from './updatePartnermembers/update-partnermembers/update-partnermembers.component';
import { DeletePartnermembersComponent } from './deletePartnermembers/delete-partnermembers/delete-partnermembers.component';
import { CountryService } from 'src/app/services/country/country.service';


@NgModule({
  declarations: [
    PartnerComponent,
    PartnerDetailsComponent,
    RadxpartnerComponent,
    CompanypartnerComponent,
    RadxcreatepartnerComponent,
    CompanycreatepartnerComponent,
    RadxupdatepartnerComponent,
    CompanyupdatepartnerComponent,
    CompanydeletepartnerComponent,
    PartnermembersComponent,
    UpdatePartnermembersComponent,
    DeletePartnermembersComponent
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
    RouterModule.forChild(PartnersRouting),
    ReactiveFormsModule
  ],
  providers: [CountryService],
})
export class PartnersModule { }
