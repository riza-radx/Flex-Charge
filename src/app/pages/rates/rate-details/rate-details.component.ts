import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RateService } from "../../../services/rateService/rate.service";
import { RatePerDaysService } from "../../../services/ratePerDaysService/rate-per-days.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserService } from 'src/app/services/userService/user.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-rate-details',
  templateUrl: './rate-details.component.html',
  styles: []
})
export class RateDetailsComponent implements OnInit {
  errorMessage: any;
  id: string;
  rate: any = {}; // Ensure this is an object
  ratePerDays: any[] = [];
  tempRatePerDays: any[] = [];
  selected: any[] = [];
  entries: number = 10;

  // 🆕 STATE per tabs-in "Usage" — entitetet qe kane te aplikuar rate-in.
  //    Purchase: vetem chargers. Sale: chargers + users + user groups.
  usageLoaded: boolean = false;
  usageRateType: string = '';           // 'sale' | 'purchase' (vjen nga backend response)
  usageChargers: any[] = [];
  usageUsers: any[] = [];
  usageUserGroups: any[] = [];
  usageChargerEntries: number = 10;
  usageUserEntries: number = 10;
  usageUserGroupEntries: number = 10;

  // Kthen true nese rate-i eshte 'purchase' (case-insensitive).
  get isPurchaseRate(): boolean {
    return String(this.usageRateType || this.rate?.rate_type || '').toLowerCase() === 'purchase';
  }
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

  isRadXRole: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
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
    private rateService: RateService,
    private ratePerDaysService: RatePerDaysService,
    private companyService: CompanyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXRole = true;
            this.getRate();
            this.getRatePerDays();
            this.getRateUsage();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.getRate();
            this.getRatePerDays();
            this.getRateUsage();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':

          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.getRate();
            this.getRatePerDays();
            this.getRateUsage();
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyAnalyst = true;
            this.getRate();
            this.getRatePerDays();
            this.getRateUsage();
            break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getUserGroupMembers(company_id);
          //   break;
          // case 'PARTNER_ADMIN':
          // case 'PARTNER_MODERATOR':
          //   this.getPartnerMembers(partner_id);
          //   break;
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
    // Handle row activation if needed
  }

  getRate() {
    this.rateService.getRate(this.id).subscribe(
      (data) => {
        if (data && data.rate) {
          this.rate = data.rate; // Make sure data.rate is an object

        }
        console.log("this.rate", this.rate);
        this.companyService.getCompany(this.rate.company_id).subscribe(
          (companyData) => {
            this.rate.company = companyData.company.company_name;
            console.log("companyData.company.company_name", companyData.company.company_name);
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
        console.log("data.rate", data.rate);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  // 🆕 Row-click handlers per tab-et e "Usage" — hap detail-in e entitetit.
  //    ngx-datatable emeton 'click' + 'dblclick' + 'keydown' te onActivate; ne trajtojme 'click'.
  onUsageChargerActivate(event: any) {
    if (event?.type === 'click' && event?.row?.charger_id) {
      this.router.navigate(['/assets/chargers/', event.row.charger_id]);
    }
  }
  onUsageUserActivate(event: any) {
    if (event?.type === 'click' && event?.row?.id) {
      this.router.navigate(['/users/user/', event.row.id]);
    }
  }
  onUsageUserGroupActivate(event: any) {
    if (event?.type === 'click' && event?.row?.usergr_id) {
      this.router.navigate(['/users/usergroup/', event.row.usergr_id]);
    }
  }

  // 🆕 Kthen entitetet qe kane te aplikuar kete rate.
  //   Purchase: vetem chargers (energy_tariff_rate_id).
  //   Sale:     chargers (rate_id) + users + user groups.
  getRateUsage() {
    this.rateService.getRateUsage(this.id).subscribe(
      (data: any) => {
        if (data?.success) {
          this.usageRateType = String(data?.rate?.rate_type || 'sale').toLowerCase();
          this.usageChargers = data.chargers || [];
          this.usageUsers = data.users || [];
          this.usageUserGroups = data.userGroups || [];
        } else {
          console.warn('getRateUsage response not successful:', data);
        }
        this.usageLoaded = true;
      },
      (err: any) => {
        console.error('Error loading rate usage:', err);
        this.usageLoaded = true;
      }
    );
  }

  getRatePerDays() {
    this.ratePerDaysService.getRatePerDayByRate(this.id).subscribe(
      (data) => {
        if (data && data.ratePerDay) {
          this.ratePerDays = data.ratePerDay;
          this.tempRatePerDays = [...this.ratePerDays];
        }
        console.log("ratePerDays: " + this.ratePerDays)
        this.ratePerDays.forEach((row, index) => {
          this.userService.getUserById(row.user_id).subscribe(
            (userData) => {
              this.ratePerDays[index].user = userData.user.username;
              console.log("userData.user.name", userData.user.name);
            },
            (error) => {
              this.errorMessage = error.message;
              console.log(error);
            }
          );
        });

      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  filterRatePerDayTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
        this.tempRatePerDays = [...this.ratePerDays];
        return;
    }

    this.tempRatePerDays = this.ratePerDays.filter((d) => {
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
