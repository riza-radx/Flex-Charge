import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

var misc: any = {
  sidebar_mini_active: true
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}
//Menu Items
// export const ROUTES: RouteInfo[] = [
//   {
//     path: "/dashboards",
//     title: "Dashboard",
//     type: "link",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     // children: [
//     //   { path: "dashboard", title: "Dashboard", type: "link" }
//     // ]
//   },
//   {
//     path: "/monitoring",
//     title: "Monitoring",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       // { path: "dashboard", title: "Dashboard", type: "link" },
//       { path: "charging", title: "Charging", type: "link" },
//       { path: "stationStatus", title: "Station Status", type: "link" },
//       // { path: "realTime", title: "Real Time", type: "link" },
//       { path: "alarm", title: "Alarm", type: "link" },
//       { path: "alternative", title: "Alternative", type: "link" },
//       { path: "reservation", title: "Reservation", type: "link" }
//     ]
//   },
//   {
//     path: "/users",
//     title: "Users",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       { path: "user", title: "User", type: "link" },
//       { path: "usergroup", title: "User Group", type: "link" }
//     ]
//   },
//   // {
//   //   path: "/companies",
//   //   title: "Companies",
//   //   type: "link",
//   //   icontype: "ni-shop text-primary",
//   //   // isCollapsed: true,
//   // },
//   {
//     path: "/companies",
//     title: "Companies",
//     type: "sub",
//     icontype: "ni-archive-2 text-green",
//     isCollapsed: true,
//     children: [
//       { path: "company", title: "Company", type: "link" }
//     ]
//   },
//   {
//     path: "/partners",
//     title: "Partners",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       { path: "partner", title: "Partner", type: "link" }
//     ]
//   },
//   {
//     path: "/rfid-cards",
//     title: "RFID Cards",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       { path: "rfidcard", title: "RFID Card", type: "link" },
//       { path: "recharges", title: "Recharges", type: "link" },
//       { path: "transactions", title: "Transactions", type: "link" }
//     ]
//   },
//   {
//     path: "/rates",
//     title: "Rates",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       { path: "rate", title: "Rate", type: "link" },
//       { path: "promo", title: "Promo", type: "link" },
//       { path: "vouchers", title: "Vouchers", type: "link" },
//       { path: "currency", title: "Currency", type: "link" },
//       { path: "taxes", title: "Taxes", type: "link" }
//     ]
//   },
//   {
//     path: "/assets",
//     title: "Assets",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       { path: "chargers", title: "Chargers", type: "link" },
//       { path: "locations", title: "Locations", type: "link" },
//       { path: "vehicle", title: "Vehicle", type: "link" },
//     ]
//   },
//   {
//     path: "/maps",
//     title: "Maps",
//     type: "sub",
//     icontype: "ni-map-big text-primary",
//     collapse: "maps",
//     isCollapsed: true,
//     children: [
//       { path: "google", title: "Map", type: "link" },
//       // { path: "vector", title: "Vector Map", type: "link" }
//     ]
//   },
//   {
//     path: "/logs",
//     title: "Logs",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     collapse: "maps",
//     isCollapsed: true,
//     children: [
//       { path: "log", title: "Log", type: "link" }
//     ]
//   },
//   {
//     path: "/settings",
//     title: "Settings",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     collapse: "maps",
//     isCollapsed: true,
//     children: [
//       { path: "setting", title: "Setting", type: "link" }
//     ]
//   },
//   {
//     path: "/reports",
//     title: "Reports",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       { path: "financial", title: "Financial", type: "link" }
//     ]
//   },
//   // {
//   //   path: "/assets",
//   //   title: "Assets",
//   //   type: "sub",
//   //   icontype: "ni-shop text-primary",
//   //   isCollapsed: true,
//   //   children: [
//   //     { path: "asset", title: "Asset", type: "link" }
//   //   ]
//   // },
//   {
//     path: "/maintenances",
//     title: "Maintenances",
//     type: "sub",
//     icontype: "ni-shop text-primary",
//     isCollapsed: true,
//     children: [
//       { path: "maintenance", title: "Maintenance", type: "link" }
//     ]
//   },
//   // {
//   //   path: "/examples",
//   //   title: "Examples",
//   //   type: "sub",
//   //   icontype: "ni-ungroup text-orange",
//   //   collapse: "examples",
//   //   isCollapsed: true,
//   //   children: [
//   //     { path: "pricing", title: "Pricing", type: "link" },
//   //     { path: "login", title: "Login", type: "link" },
//   //     { path: "register", title: "Register", type: "link" },
//   //     { path: "lock", title: "Lock", type: "link" },
//   //     { path: "timeline", title: "Timeline", type: "link" },
//   //     { path: "profile", title: "Profile", type: "link" }
//   //   ]
//   // },
//   // {
//   //   path: "/components",
//   //   title: "Components",
//   //   type: "sub",
//   //   icontype: "ni-ui-04 text-info",
//   //   collapse: "components",
//   //   isCollapsed: true,
//   //   children: [
//   //     { path: "buttons", title: "Buttons", type: "link" },
//   //     { path: "cards", title: "Cards", type: "link" },
//   //     { path: "grid", title: "Grid", type: "link" },
//   //     { path: "notifications", title: "Notifications", type: "link" },
//   //     { path: "icons", title: "Icons", type: "link" },
//   //     { path: "typography", title: "Typography", type: "link" },
//   //     {
//   //       path: "multilevel",
//   //       isCollapsed: true,
//   //       title: "Multilevel",
//   //       type: "sub",
//   //       collapse: "multilevel",
//   //       children: [
//   //         { title: "Third level menu" },
//   //         { title: "Just another link" },
//   //         { title: "One last link" }
//   //       ]
//   //     }
//   //   ]
//   // },
//   // {
//   //   path: "/forms",
//   //   title: "Forms",
//   //   type: "sub",
//   //   icontype: "ni-single-copy-04 text-pink",
//   //   collapse: "forms",
//   //   isCollapsed: true,
//   //   children: [
//   //     { path: "elements", title: "Elements", type: "link" },
//   //     { path: "components", title: "Components", type: "link" },
//   //     { path: "validation", title: "Validation", type: "link" }
//   //   ]
//   // },
//   // {
//   //   path: "/tables",
//   //   title: "Tables",
//   //   type: "sub",
//   //   icontype: "ni-align-left-2 text-default",
//   //   collapse: "tables",
//   //   isCollapsed: true,
//   //   children: [
//   //     { path: "tables", title: "Tables", type: "link" },
//   //     { path: "sortable", title: "Sortable", type: "link" },
//   //     { path: "ngx-datatable", title: "Ngx Datatable", type: "link" }
//   //   ]
//   // },
//   // {
//   //   path: "/maps",
//   //   title: "Maps",
//   //   type: "sub",
//   //   icontype: "ni-map-big text-primary",
//   //   collapse: "maps",
//   //   isCollapsed: true,
//   //   children: [
//   //     { path: "google", title: "Map", type: "link" },
//   //     // { path: "vector", title: "Vector Map", type: "link" }
//   //   ]
//   // },
//   // {
//   //   path: "/widgets",
//   //   title: "Widgets",
//   //   type: "link",
//   //   icontype: "ni-archive-2 text-green"
//   // },
//   // {
//   //   path: "/charts",
//   //   title: "Charts",
//   //   type: "link",
//   //   icontype: "ni-chart-pie-35 text-info"
//   // },
//   // {
//   //   path: "/calendar",
//   //   title: "Calendar",
//   //   type: "link",
//   //   icontype: "ni-calendar-grid-58 text-red"
//   // }
// ];

