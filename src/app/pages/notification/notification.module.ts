import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MngnotificationsComponent } from './mngnotifications/mngnotifications.component';
import { NotificationRoutingModule } from './notification-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MngnotificationsComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    FormsModule
  ]
})
export class NotificationModule { }
