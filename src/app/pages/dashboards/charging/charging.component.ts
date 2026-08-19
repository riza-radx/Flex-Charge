import { logger } from '@core/logger';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargingService } from "../../../services/chargingService/charging.service";
import { ChargerService } from "../../../services/chargerService/charger.service";
import { ConnectorService } from "../../../services/connectorService/connector.service";
import { CardService } from "../../../services/cardService/card.service";
import { RatePerDaysService } from "../../../services/ratePerDaysService/rate-per-days.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-charging',
  templateUrl: './charging.component.html',
})
export class ChargingComponent implements OnInit, OnDestroy {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  private socket: WebSocket;

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

  constructor(
    private chargingService: ChargingService,
    private chargerService: ChargerService,
    private connectorService: ConnectorService,
    private cardService: CardService,
    private ratePerDaysService: RatePerDaysService,
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
    if (event.type === 'click') {
      this.router.navigate([`/monitoring/charging/${this.activeRow.charging_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    // Retrieve user role from localStorage
    this.userRole = localStorage.getItem('userRole');

    if (this.userRole) {
      switch (this.userRole) {
        case 'RadX_Admin':
          this.isRadXAdmin = true;
          break;
        case 'RADX_MODERATOR':
          this.isRadXModerator = true;
          break;
        case 'COMPANY_ADMIN':
          this.isCompanyAdmin = true;
          break;
        case 'SUPER_USER':
          this.isSuperUser = true;
          break;
        case 'COMPANY_OPERATOR':
          this.isCompanyOperator = true;
          break;
        case 'COMPANY_MODERATOR':
          this.isCompanyModerator = true;
          break;
        case 'COMPANY_TECHNICAL_OPERATOR':
          this.isCompanyTechnicalOperator = true;
          break;
        case 'COMPANY_MAINTENANCE_SPECIALIST':
          this.isCompanyMaintenanceSpecialist = true;
          break;
        case 'COMPANY_CALL_CENTER':
          this.isCompanyCallCenter = true;
          break;
        case 'COMPANY_ANALYST':
          this.isCompanyAnalyst = true;
          break;
        case 'USER_GROUP_ADMIN':
          this.isUserGroupAdmin = true;
          break;
        case 'USER_GROUP_MODERATOR':
          this.isUserGroupModerator = true;
          break;
        case 'USER_GROUP_USER':
          this.isUserGroupUser = true;
          break;
        case 'PARTNER_ADMIN':
          this.isPartnerAdmin = true;
          break;
        case 'PARTNER_MODERATOR':
          this.isPartnerModerator = true;
          break;
        case 'USER':
case 'COMPANY_USER':
          this.isUser = true;
          break;
        default:
          logger.error('Unknown user role:', this.userRole);
          this.router.navigate(['/login']); // Redirect to login or error page
      }
    }
    // this.getChargings();
    // this.connectToWebSocket();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();  // Close the WebSocket connection on component destruction
    } 
  }

  getChargings() {
    this.chargingService.getAllChargings().subscribe(
      (data) => {
        this.rows = data.charging;
        this.temp = [...this.rows];
        logger.log(this.rows);

        // Fetch charger details for each charging entry
        this.rows.forEach((row, index) => {
          this.chargerService.getCharger(row.charger_id).subscribe(
            (chargerData) => {
              this.rows[index].charger = chargerData.charger.charger_name;  // Add charger details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              logger.log(error);
            }
          );
          this.connectorService.getConnector(row.connector_id).subscribe(
            (connectorData) => {
              this.rows[index].connector = connectorData.connector.connector_name;  // Add connector details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              logger.log(error);
            }
          );
          this.cardService.getCard(row.card_id).subscribe(
            (cardData) => {
              this.rows[index].card = cardData.card.serial_no;  // Add card details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              logger.log(error);
            }
          );
          this.ratePerDaysService.getRatePerDay(row.rate_per_days_id).subscribe(
            (ratePerDaysData) => {
              this.rows[index].ratePerDay = ratePerDaysData.ratePerDay.day;  // Add rate per days details to the row
              this.temp = [...this.rows];  // Update temp to reflect changes
            },
            (error) => {
              this.errorMessage = error.message;
              logger.log(error);
            }
          );
        });

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )

  }

  // WebSocket Connection
  connectToWebSocket() {
    const socketUrl = 'wss://api.radx.app/wss?userId=1&companyId=1';
    this.socket = new WebSocket(socketUrl);

    // Handle WebSocket connection open
    this.socket.onopen = (event) => {
      logger.log('WebSocket is open now.');
      // Optionally send a message to server when connected
      // this.socket.send('Hello Server');
    };

    // Handle incoming messages from WebSocket
    this.socket.onmessage = (event) => {
      // console.log('Message from server:', event.data);
      // Process incoming data, e.g., update charger status, etc.
    };

    // Handle WebSocket errors
    this.socket.onerror = (error) => {
      logger.error('WebSocket Error:', error);
    };

    // Handle WebSocket closure
    this.socket.onclose = (event) => {
      logger.log('WebSocket is closed now.');
    };
  }

  // Example method to send messages via WebSocket
  sendMessageToWebSocket(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      logger.log('Message sent:', message);
    } else {
      logger.log('WebSocket is not open.');
    }
  }

}
