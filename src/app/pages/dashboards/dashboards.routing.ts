import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/authGuard/auth.guard';
// import { DashboardComponent } from '../dashboards/dashboard/dashboard.component';
import { DashboardComponent } from '../dashboards/dashboard/dashboard.component';
// 🆕 Global Energy Report
import { EnergyReportComponent } from '../energy-report/energy-report.component';

// Import all dashboard components
import { AdmindashboardComponent } from '../dashboards/admindashboard/admindashboard/admindashboard.component';
import { ModeratordashboardComponent } from '../dashboards/moderatordashboard/moderatordashboard/moderatordashboard.component';
import { CompanyadmindashboardComponent } from '../dashboards/companyadmindashboard/companyadmindashboard/companyadmindashboard.component';
import { CompanyemployeedashboardComponent } from '../dashboards/companyemployeedashboard/companyemployeedashboard/companyemployeedashboard.component';
import { UsergroupadmindashboardComponent } from '../dashboards/usergroupadmindashboard/usergroupadmindashboard/usergroupadmindashboard.component';
import { UsergroupmoderatordashboardComponent } from '../dashboards/usergroupmoderatordashboard/usergroupmoderatordashboard/usergroupmoderatordashboard.component';
import { UsergroupuserdashboardComponent } from '../dashboards/usergroupuserdashboard/usergroupuserdashboard/usergroupuserdashboard.component';
import { PartneradmindashboardComponent } from '../dashboards/partneradmindashboard/partneradmindashboard/partneradmindashboard.component';
import { PartnermoderatordashboardComponent } from '../dashboards/partnermoderatordashboard/partnermoderatordashboard/partnermoderatordashboard.component';
import { UserdashboardComponent } from '../dashboards/userdashboard/userdashboard/userdashboard.component';


export const DashboardsRoutes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: DashboardComponent
      }
    ]
  },
  {
    path: "energy-report",
    canActivate: [AuthGuard],
    component: EnergyReportComponent
  },
];




// export const DashboardsRoutes: Routes = [
//   {
//     path: '',
//     children: [
//       {
//         path: 'dashboard',
//         component: DashboardComponent,
//         canActivate: [AuthGuard],
//         children: [
//           { path: '', redirectTo: 'admin', pathMatch: 'full' }, // Default route
//           { path: 'admin', component: AdmindashboardComponent },
//           { path: 'moderator', component: ModeratordashboardComponent },
//           { path: 'companyadmin', component: CompanyadmindashboardComponent },
//           { path: 'companyemployee', component: CompanyemployeedashboardComponent },
//           { path: 'usergroupadmin', component: UsergroupadmindashboardComponent },
//           { path: 'usergroupmoderator', component: UsergroupmoderatordashboardComponent },
//           { path: 'usergroupuser', component: UsergroupuserdashboardComponent },
//           { path: 'partneradmin', component: PartneradmindashboardComponent },
//           { path: 'partnermoderator', component: PartnermoderatordashboardComponent },
//           { path: 'user', component: UserdashboardComponent }
//         ]
//       }
//     ]
//   }
// ];
