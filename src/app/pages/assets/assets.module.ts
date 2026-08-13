import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TagInputModule } from "ngx-chips";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker"; 

import { AssetsRouting } from './assets.routing';
import { AssetComponent } from './asset/asset.component';
import { ComponentsModule } from '../components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPrintModule } from 'ngx-print';
import { RadxchargersComponent } from './radxchargers/radxchargers/radxchargers.component';
import { CompanychargersComponent } from './companychargers/companychargers/companychargers.component';
import { PartnerchargersComponent } from './partnerchargers/partnerchargers/partnerchargers.component';
import { RadxlocationsComponent } from './radxlocations/radxlocations/radxlocations.component';
import { CompanylocationsComponent } from './companylocations/companylocations/companylocations.component';
import { PartnerlocationsComponent } from './partnerlocations/partnerlocations/partnerlocations.component';
import { RadxcreatechargersComponent } from './radxcreatechargers/radxcreatechargers/radxcreatechargers.component';
import { CompanycreatechargersComponent } from './companycreatechargers/companycreatechargers/companycreatechargers.component';
import { PartnercreatechargersComponent } from './partnercreatechargers/partnercreatechargers/partnercreatechargers.component';
import { RadxupdatechargersComponent } from './radxupdatechargers/radxupdatechargers/radxupdatechargers.component';
import { CompanyupdatechargersComponent } from './companyupdatechargers/companyupdatechargers/companyupdatechargers.component';
import { PartnerupdatechargersComponent } from './partnerupdatechargers/partnerupdatechargers/partnerupdatechargers.component';
import { RadxcreatelocationsComponent } from './radxcreatelocations/radxcreatelocations/radxcreatelocations.component';
import { CompanycreatelocationsComponent } from './companycreatelocations/companycreatelocations/companycreatelocations.component';
import { PartnercreatelocationsComponent } from './partnercreatelocations/partnercreatelocations/partnercreatelocations.component';
import { RadxupdatelocationsComponent } from './radxupdatelocations/radxupdatelocations/radxupdatelocations.component';
import { CompanyupdatelocationsComponent } from './companyupdatelocations/companyupdatelocations/companyupdatelocations.component';
import { PartnerupdatelocationsComponent } from './partnerupdatelocations/partnerupdatelocations/partnerupdatelocations.component';
import { ChargersComponent } from '../chargers/chargers/chargers.component';
import { ChargerDetailsComponent } from '../chargers/charger-details/charger-details.component';
import { LocationsComponent } from '../locations/locations/locations.component';
import { VehicleDetailsComponent } from "../vehicle/vehicle-details/vehicle-details.component";
import { LocationDetailsComponent } from '../locations/location-details/location-details.component';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CompanydeletechargersComponent } from './companydeletechargers/companydeletechargers.component';
import { CompanydeletelocationsComponent } from './companydeletelocations/companydeletelocations.component';
import { RadxdeleteconnectorsComponent } from './radxdeleteconnectors/radxdeleteconnectors/radxdeleteconnectors.component';
import { RadxupdateconnectorsComponent } from './radxupdateconnectors/radxupdateconnectors/radxupdateconnectors.component';
import { RadxcreateconnectorsComponent } from './radxcreateconnectors/radxcreateconnectors/radxcreateconnectors.component';
import { DocumentsComponent } from './documents/documents.component';
import { ImportDocumentComponent } from './import-document/import-document.component';
import { AllChargingHistoryDataComponent } from './allChargingHistoryData/all-charging-history-data/all-charging-history-data.component';
import { ChargingHistoryDataComponent } from './ChargingHistoryData/charging-history-data/charging-history-data.component';
import { DeleteDocumentsComponent } from './deleteDocuments/delete-documents/delete-documents.component';
import { QrCodePopupComponent } from '../chargers/qr-code-popup/qr-code-popup.component';
import { CountryService } from 'src/app/services/country/country.service';
import { LocalListComponent } from './local-list/local-list.component';
import { LocalListDeleteComponent } from './local-list-delete/local-list-delete.component';


@NgModule({
  declarations: [
    AssetComponent,
    RadxchargersComponent,
    CompanychargersComponent,
    PartnerchargersComponent,
    RadxlocationsComponent,
    CompanylocationsComponent,
    PartnerlocationsComponent,
    RadxcreatechargersComponent,
    CompanycreatechargersComponent,
    ChargersComponent,
    ChargerDetailsComponent,
    LocationsComponent,
    LocationDetailsComponent,
    VehicleDetailsComponent,
    PartnercreatechargersComponent,
    RadxupdatechargersComponent,
    CompanyupdatechargersComponent,
    PartnerupdatechargersComponent,
    RadxcreatelocationsComponent,
    CompanycreatelocationsComponent,
    PartnercreatelocationsComponent,
    RadxupdatelocationsComponent,
    CompanyupdatelocationsComponent,
    PartnerupdatelocationsComponent,
    CompanydeletechargersComponent,
    CompanydeletelocationsComponent,
    RadxdeleteconnectorsComponent,
    RadxupdateconnectorsComponent,
    RadxcreateconnectorsComponent,
    DocumentsComponent,
    ImportDocumentComponent,
    AllChargingHistoryDataComponent,
    ChargingHistoryDataComponent,
    DeleteDocumentsComponent,
    QrCodePopupComponent,
    LocalListComponent,
    LocalListDeleteComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    TabsModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    TagInputModule,
    BsDropdownModule.forRoot(),
    NgxPrintModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forChild(AssetsRouting)
  ],
  providers: [CountryService],
})
export class AssetsModule { }
