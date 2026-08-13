import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";

import { UsersRoutes } from './users.routing';
import { UserComponent } from './user/user.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserGroupDetailsComponent } from './user-group-details/user-group-details.component';
import { RadxuserComponent } from './radxuser/radxuser/radxuser.component';
import { CompanyuserComponent } from './companyuser/companyuser/companyuser.component';
import { UsergroupuserComponent } from './usergroupuser/usergroupuser/usergroupuser.component';
import { PartneruserComponent } from './partneruser/partneruser/partneruser.component';
import { RadxusergroupComponent } from './radxusergroup/radxusergroup/radxusergroup.component';
import { CompanyusergroupComponent } from './companyusergroup/companyusergroup/companyusergroup.component';
import { RadxcreateuserComponent } from './radxcreateuser/radxcreateuser/radxcreateuser.component';
import { CompanycreateuserComponent } from './companycreate/companycreateuser/companycreateuser.component';
import { UsergroupcreateuserComponent } from './usergroupcreate/usergroupcreateuser/usergroupcreateuser.component';
import { PartnercreateuserComponent } from './partnercreate/partnercreateuser/partnercreateuser.component';
import { RadxupdateuserComponent } from './radxupdateuser/radxupdateuser/radxupdateuser.component';
import { CompanyupdateuserComponent } from './companyupdate/companyupdateuser/companyupdateuser.component';
import { UsergroupupdateuserComponent } from './usergroupupdate/usergroupupdateuser/usergroupupdateuser.component';
import { PartnerupdateuserComponent } from './partnerupdate/partnerupdateuser/partnerupdateuser.component';
import { RadxcreateusergroupComponent } from './radxcreateusergroup/radxcreateusergroup/radxcreateusergroup.component';
import { CompanycreateusergroupComponent } from './companycreateusergroup/companycreateusergroup/companycreateusergroup.component';
import { RadxupdateusergroupComponent } from './radxupdateusergroup/radxupdateusergroup/radxupdateusergroup.component';
import { CompanyupdateusergroupComponent } from './companyupdateusergroup/companyupdateusergroup/companyupdateusergroup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanydeleteuserComponent } from './companydeleteuser/companydeleteuser.component';
import { UsergroupmembersComponent } from './usergroupmembers/usergroupmembers/usergroupmembers.component';
import { CompanydeleteusergroupComponent } from './companydeleteusergroup/companydeleteusergroup/companydeleteusergroup.component';
import { UpdateUsergroupmembersComponent } from './updateUsergroupmembers/update-usergroupmembers/update-usergroupmembers.component';
import { CountryService } from 'src/app/services/country/country.service';

@NgModule({
  declarations: [
    UserComponent,
    UserGroupComponent,
    UserDetailsComponent,
    UserGroupDetailsComponent,
    RadxuserComponent,
    CompanyuserComponent,
    UsergroupuserComponent,
    PartneruserComponent,
    RadxusergroupComponent,
    CompanyusergroupComponent,
    RadxcreateuserComponent,
    CompanycreateuserComponent,
    UsergroupcreateuserComponent,
    PartnercreateuserComponent,
    RadxupdateuserComponent,
    CompanyupdateuserComponent,
    UsergroupupdateuserComponent,
    PartnerupdateuserComponent,
    RadxcreateusergroupComponent,
    CompanycreateusergroupComponent,
    RadxupdateusergroupComponent,
    CompanyupdateusergroupComponent,
    CompanydeleteuserComponent,
    UsergroupmembersComponent,
    CompanydeleteusergroupComponent,
    UpdateUsergroupmembersComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    // BrowserModule,
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
    RouterModule.forChild(UsersRoutes),
    ReactiveFormsModule
  ],
  exports: [UserComponent, UserGroupComponent],
  providers: [CountryService],
})
export class UsersModule { }