export const RADX_ADMIN_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      // { path: "alternative", title: "Alternative", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/companies",
    title: "Companies",
    type: "sub",
    icontype: "assets/flexcharge/company.png",
    isCollapsed: true,
    children: [
      { path: "company", title: "Company", type: "link" },
      { path: "agreements", title: "Company Agreements", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // },
  // {
  //   path: "/maintenances",
  //   title: "Maintenances",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maintenance.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "maintenance", title: "Maintenance", type: "link" }
  //   ]
  // }
];

export const RADX_MODERATOR_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      // { path: "alternative", title: "Alternative", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/maintenances",
  //   title: "Maintenances",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maintenance.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "maintenance", title: "Maintenance", type: "link" }
  //   ]
  // }
];

export const COMPANY_ADMIN_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  // 🆕 Company Agreements (roaming view-only)
  { path: "/companies/agreements", title: "Company Agreements", type: "link", icontype: "assets/flexcharge/company.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  {
    path: "/notification",
    title: "Notification",
    type: "sub",
    icontype: "assets/flexcharge/notification.png",
    isCollapsed: true,
    children: [
      { path: "notification", title: "Notification", type: "link" },
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // }
];

export const SUPER_USER_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "ni-shop text-primary" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/companies",
    title: "Companies",
    type: "sub",
    icontype: "assets/flexcharge/company.png",
    isCollapsed: true,
    children: [
      { path: "company", title: "Company", type: "link" },
      { path: "agreements", title: "Company Agreements", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      { path: "recharges", title: "Recharges", type: "link" },
      { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // }
];

export const COMPANY_OPERATOR_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // }
];
export const COMPANY_MODERATOR_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // }
];
export const COMPANY_TECHNICAL_OPERATOR_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // }
];
export const COMPANY_MAINTENANCE_SPECIALIST_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // }
];
export const COMPANY_CALL_CENTER_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // }
];
export const COMPANY_ANALYST_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  // 🆕 Company Agreements (roaming view-only)
  { path: "/companies/agreements", title: "Company Agreements", type: "link", icontype: "assets/flexcharge/company.png" },
  // {
  //   path: "/monitoring",
  //   title: "Monitoring",
  //   type: "sub",
  //   icontype: "assets/flexcharge/monitoring.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "charging", title: "Charging", type: "link" },
  //     { path: "stationStatus", title: "Station Status", type: "link" },
  //     { path: "alarm", title: "Alarm", type: "link" },
  //     { path: "reservation", title: "Reservation", type: "link" }
  //   ]
  // },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/partners",
    title: "Partners",
    type: "sub",
    icontype: "assets/flexcharge/partner.png",
    isCollapsed: true,
    children: [
      { path: "partner", title: "Partner", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  {
    path: "/rates",
    title: "Rates",
    type: "sub",
    icontype: "assets/flexcharge/rate.png",
    isCollapsed: true,
    children: [
      { path: "rate", title: "Rate", type: "link" },
      { path: "promo", title: "Promo", type: "link" },
      { path: "vouchers", title: "Vouchers", type: "link" },
      { path: "currency", title: "Currency", type: "link" },
      { path: "taxes", title: "Taxes", type: "link" },
      { path: "bursa-prices", title: "Bursa Prices", type: "link" }
    ]
  },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // }
];
export const USER_GROUP_ADMIN_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      // { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      // { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  // {
  //   path: "/rates",
  //   title: "Rates",
  //   type: "sub",
  //   icontype: "assets/flexcharge/rate.png",
  //   isCollapsed: true,
  //   children: [
  //     // { path: "rate", title: "Rate", type: "link" },
  //     // { path: "promo", title: "Promo", type: "link" },
  //     { path: "vouchers", title: "Vouchers", type: "link" },
  //     // { path: "currency", title: "Currency", type: "link" },
  //     // { path: "taxes", title: "Taxes", type: "link" }
  //   ]
  // },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      // { path: "chargers", title: "Chargers", type: "link" },
      // { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // }
];
export const USER_GROUP_MODERATOR_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      // { path: "stationStatus", title: "Station Status", type: "link" },
      // { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      // { path: "usergroup", title: "User Group", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  // {
  //   path: "/rates",
  //   title: "Rates",
  //   type: "sub",
  //   icontype: "assets/flexcharge/rate.png",
  //   isCollapsed: true,
  //   children: [
  //     // { path: "rate", title: "Rate", type: "link" },
  //     // { path: "promo", title: "Promo", type: "link" },
  //     { path: "vouchers", title: "Vouchers", type: "link" },
  //     // { path: "currency", title: "Currency", type: "link" },
  //     // { path: "taxes", title: "Taxes", type: "link" }
  //   ]
  // },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      // { path: "chargers", title: "Chargers", type: "link" },
      // { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // }
];
export const USER_GROUP_USER_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      // { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  // {
  //   path: "/users",
  //   title: "Users",
  //   type: "sub",
  //   icontype: "assets/flexcharge/users.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "user", title: "User", type: "link" },
  //     // { path: "usergroup", title: "User Group", type: "link" }
  //   ]
  // },
  // {
  //   path: "/companies",
  //   title: "Companies",
  //   type: "sub",
  //   icontype: "ni-archive-2 text-green",
  //   isCollapsed: true,
  //   children: [
  //     { path: "company", title: "Company", type: "link" }
  //   ]
  // },
  // {
  //   path: "/partners",
  //   title: "Partners",
  //   type: "sub",
  //   icontype: "ni-shop text-primary",
  //   isCollapsed: true,
  //   children: [
  //     { path: "partner", title: "Partner", type: "link" }
  //   ]
  // },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  // {
  //   path: "/rates",
  //   title: "Rates",
  //   type: "sub",
  //   icontype: "assets/flexcharge/rate.png",
  //   isCollapsed: true,
  //   children: [
  //     // { path: "rate", title: "Rate", type: "link" },
  //     // { path: "promo", title: "Promo", type: "link" },
  //     { path: "vouchers", title: "Vouchers", type: "link" },
  //     // { path: "currency", title: "Currency", type: "link" },
  //     // { path: "taxes", title: "Taxes", type: "link" }
  //   ]
  // },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      // { path: "chargers", title: "Chargers", type: "link" },
      // { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "ni-shop text-primary",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // }
];
export const PARTNER_ADMIN_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      // { path: "usergroup", title: "User Group", type: "link" }
    ]
  },

  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      // { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // }
];
export const PARTNER_MODERATOR_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/users",
    title: "Users",
    type: "sub",
    icontype: "assets/flexcharge/users.png",
    isCollapsed: true,
    children: [
      { path: "user", title: "User", type: "link" },
      // { path: "usergroup", title: "User Group", type: "link" }
    ]
  },

  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      { path: "chargers", title: "Chargers", type: "link" },
      { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      // { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // }
];
export const USER_ROUTES: RouteInfo[] = [
  { path: "/dashboards", title: "Dashboard", type: "link", icontype: "assets/flexcharge/dashboard.png" },
  {
    path: "/monitoring",
    title: "Monitoring",
    type: "sub",
    icontype: "assets/flexcharge/monitoring.png",
    isCollapsed: true,
    children: [
      { path: "charging", title: "Charging", type: "link" },
      { path: "stationStatus", title: "Station Status", type: "link" },
      // { path: "alarm", title: "Alarm", type: "link" },
      { path: "reservation", title: "Reservation", type: "link" }
    ]
  },
  {
    path: "/rfid-cards",
    title: "RFID Cards",
    type: "sub",
    icontype: "assets/flexcharge/card.png",
    isCollapsed: true,
    children: [
      { path: "rfidcard", title: "RFID Card", type: "link" },
      // { path: "recharges", title: "Recharges", type: "link" },
      // { path: "transactions", title: "Transactions", type: "link" }
    ]
  },
  // {
  //   path: "/rates",
  //   title: "Rates",
  //   type: "sub",
  //   icontype: "assets/flexcharge/rate.png",
  //   isCollapsed: true,
  //   children: [
  //     // { path: "rate", title: "Rate", type: "link" },
  //     // { path: "promo", title: "Promo", type: "link" },
  //     { path: "vouchers", title: "Vouchers", type: "link" },
  //     // { path: "currency", title: "Currency", type: "link" },
  //     // { path: "taxes", title: "Taxes", type: "link" }
  //   ]
  // },
  {
    path: "/assets",
    title: "Assets",
    type: "sub",
    icontype: "assets/flexcharge/assets.png",
    isCollapsed: true,
    children: [
      // { path: "chargers", title: "Chargers", type: "link" },
      // { path: "locations", title: "Locations", type: "link" },
      // { path: "documents", title: "Documents", type: "link" },
      { path: "vehicle", title: "Vehicle", type: "link" }
    ]
  },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/maps.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "google", title: "Map", type: "link" },
  //     // { path: "vector", title: "Vector Map", type: "link" }
  //   ]
  // },
  // {
  //   path: "/logs",
  //   title: "Logs",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/log.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "log", title: "Log", type: "link" }
  //   ]
  // },
  // {
  //   path: "/reports",
  //   title: "Reports",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/report.png",
  //   isCollapsed: true,
  //   children: [
  //     { path: "financial", title: "Financial", type: "link" }
  //   ]
  // },
  // {
  //   path: "/settings",
  //   title: "Settings",
  //   type: "sub",
  //   icontype: "assets/img/icons/general/settings.png",
  //   collapse: "maps",
  //   isCollapsed: true,
  //   children: [
  //     { path: "setting", title: "Setting", type: "link" }
  //   ]
  // }
];

