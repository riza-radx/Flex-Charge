import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';

export const SettingsRouting: Routes = [
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "setting",
        component: SettingComponent
      }
    ]
  }
]
