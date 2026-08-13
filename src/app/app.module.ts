import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ForbiddenInterceptor } from "./interceptors/forbidden.interceptor";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ToastrModule } from "ngx-toastr";
import { TagInputModule } from "ngx-chips";
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { RecaptchaFormsModule, RecaptchaModule } from "ng-recaptcha";

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PresentationModule } from "./pages/presentation/presentation.module";

import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from "./components/components.module";

import { AppRoutingModule } from './app-routing.module';
import { ChargersComponent } from './pages/chargers/chargers/chargers.component';
import { LocationsComponent } from './pages/locations/locations/locations.component';
import { VehicleComponent } from './pages/vehicle/vehicle.component';

import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ChargerDetailsComponent } from './pages/chargers/charger-details/charger-details.component';
import { LocationDetailsComponent } from './pages/locations/location-details/location-details.component';
import { VehicleDetailsComponent } from './pages/vehicle/vehicle-details/vehicle-details.component';
import { ChargingDetailsComponent } from './pages/charging/charging-details/charging-details.component';
import { AlarmDetailsComponent } from './pages/alarm/alarm-details/alarm-details.component';
import { ReservationDetailsComponent } from './pages/reservation/reservation-details/reservation-details.component';
import { RadxvehicleComponent } from './pages/vehicle/radxvehicle/radxvehicle/radxvehicle.component';
import { CompanyvehicleComponent } from './pages/vehicle/companyvehicle/companyvehicle/companyvehicle.component';
import { PartnervehicleComponent } from './pages/vehicle/partnervehicle/partnervehicle/partnervehicle.component';
import { UsergroupvehicleComponent } from './pages/vehicle/usergroupvehicle/usergroupvehicle/usergroupvehicle.component';
import { UservehicleComponent } from './pages/vehicle/uservehicle/uservehicle/uservehicle.component';
import { RadxcreatevehicleComponent } from './pages/vehicle/radxcreatevehicle/radxcreatevehicle/radxcreatevehicle.component';
import { CompanycreatevehicleComponent } from './pages/vehicle/companycreatevehicle/companycreatevehicle/companycreatevehicle.component';
import { PartnercreatevehicleComponent } from './pages/vehicle/partnercreatevehicle/partnercreatevehicle/partnercreatevehicle.component';
import { UsergroupcreatevehicleComponent } from './pages/vehicle/usergroupcreatevehicle/usergroupcreatevehicle/usergroupcreatevehicle.component';
import { UsercreatevehicleComponent } from './pages/vehicle/usercreatevehicle/usercreatevehicle/usercreatevehicle.component';
import { RadxupdatevehicleComponent } from './pages/vehicle/radxupdatevehicle/radxupdatevehicle/radxupdatevehicle.component';
import { CompanyupdatevehicleComponent } from './pages/vehicle/companyupdatevehicle/companyupdatevehicle/companyupdatevehicle.component';
import { CompanydeletevehicleComponent } from "./pages/vehicle/companydeletevehicle/companydeletevehicle.component";
import { PartnerupdatevehicleComponent } from './pages/vehicle/partnerupdatevehicle/partnerupdatevehicle/partnerupdatevehicle.component';
import { UsergroupupdatevehicleComponent } from './pages/vehicle/usergroupupdatevehicle/usergroupupdatevehicle/usergroupupdatevehicle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CharginghistorydetailsComponent } from './pages/chargiinghistory/charginghistorydetails/charginghistorydetails.component';
import { AllCharginhHistoryComponent } from './pages.dashboards/all-charginh-history/all-charginh-history.component';
// import { NottificationsComponent } from './pages/nottifications/nottifications/nottifications.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    // ChargersComponent,
    // LocationsComponent,
    VehicleComponent,
    // ChargerDetailsComponent,
    // LocationDetailsComponent,
    // VehicleDetailsComponent,
    ChargingDetailsComponent,
    AlarmDetailsComponent,
    ReservationDetailsComponent,
    RadxvehicleComponent,
    CompanyvehicleComponent,
    PartnervehicleComponent,
    UsergroupvehicleComponent,
    UservehicleComponent,
    RadxcreatevehicleComponent,
    CompanycreatevehicleComponent,
    PartnercreatevehicleComponent,
    UsergroupcreatevehicleComponent,
    UsercreatevehicleComponent,
    RadxupdatevehicleComponent,
    CompanyupdatevehicleComponent,
    CompanydeletevehicleComponent,
    PartnerupdatevehicleComponent,
    UsergroupupdatevehicleComponent,
    CharginghistorydetailsComponent,
    AllCharginhHistoryComponent,
    // NottificationsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ComponentsModule,
    BsDropdownModule.forRoot(),
    AppRoutingModule,
    ToastrModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    NgxDatatableModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxPrintModule,
    TagInputModule,
    PresentationModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ForbiddenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
