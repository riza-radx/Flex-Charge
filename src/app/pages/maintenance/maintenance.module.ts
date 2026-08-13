import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRouting } from './maintenance.routing';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forChild(MaintenanceRouting)
  ]
})
export class MaintenanceModule { }
