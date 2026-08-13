import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from "../../../services/reservationService/reservation.service";
import { UserService } from "../../../services/userService/user.service";
import { ChargerService } from "../../../services/chargerService/charger.service";
import { ConnectorService } from 'src/app/services/connectorService/connector.service';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styles: [
  ]
})
export class ReservationComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;
  reservationCountCurrentMonth: number = 0;
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
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  isRadXRole: boolean = false;
  company_id: any;
  usergroup_id: any;
  user_id: any;
  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private chargerService: ChargerService,
    private connectorService: ConnectorService,
    private router: Router
  ) {
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    this.temp = this.rows.filter(function (d) {
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // this.activeRow = event.row;
    this.activeRow = event.row;
    // if (event.type === 'click') {
    //   this.router.navigate([`/monitoring/reservation/${this.activeRow.reservation_id}`]);  // Navigate to company details page
    // }
  }

  ngOnInit() {

    // this.fetchCurrentMonthReservationCount();
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      const partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;


      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.getReservations();
            this.isRadXRole = true;
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            this.getReservations();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getReservationsByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.getReservationsByCompany(this.company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            this.getReservationsByCompany(this.company_id);
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyRole = true;
            this.isCompanyAnalyst = true
            console.log("getReservationsByCompany(company_id)", this.company_id);
            this.getReservationsByCompany(this.company_id); // Fetch alarms for the company
            break;
            case 'USER_GROUP_ADMIN':
              this.isUserGroupAdmin = true;
              this.isUserGroupRole = true;
              this.getReservationsByUser(this.user_id);
              break;
            case 'USER_GROUP_MODERATOR':
              this.isUserGroupModerator = true;
              this.isUserGroupRole = true;
              this.getReservationsByUser(this.user_id);
              break;
            case 'USER_GROUP_USER':
              this.isUserGroupRole = true;
              this.isUserRole = true;
              this.getReservationsByUser(this.user_id);
              break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getReservationsByPartner(partner_id); // Fetch alarms for the partner
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isUserRole = true;
            this.getReservationsByUser(this.user_id); // Fetch alarms for the partner
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
  fetchCurrentMonthReservationCount() {
    this.reservationService.getCurrentMonthReservationCount().subscribe(
      count => {
        this.reservationCountCurrentMonth = count; // Set the count to the property
      },
      error => {
        console.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  getReservations() {
    this.reservationService.getAllReservations().subscribe(
      (data) => {
        this.rows = data.reservation;
        console.log("this.rows in reservation app", this.rows);
        this.rows.sort((a, b) => b.reservation_id - a.reservation_id);
        this.temp = [...this.rows];
        console.log(this.rows);

        // Fetch charger details for each charging entry
        this.rows.forEach((row, index) => {
          this.chargerService.getCharger(row.charger_id).subscribe(
            (chargerData) => {
              this.rows[index].charger = chargerData.charger.charger_name;  // Add charger details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              console.log(error);
            }
          );
          this.userService.getUserById(row.user_id).subscribe(
            (userData) => {
              this.rows[index].user = userData.user.name;  // Add user details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              console.log(error);
            }
          );
          this.connectorService.getConnector(row.connector_id).subscribe({
            next: (connectorData: any) => {
              this.rows[index].connector = connectorData.connector.connector_name;  // Add user details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes

            },
            error: (error) => {
              console.error('Error fetching connectors:', error);
              this.errorMessage = 'Error fetching connectors. Please try again.';
            }
          });
        });

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )

  }

  getReservationsByCompany(companyId: number) {
    this.reservationService.getReservationsByCompanyId(companyId).subscribe(
      (data) => {
        if (data.success && Array.isArray(data.reservations)) {
          console.log("data.reservations",data.reservations)
          this.rows = data.reservations;
          this.temp = [...this.rows];
        } else {
          console.error('Invalid response structure:', data);
          this.errorMessage = 'Failed to load reservations - Invalid response format';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load reservations';
        console.error('Reservation fetch error:', error);
      }
    );
  }

  getReservationsByPartner(partnerId: number) {
    this.reservationService.getReservationsByPartnerId(partnerId).subscribe(
      (data) => {
        if (data.success && Array.isArray(data.reservations?.rows)) {
          this.rows = data.reservations.rows;
          this.temp = [...this.rows];
        } else {
          console.error('Invalid response structure:', data);
          this.errorMessage = 'Failed to load reservations - Invalid response format';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load reservations';
        console.error('Reservation fetch error:', error);
      }
    );
  }
  

  getReservationsByUser(userId: any) {
    this.reservationService.getReservationByUser(userId).subscribe(
      (data) => {
        if (data.success && Array.isArray(data.reservation)) {
          this.rows = data.reservation;
          this.temp = [...this.rows];
          console.log("getReservationsByUser", this.rows);
        } else {
          console.error('Invalid response structure:', data);
          this.errorMessage = 'Failed to load reservations - Invalid response format';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load reservations';
        console.error('Reservation fetch error:', error);
      }
    );
  }
  
  isReservationActive(row: any): boolean {
    return row?.reservation_status?.toLowerCase() === 'active';
  }
  

}
