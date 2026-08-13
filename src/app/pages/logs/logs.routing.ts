import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogComponent } from './log/log.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';


export const LogsRouting: Routes = [
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "log",
        component: LogComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "log/:id",
        component: LogDetailsComponent
      }
    ]
  }
]
