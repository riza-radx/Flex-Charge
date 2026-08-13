import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";

import { LogsRouting } from './logs.routing';
import { LogComponent } from './log/log.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { LogDetailsComponent } from './log-details/log-details.component';


@NgModule({
  declarations: [
    LogComponent,
    LogDetailsComponent
  ],
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
    RouterModule.forChild(LogsRouting),
  ]
})
export class LogsModule { }
