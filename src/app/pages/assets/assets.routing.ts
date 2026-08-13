import { AuthGuard } from '../../services/authGuard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetComponent } from './asset/asset.component';
import { ChargersComponent } from '../chargers/chargers/chargers.component';
import { ChargerDetailsComponent } from '../chargers/charger-details/charger-details.component';
import { LocationsComponent } from '../locations/locations/locations.component';
import { LocationDetailsComponent } from '../locations/location-details/location-details.component';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { VehicleDetailsComponent } from '../vehicle/vehicle-details/vehicle-details.component';

import { RadxcreatechargersComponent } from "./radxcreatechargers/radxcreatechargers/radxcreatechargers.component";
import { CompanycreatechargersComponent } from "./companycreatechargers/companycreatechargers/companycreatechargers.component";
import { PartnercreatechargersComponent } from "./partnercreatechargers/partnercreatechargers/partnercreatechargers.component";
import { RadxupdatechargersComponent } from "./radxupdatechargers/radxupdatechargers/radxupdatechargers.component";
import { CompanyupdatechargersComponent } from "./companyupdatechargers/companyupdatechargers/companyupdatechargers.component";
import { PartnerupdatechargersComponent } from "./partnerupdatechargers/partnerupdatechargers/partnerupdatechargers.component";

import { RadxcreatelocationsComponent } from "./radxcreatelocations/radxcreatelocations/radxcreatelocations.component";
import { CompanycreatelocationsComponent } from "./companycreatelocations/companycreatelocations/companycreatelocations.component";
import { PartnercreatelocationsComponent } from "./partnercreatelocations/partnercreatelocations/partnercreatelocations.component";
import { RadxupdatelocationsComponent } from "./radxupdatelocations/radxupdatelocations/radxupdatelocations.component";
import { CompanyupdatelocationsComponent } from "./companyupdatelocations/companyupdatelocations/companyupdatelocations.component";
import { PartnerupdatelocationsComponent } from "./partnerupdatelocations/partnerupdatelocations/partnerupdatelocations.component";
import { CompanydeletechargersComponent } from './companydeletechargers/companydeletechargers.component';
import { CompanydeletelocationsComponent } from "./companydeletelocations/companydeletelocations.component";
import { CompanycreatevehicleComponent } from '../vehicle/companycreatevehicle/companycreatevehicle/companycreatevehicle.component';
import { CompanyupdatevehicleComponent } from '../vehicle/companyupdatevehicle/companyupdatevehicle/companyupdatevehicle.component';
import { CompanydeletevehicleComponent } from '../vehicle/companydeletevehicle/companydeletevehicle.component';
import { RadxcreateconnectorsComponent } from './radxcreateconnectors/radxcreateconnectors/radxcreateconnectors.component';
import { RadxupdateconnectorsComponent } from './radxupdateconnectors/radxupdateconnectors/radxupdateconnectors.component';
import { RadxdeleteconnectorsComponent } from './radxdeleteconnectors/radxdeleteconnectors/radxdeleteconnectors.component';

import { DocumentsComponent } from "./documents/documents.component";
import { ImportDocumentComponent } from './import-document/import-document.component';
import { AllChargingHistoryDataComponent } from './allChargingHistoryData/all-charging-history-data/all-charging-history-data.component';
import { ChargingHistoryDataComponent } from './ChargingHistoryData/charging-history-data/charging-history-data.component';
import { DeleteDocumentsComponent } from './deleteDocuments/delete-documents/delete-documents.component';
import { QrCodePopupComponent } from '../chargers/qr-code-popup/qr-code-popup.component';
import { LocalListComponent } from './local-list/local-list.component';
import { LocalListDeleteComponent } from './local-list-delete/local-list-delete.component';
// const routes: Routes = [];