// Continue with the same pattern for all other roles...
// COMPANY_OPERATOR_ROUTES, COMPANY_MODERATOR_ROUTES, etc.

export let ROUTES: RouteInfo[] = [];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    // this.menuItems = ROUTES.filter(menuItem => menuItem);
    // this.router.events.subscribe(event => {
    //   this.isCollapsed = true;
    // });
    // Retrieve the current user's role
    const userRole = this.getUserRole();

    // Assign menu items based on the user role
    switch (userRole) {
      case 'RadX_Admin':
        ROUTES = RADX_ADMIN_ROUTES;
        break;
      case 'RADX_MODERATOR':
        ROUTES = RADX_MODERATOR_ROUTES;
        break;
      case 'COMPANY_ADMIN':
        ROUTES = COMPANY_ADMIN_ROUTES;
        break;
      case 'SUPER_USER':
        ROUTES = SUPER_USER_ROUTES;
        break;
      case 'COMPANY_OPERATOR':
        ROUTES = COMPANY_OPERATOR_ROUTES;
        break;
      case 'COMPANY_MODERATOR':
        ROUTES = COMPANY_MODERATOR_ROUTES;
        break;
      case 'COMPANY_TECHNICAL_OPERATOR':
        ROUTES = COMPANY_TECHNICAL_OPERATOR_ROUTES;
        break;
      case 'COMPANY_MAINTENANCE_SPECIALIST':
        ROUTES = COMPANY_MAINTENANCE_SPECIALIST_ROUTES;
        break;
      case 'COMPANY_CALL_CENTER':
        ROUTES = COMPANY_CALL_CENTER_ROUTES;
        break;
      case 'COMPANY_ANALYST':
        ROUTES = COMPANY_ANALYST_ROUTES;
        break;
      case 'USER_GROUP_ADMIN':
        ROUTES = USER_GROUP_ADMIN_ROUTES;
        break;
      case 'USER_GROUP_MODERATOR':
        ROUTES = USER_GROUP_MODERATOR_ROUTES;
        break;
      case 'USER_GROUP_USER':
        ROUTES = USER_GROUP_USER_ROUTES;
        break;
      case 'PARTNER_ADMIN':
        ROUTES = PARTNER_ADMIN_ROUTES;
        break;
      case 'PARTNER_MODERATOR':
        ROUTES = PARTNER_MODERATOR_ROUTES;
        break;
      case 'USER':
      case 'COMPANY_USER':
        ROUTES = USER_ROUTES;
        break;
      default:
        ROUTES = [];
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }
  getUserRole() {
    // Retrieve the user role from local storage
    const role = localStorage.getItem('userRole'); // Adjust the key as needed
    return role; // Return 'Guest' or some default role if not found
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
