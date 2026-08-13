import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRouting } from './settings.routing';
import { SettingComponent } from './setting/setting.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
// Import the library
import { NgxStripeModule } from 'ngx-stripe';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forChild(SettingsRouting),
    // BrowserModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatButtonModule,
    // CommonModule,
    MatCardModule,
    // NgxSpinnerModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatToolbarModule,
    // NgxStripeModule.forRoot('pk_test_51QRYfzDbOwcPG4OEcicJZ4xiWnZG9zlOWVitxJDfdTkjkMZ0Ly9SehFp0ew2l2pG8H7n9HjCcSFRMjjEVlphnodX00Gj3sTLkJ'),
  ]
})
export class SettingsModule { }