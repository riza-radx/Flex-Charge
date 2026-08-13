import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PresentationComponent } from "./pages/presentation/presentation.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  // {
  //   path: "presentation",
  //   component: PresentationComponent
  // },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () => import('./pages/dashboards/dashboards.module').then(m => m.DashboardsModule)

      },
      {
        path: "monitoring",
        loadChildren: () => import('./pages/dashboards/monitoring.module').then(m => m.MonitoringModule)

      },
      {
        path: "users",
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)

      },
      // {
      //   path: "companies", 
      //   loadChildren: () => import('./pages/companies/companies.module').then(m => m.CompaniesModule)

      // },
      {
        path: "companies",
        loadChildren: () => import('./pages/companies/companies.module').then(m => m.CompaniesModule)

      },
      {
        path: "rfid-cards",
        loadChildren: () => import('./pages/rfid-card/rfid-card.module').then(m => m.RfidCardModule)

      },
      {
        path: "rates",
        loadChildren: () => import('./pages/rates/rates.module').then(m => m.RatesModule)

      },
      {
        path: "logs",
        loadChildren: () => import('./pages/logs/logs.module').then(m => m.LogsModule)

      },
      {
        path: "settings",
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule)

      },
      {
        path: "reports",
        loadChildren: () => import('./pages/financials/financials.module').then(m => m.FinancialsModule)

      },
      {
        path: "partners",
        loadChildren: () => import('./pages/partners/partners.module').then(m => m.PartnersModule)

      },
      {
        path: "assets",
        loadChildren: () => import('./pages/assets/assets.module').then(m => m.AssetsModule)

      },
      {
        path: "maintenances",
        loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenanceModule)

      },
      {
        path: "components",
        loadChildren: () => import('./pages/components/components.module').then(m => m.ComponentsModule)
      },
      {
        path: "forms",
        loadChildren: () => import('./pages/forms/forms.module').then(m => m.FormsModules)
      },
      {
        path: "tables",
        loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: "maps",
        loadChildren: () => import('./pages/maps/maps.module').then(m => m.MapsModule)
      },
      {
        path: "widgets",
        loadChildren: () => import('./pages/widgets/widgets.module').then(m => m.WidgetsModule)
      },
      {
        path: "charts",
        loadChildren: () => import('./pages/charts/charts.module').then(m => m.ChartsModule)
      },
      {
        path: "calendar",
        loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarModule)
      },
      { path: 'payment', loadChildren: () => import('./pages/settings/payment/payment.module').then(m => m.PaymentModule) },
      {
        path: "",
        loadChildren: () => import('./pages/examples/examples.module').then(m => m.ExamplesModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationModule)
      }

    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "dashboard"
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
