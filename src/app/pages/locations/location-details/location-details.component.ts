import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerLocationService } from "../../../services/chargerLocationService/charger-location.service";
import { ChargerService } from "../../../services/chargerService/charger.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styles: [
  ]
})
export class LocationDetailsComponent {
  errorMessage: any;
  id: string;
  location: any = {};
  chargers: any[] = [];
  tempLocation = [];
  tempChargers = [];
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
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
  companyId: any;
  companyName: string = '';
  partnerId: any;
  partnerName: string = '';
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  // Roaming: true when the location belongs to another company that this user's
  // company has an active roaming agreement with. UI runs in read-only mode.
  isRoamingView: boolean = false;
  userCompanyId: any = null;
  @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.isSmallScreen = event.target.innerWidth < 768;
  //   // Hide input when switching to small screen
  //   if (this.isSmallScreen) {
  //     this.isInputVisible = false;
  //   }
  // }
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  toggleSearchInput() {
    this.isInputVisible = !this.isInputVisible; // Toggle input visibility on icon click
  }
  constructor(
    private chargerLocationService: ChargerLocationService,
    private chargerService: ChargerService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    // this.getLocation();
    // this.getChargers();
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      this.userCompanyId = company_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getLocation();
            this.getChargers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getLocation();
            this.getChargers();
            break;
          case 'COMPANY_ADMIN':
            // 🆕 Set isCompanyAdmin qe fusha Vendor Number OSHEE te shfaqet.
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getLocation();
            this.getChargers();
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

            this.isCompanyRole = true;
            this.getLocation();
            this.getChargers();
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getLocation();
            this.getChargers();
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getLocation();
            this.getChargers();
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
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }


  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
    if (event.type === 'click') {
      // Block deep navigation for roaming-partner chargers — the user is not
      // the owner and must not reach the management view.
      if (this.isRoamingView) {
        return;
      }
      this.router.navigate([`/assets/chargers/${this.activeRow.charger_id}`]);
    }
  }

  getChargers() {
    this.chargerService.getChargerByLocation(this.id).subscribe(
      (data) => {
        if (Array.isArray(data.charger)) {
          this.chargers = data.charger;
          this.tempChargers = [...this.chargers];
        } else {
          console.error("Chargers data is not an array:", data);
        }
        console.log(data);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  getLocation() {
    this.chargerLocationService.getChargerLocation(this.id).subscribe(
      (response) => {
        if (response.success && response.location) {
          this.location = response.location;
          console.log("response.location", response.location);
          this.companyId = this.location.company_id;
          console.log(" this.companyId", this.companyId);
          // Roaming detection: a company user viewing a location that belongs
          // to a different company is browsing it via a roaming agreement.
          if (this.isCompanyRole && this.userCompanyId && this.companyId &&
              Number(this.userCompanyId) !== Number(this.companyId)) {
            this.isRoamingView = true;
          }
          this.getCompanyDetails(this.companyId);
          this.partnerId = this.location.partner_id;
          if (this.partnerId) {
            this.getPartnerDetails(this.partnerId); // Assuming getPartnerDetails is a method to fetch partner details
          } else {
            this.partnerName = null; // If partnerId is null, ensure partnerName is null
          }
          this.tempLocation = [...this.location];
        } else {
          this.location = {};
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getCompanyDetails(companyId: string) {
    this.companyService.getCompany(companyId).subscribe(
      (company) => {
        console.log('Company:', company);
        this.companyName = company.company.company_name;
      },
      (error) => {
        console.error('Error fetching company details', error);
      }
    );
  }

  getPartnerDetails(id: number): void {
    this.partnerService.getPartner(id).subscribe({
      next: (response) => {
        this.partnerName = response.partner.partner_name;
        console.log('response:', response);
        console.log('partnerName:', this.partnerName);
      },
      error: (error) => {
        console.error('Error fetching location details:', error);
      }
    });
  }
  filterChargersTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      this.tempChargers = [...this.chargers];
      return;
    }

    this.tempChargers = this.chargers.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
}
