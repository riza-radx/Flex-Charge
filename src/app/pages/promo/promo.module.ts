import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromoRoutingModule } from './promo-routing.module';
import { PromoComponent } from './promo/promo.component';


@NgModule({
  declarations: [
    PromoComponent
  ],
  imports: [
    CommonModule,
    PromoRoutingModule
  ]
})
export class PromoModule { }
