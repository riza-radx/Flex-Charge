import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';

export const MaintenanceRouting: Routes = [
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "maintenance",
        component: MaintenanceComponent
      }
    ]
  }
]
