import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from "../../../services/vehicleService/vehicle.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styles: [
  ]
})
export class VehicleDetailsComponent {
  errorMessage: any;
  id: string;
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;

  vehicle: any = {};

  companies: any[] = [];
  partners: any[] = [];
  userGroups: any[] = [];
  users: any[] = [];
  selectedCompany: string = '';
  selectedPartner: string = '';
  selectedUserGroup: string = '';
  selectedUser: string = '';

  userRole: string | null = null;
  isRadXAdmin: boolean = false;
  isRadXModerator: boolean = false;
  isSuperUser: boolean = false;
  isCompanyAdmin: boolean = false;
  isCompanyModerator: boolean = false;
  isCompanyOperator: boolean = false;
  isCompanyTechnicalOperator: boolean = false;
  isCompanyMaintenanceSpecialist: boolean = false;
  isCompanyCallCenter: boolean = false;
  isCompanyAnalyst: boolean = false;
  isUserGroupAdmin: boolean = false;
  isUserGroupModerator: boolean = false;
  isUserGroupUser: boolean = false;
  isPartnerAdmin: boolean = false;
  isPartnerModerator: boolean = false;
  isUser: boolean = false;
  company_id: any;
  usergroup_id: any;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  vehicleCountCurrentMonth: number = 0;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true;
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true;
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true;
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true;
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true;
            break;
          case 'COMPANY_ANALYST':
            // this.isCompanyRole = true;
            this.isCompanyAnalyst = true;
            // this.getCurrencies(company_id);
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupRole = true;
            this.isUserGroupAdmin = true;
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupRole = true;
            this.isUserGroupModerator = true;
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            this.isUserRole = true;
            break;
          // case 'PARTNER_ADMIN':
          // case 'PARTNER_MODERATOR':
          // this.isPartnerRole = true;
          //   this.getLocationsByPartner(partner_id);
          //   break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isUserRole = true;
            // this.getCurrencies(company_id);
            break;
          default:
            console.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        console.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    this.getVehicle();
    // this.getLogs();
    // this.getLocation();

  }

  getVehicle() {
    this.vehicleService.getVehicle(this.id).subscribe(
      (data) => {
        console.log(data);
        this.vehicle = data.vehicle;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

}
