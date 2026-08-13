import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { RadxcreatecompanyComponent } from './radxcreatecompany/radxcreatecompany/radxcreatecompany.component';
import { CompanyupdatecompanyComponent } from './companyupdatecompany/companyupdatecompany/companyupdatecompany.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';
import { CompanydeletecompanyComponent } from './companydeletecompany/companydeletecompany.component';
import { CompanymembersComponent } from './companymembers/companymembers/companymembers.component';
import { UpdateCompanymembersComponent } from './updateCompanymembers/update-companymembers/update-companymembers.component';
// 🆕 Company Agreements (roaming view-only per COMPANY_ADMIN/ANALYST)
import { RoamingAgreementsComponent } from '../roaming-agreements/roaming-agreements.component';


export const CompaniesRoutes: Routes = [
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "company",
        component: CompanyComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "company/:id",
        component: CompanyDetailsComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "addmembers/:id",
        component: CompanymembersComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "updatemember/:id",
        component: UpdateCompanymembersComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "addcompany",
        component: RadxcreatecompanyComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "company/updatecompany/:id",
        component: CompanyupdatecompanyComponent
      }
    ]
  },
  {
    path: "",
canActivate: [AuthGuard],
    children: [
      {
        path: "company/deletecompany/:id",
        component: CompanydeletecompanyComponent
      }
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        // 🆕 Company Agreements (roaming view-only)
        path: "agreements",
        component: RoamingAgreementsComponent
      }
    ]
  }
]
