import { Routes } from "@angular/router";
import { AuthGuard } from '../../services/authGuard/auth.guard';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { AlternativeComponent } from "./alternative/alternative.component";
import { ChargingComponent } from "./charging/charging.component";
import { ChargingDetailsComponent } from "../charging/charging-details/charging-details.component";
import { StationStatusComponent } from "./station-status/station-status.component";
import { StationStatusDetailsComponent } from "./station-status-details/station-status-details.component";
import { RealTimeComponent } from "./real-time/real-time.component";
import { AlarmComponent } from "./alarm/alarm.component";
import { AlarmDetailsComponent } from "../alarm/alarm-details/alarm-details.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { ReservationDetailsComponent } from "../reservation/reservation-details/reservation-details.component";
import { AddReservationComponent } from "./addReservation/add-reservation/add-reservation.component";
import { DeleteReservationComponent } from "./delete-reservation/delete-reservation.component";

export const MonitoringRoutes: Routes = [
//   {
//     path: "",
// canActivate: [AuthGuard],
//     children: [
//       {
//         path: "dashboard",
//         component: DashboardComponent
//       }
//     ]
//   },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "alternative",
        component: AlternativeComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "charging",
        component: ChargingComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "charging/:id",
        component: ChargingDetailsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "stationStatus",
        component: StationStatusComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "stationStatus/:id",
        component: StationStatusDetailsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "realTime",
        component: RealTimeComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "alarm",
        component: AlarmComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "alarm/:id",
        component: AlarmDetailsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "reservation",
        component: ReservationComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "addreservation/:charger_id/:connector_id",
        component: AddReservationComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "reservation/:id",
        component: ReservationDetailsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "reservation/deletereservation/:ocppId/:reservation_id",
        component: DeleteReservationComponent
      }
    ]
  },
];
