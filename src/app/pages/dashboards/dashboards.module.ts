import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

import { DashboardComponent } from "./dashboard/dashboard.component";
// import { AlternativeComponent } from "./alternative/alternative.component";

import { RouterModule } from "@angular/router";
import { DashboardsRoutes } from "./dashboards.routing";
// import { ChargingComponent } from './charging/charging.component';
// import { StationStatusComponent } from './station-status/station-status.component';
// import { RealTimeComponent } from './real-time/real-time.component';
// import { AlarmComponent } from './alarm/alarm.component';
// import { ReservationComponent } from './reservation/reservation.component';
import { MonitoringRoutes } from "./monitoring.routing";
import { StationStatusDetailsComponent } from './station-status-details/station-status-details.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard/admindashboard.component';
import { ModeratordashboardComponent } from './moderatordashboard/moderatordashboard/moderatordashboard.component';
import { CompanyadmindashboardComponent } from './companyadmindashboard/companyadmindashboard/companyadmindashboard.component';
import { CompanyemployeedashboardComponent } from './companyemployeedashboard/companyemployeedashboard/companyemployeedashboard.component';
import { UsergroupadmindashboardComponent } from './usergroupadmindashboard/usergroupadmindashboard/usergroupadmindashboard.component';
import { UsergroupmoderatordashboardComponent } from './usergroupmoderatordashboard/usergroupmoderatordashboard/usergroupmoderatordashboard.component';
import { UsergroupuserdashboardComponent } from './usergroupuserdashboard/usergroupuserdashboard/usergroupuserdashboard.component';
import { PartneradmindashboardComponent } from './partneradmindashboard/partneradmindashboard/partneradmindashboard.component';
import { PartnermoderatordashboardComponent } from './partnermoderatordashboard/partnermoderatordashboard/partnermoderatordashboard.component';
import { UserdashboardComponent } from './userdashboard/userdashboard/userdashboard.component';
import { CompanymoderatordashboardComponent } from './companymoderatordashboard/companymoderatordashboard/companymoderatordashboard.component';
import { CompanyoperatordashboardComponent } from './companyoperatordashboard/companyoperatordashboard/companyoperatordashboard.component';
import { CompanytechnicalsupportdashboardComponent } from './companytechnicalsupportdashboard/companytechnicalsupportdashboard/companytechnicalsupportdashboard.component';
import { CompanymaintenancespecialistdashboardComponent } from './companymaintenancespecialistdashboard/companymaintenancespecialistdashboard/companymaintenancespecialistdashboard.component';
import { CompanycallcenterdashboardComponent } from './companycallcenterdashboard/companycallcenterdashboard/companycallcenterdashboard.component';
import { CompanyanalystdashboardComponent } from './companyanalystdashboard/companyanalystdashboard/companyanalystdashboard.component';
import { SuperuserdashboardComponent } from './superuserdashboard/superuserdashboard/superuserdashboard.component';
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
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';
// 🆕 Global Energy Report — accessible from dashboard link
import { EnergyReportComponent } from '../energy-report/energy-report.component';
import { RouterModule as ARouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent, StationStatusDetailsComponent, AdmindashboardComponent, ModeratordashboardComponent, CompanyadmindashboardComponent, CompanyemployeedashboardComponent, UsergroupadmindashboardComponent, UsergroupmoderatordashboardComponent, UsergroupuserdashboardComponent, PartneradmindashboardComponent, PartnermoderatordashboardComponent, UserdashboardComponent, CompanymoderatordashboardComponent, CompanyoperatordashboardComponent, CompanytechnicalsupportdashboardComponent, CompanymaintenancespecialistdashboardComponent, CompanycallcenterdashboardComponent, CompanyanalystdashboardComponent, SuperuserdashboardComponent, ConfirmationDialogComponent, EnergyReportComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    // RouterModule.forChild(MonitoringRoutes),
    RouterModule.forChild(DashboardsRoutes),
    FormsModule
  ],
  exports: [DashboardComponent]
})
export class DashboardsModule {}
