import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlarmService } from "../../../../services/alarmService/alarm.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-radxalarm',
  templateUrl: './radxalarm.component.html',
  styles: [
  ]
})
export class RadxalarmComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;
  alarmCountCurrentMonth: number = 0;
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

  // isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;

  company_id: any;
  partner_id: any;


  isRadXRole: boolean = false;
  constructor(
    private alarmService: AlarmService,
    private connectorService: ConnectorService,
    private chargerService: ChargerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXRole = true;
            // this.getAlarms();
            //this.fetchCurrentMonthAlarmCount();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            // this.getAlarms();
            //this.fetchCurrentMonthAlarmCount();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
            this.isCompanyRole = true;
            this.company_id = parsedCugpCred.company_id;
            // this.getAlarmsByCompany(company_id); // Fetch alarms for the company
            break;

          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.partner_id = parsedCugpCred.partner_id;
            this.partner_id = parsedCugpCred.partner_id;
            // this.getAlarmsByPartner(partner_id); // Fetch alarms for the partner
            break;
          default:
            logger.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        logger.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      logger.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }

    this.getIpData()

  }

  getIpData() {
    this.alarmService.getIPInfo().subscribe(
      (data) => {
        // this.logs = data.log;
        // this.tempLogs = [...this.logs];
        // console.log("IP Info", data)
        if (this.isRadXRole === true) {
          this.getAlarms(data.timezone)
        }
        else if (this.isCompanyRole === true) {
          this.getAlarmsByCompany(this.company_id, data.timezone)
        }
        else if (this.isPartnerRole === true) {
          this.getAlarmsByPartner(this.partner_id, data.timezone)
        }
        // this.getAlarms(data.timezone);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  entriesChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.entries = parseInt(target.value, 10);
  }

  fetchCurrentMonthAlarmCount() {
    this.alarmService.getCurrentMonthAlarmCount().subscribe(
      count => {
        this.alarmCountCurrentMonth = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }

  filterTable(event: Event) {
    const target = event.target as HTMLInputElement;
    const val = target.value.toLowerCase();

    this.temp = this.rows.filter((d) => {
      return Object.values(d).some((value) =>
        value.toString().toLowerCase().includes(val)
      );
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  getAlarms(timezone: any) {
    this.alarmService.getAllAlarms(timezone).subscribe(
      (data) => {
        if (data.success && Array.isArray(data.alarms)) {
          this.rows = data.alarms.map(alarm => ({
            ...alarm,
            charger: null,  // Placeholder for charger name
            connector: null  // Placeholder for connector name
          }));
          this.temp = [...this.rows];
          // this.rows.sort((a, b) => b.alarm_id - a.alarm_id);
          // Fetch charger and connector details for each row
          // this.rows.forEach((row, index) => {
          //   this.fetchChargerDetails(row, index);
          //   this.fetchConnectorDetails(row, index);
          // });
        } else {
          logger.error("Invalid response structure:", data);
          this.errorMessage = "Failed to load alarms - Invalid response format";
        }
      },
      (error) => {
        this.errorMessage = "Failed to load alarms";
        logger.error("Alarm fetch error:", error);
      }
    );
  }

  fetchChargerDetails(row, index) {
    this.chargerService.getCharger(row.charger_id).subscribe(
      (chargerData) => {
        // console.log("Charger Data Response:", chargerData);  // Debugging log

        // Check if response structure matches expected format
        if (chargerData?.success && chargerData.charger?.charger_name) {
          this.rows[index].charger = chargerData.charger.charger_name;
          this.temp = [...this.rows];
        } else {
          logger.warn("Unexpected charger data format for row:", row);
          this.rows[index].charger = "Unknown Charger";  // Informative fallback
        }
      },
      (error) => {
        logger.error("Error fetching charger data:", error);
        this.rows[index].charger = "Error Loading Charger";  // Error fallback
      }
    );
  }


  fetchConnectorDetails(row, index) {
    this.connectorService.getConnector(row.connector_id).subscribe(
      (connectorData) => {
        if (connectorData?.success && connectorData.connector) {
          this.rows[index].connector = connectorData.connector.connector_name;
          this.temp = [...this.rows];
        } else {
          logger.warn("Failed to load connector data for row:", row);
          this.rows[index].connector = "Unknown";  // Fallback value
        }
      },
      (error) => {
        logger.error("Connector fetch error:", error);
        this.rows[index].connector = "Error";  // Fallback value for display
      }
    );
  }
  getAlarmsByCompany(companyId: number, timezone: any) {
    this.alarmService.getAlarmsByCompanyId(companyId, timezone).subscribe(
      (data) => {
        if (data.success && Array.isArray(data.alarms)) {
          this.rows = data.alarms;
          this.temp = [...this.rows];
          // Fetch charger and connector details for each row
          // this.rows.forEach((row, index) => {
          //   this.fetchChargerDetails(row, index);
          //   this.fetchConnectorDetails(row, index);
          // });
          // this.rows.sort((a, b) => b.alarm_id - a.alarm_id);
        } else {
          logger.error('Invalid response structure:', data);
          this.errorMessage = 'Failed to load alarms - Invalid response format';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load alarms';
        logger.error('Alarm fetch error:', error);
      }
    );
  }

  getAlarmsByPartner(partnerId: number, timezone: any) {
    this.alarmService.getAlarmsByPartnerId(partnerId, timezone).subscribe(
      (data) => {
        // console.log('getAlarmsByPartnerId', data)
        if (data.success && Array.isArray(data.alarms)) {
          this.rows = data.alarms;
          this.temp = [...this.rows];
          // Fetch charger and connector details for each row
          // this.rows.forEach((row, index) => {
          //   this.fetchChargerDetails(row, index);
          //   this.fetchConnectorDetails(row, index);
          // });
          // this.rows.sort((a, b) => b.alarm_id - a.alarm_id);
        } else {
          logger.error('Invalid response structure:', data);
          this.errorMessage = 'Failed to load alarms - Invalid response format';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load alarms';
        logger.error('Alarm fetch error:', error);
      }
    );
  }

}