export const AssetsRouting: Routes = [
//   {
//     path: "",
// canActivate: [AuthGuard],
//     children: [
//       {
//         path: "chargers",
//         component: ChargersComponent
//       }
//     ]
//   },
//   {
//     path: "",
// canActivate: [AuthGuard],
//     children: [
//       {
//         path: "chargers/:id",
//         component: ChargerDetailsComponent
//       }
//     ]
//   },
//   {
//     path: "",
// canActivate: [AuthGuard],
//     children: [
//       {
//         path: "locations",
//         component: LocationsComponent
//       }
//     ]
//   },
//   {
//     path: "",
// canActivate: [AuthGuard],
//     children: [
//       {
//         path: "locations/:id",
//         component: LocationDetailsComponent
//       }
//     ]
//   },
//   {
//     path: "",
// canActivate: [AuthGuard],
//     children: [
//       {
//         path: "vehicle",
//         component: VehicleComponent
//       }
//     ]
//   },
//   {
//     path: "",
// canActivate: [AuthGuard],
//     children: [
//       {
//         path: "vehicle/:id",
//         component: VehicleDetailsComponent
//       }
{
  path: "",
  canActivate: [AuthGuard],
  children: [
    // Chargers Routes
    {
      path: "chargers",
      component: ChargersComponent
    },
    {
      path: "chargers/:id",
      component: ChargerDetailsComponent
    },
    {
      path: "chargers/create/radx",
      component: RadxcreatechargersComponent
    },
    {
      path: "chargers/create/company",
      component: CompanycreatechargersComponent
    },
    {
      path: "chargers/create/partner",
      component: PartnercreatechargersComponent
    },
    {
      path: "chargers/update/radx/:id",
      component: RadxupdatechargersComponent
    },
    {
      path: "chargers/update/company/:id",
      component: CompanyupdatechargersComponent
    },
    {
      path: "chargers/delete/company/:id",
      component: CompanydeletechargersComponent
    },
    {
      path: "chargers/update/partner/:id",
      component: PartnerupdatechargersComponent
    },

    // Locations Routes
    {
      path: "locations",
      component: LocationsComponent
    },
    {
      path: "locations/:id",
      component: LocationDetailsComponent
    },
    {
      path: "locations/create/radx",
      component: RadxcreatelocationsComponent
    },
    {
      path: "locations/create/company",
      component: CompanycreatelocationsComponent
    },
    {
      path: "locations/create/partner",
      component: PartnercreatelocationsComponent
    },
    {
      path: "locations/update/radx/:id",
      component: RadxupdatelocationsComponent
    },
    {
      path: "locations/update/company/:id",
      component: CompanyupdatelocationsComponent
    },
    {
      path: "locations/update/partner/:id",
      component: PartnerupdatelocationsComponent
    },
    {
      path: "locations/delete/company/:id",
      component: CompanydeletelocationsComponent
    },

    // Vehicle Routes
    {
      path: "vehicle",
      component: VehicleComponent
    },
    {
      path: "vehicle/:id",
      component: VehicleDetailsComponent
    },
    {
      path: "vehicles/create/radx",
      component: CompanycreatevehicleComponent
    },
    {
      path: "vehicles/update/company/:id",
      component: CompanyupdatevehicleComponent
    },
    {
      path: "vehicles/delete/company/:id",
      component: CompanydeletevehicleComponent
    },

     // Connector Routes
     {
       path: "connectors/createconnector/:id",
       component: RadxcreateconnectorsComponent
     },
     {
      path: "connectors/updateconnector/:id",
      component: RadxupdateconnectorsComponent
    },
    {
      path: "connectors/deleteconnector/:id",
      component: RadxdeleteconnectorsComponent
    },

    // Documents Routes
    {
      path: "documents",
      component: DocumentsComponent
    },
    // {
    //   path: "vehicle/:id",
    //   component: VehicleDetailsComponent
    // },
    {
      path: "documents/import",
      component: ImportDocumentComponent
    },
    {
      path: "documents/delete/:id",
      component: DeleteDocumentsComponent
    },

    // ChargingHistory Routes
    {
      path: "charinghistory",
      component: AllChargingHistoryDataComponent
    },
    // {
    //   path: "vehicle/:id",
    //   component: VehicleDetailsComponent
    // },
    {
      path: "charinghistory/:id",
      component: ChargingHistoryDataComponent
    },
    // {
    //   path: "vehicles/update/company/:id",
    //   component: CompanyupdatevehicleComponent
    // },
    // {
    //   path: "vehicles/delete/company/:id",
    //   component: CompanydeletevehicleComponent
    // },
    {
      path: "qr-code-popup/:connectorId",
      component: QrCodePopupComponent
    },
    //local List routes
    {
      path: "localList/create/:id",
      component: LocalListComponent
    },
    {
      path: "localList/delete/:cllId/:chargerId",
      component: LocalListDeleteComponent
    },

    ]
  },
]
