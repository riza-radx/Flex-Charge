import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

// import { DashboardComponent } from "./dashboard/dashboard.component";
import { AlternativeComponent } from "./alternative/alternative.component";

import { RouterModule } from "@angular/router";
import { DashboardsRoutes } from "./dashboards.routing";
import { ChargingComponent } from './charging/charging.component';
import { StationStatusComponent } from './station-status/station-status.component';
import { RealTimeComponent } from './real-time/real-time.component';
import { AlarmComponent } from './alarm/alarm.component';
import { ReservationComponent } from './reservation/reservation.component';
import { MonitoringRoutes } from "./monitoring.routing";
import { RadxmonitoringComponent } from './radxmonitoring/radxmonitoring/radxmonitoring.component';
import { CompanymonitoringComponent } from './companymonitoring/companymonitoring/companymonitoring.component';
import { PartnermonitoringComponent } from './partnermonitoring/partnermonitoring/partnermonitoring.component';
import { RadxstationstatusComponent } from './radxstationstatus/radxstationstatus/radxstationstatus.component';
import { CompanystationstatusComponent } from './companystationstatus/companystationstatus/companystationstatus.component';
import { PartnerstationstatusComponent } from './partnerstationstatus/partnerstationstatus/partnerstationstatus.component';
import { RadxalarmComponent } from './radxalarm/radxalarm/radxalarm.component';
// import { CompanyalarmComponent } from './companyalarm/companyalarm/companyalarm.component';
// import { PartneralarmComponent } from './partneralarm/partneralarm/partneralarm.component';
import { UsergroupchargingComponent } from './usergroupcharging/usergroupcharging/usergroupcharging.component';
import { AddReservationComponent } from './addReservation/add-reservation/add-reservation.component';
import { FormsModule } from '@angular/forms';
import { DeleteReservationComponent } from './delete-reservation/delete-reservation.component';  // Import FormsModule


@NgModule({
  declarations: [AlternativeComponent, ChargingComponent, StationStatusComponent, RealTimeComponent, AlarmComponent, ReservationComponent, RadxmonitoringComponent, CompanymonitoringComponent, PartnermonitoringComponent, RadxstationstatusComponent, CompanystationstatusComponent, PartnerstationstatusComponent, RadxalarmComponent, UsergroupchargingComponent, AddReservationComponent, DeleteReservationComponent],
  imports: [
    CommonModule,
    ComponentsModule,
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
    RouterModule.forChild(MonitoringRoutes),
    FormsModule,
    ReactiveFormsModule
    // RouterModule.forChild(DashboardsRoutes)
  ],
  exports: [AlternativeComponent, ChargingComponent, StationStatusComponent, RealTimeComponent, AlarmComponent, ReservationComponent, RadxmonitoringComponent, CompanymonitoringComponent, PartnermonitoringComponent, RadxstationstatusComponent, CompanystationstatusComponent, PartnerstationstatusComponent, RadxalarmComponent, UsergroupchargingComponent]
})
export class MonitoringModule {}
