import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChargingService } from "../../../../services/chargingService/charging.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { CardService } from "../../../../services/cardService/card.service";
import { RatePerDaysService } from "../../../../services/ratePerDaysService/rate-per-days.service";
import { ChargingStatusService } from 'src/app/services/chargingStatusService/charging-status.service';
import { UserService } from 'src/app/services/userService/user.service';
import { AuthService } from 'src/app/services/authService/auth.service';
import { forkJoin, map } from 'rxjs';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-radxmonitoring',
  templateUrl: './radxmonitoring.component.html',
  styles: [
  ]
})
export class RadxmonitoringComponent implements OnInit {

  errorMessage: any;
  showConfirmation: boolean = false;
  selectedChargingId: number | null = null;
  chargerIdToStop: number | null = null;
  chargings: any[] = []; // Store all charging records
  userNames: { [key: number]: string } = {}; // Store user names with charging IDs as keys
  cardSerial: string[] = [];// Store card serial with charging IDs as keys
  chargingTimes: { charging_id: number; started_time: Date }[] = [];
  private intervalId: any; // Store the interval ID for clearings
  chargingDetails: any[] = [];
  userDetails: any[] = [];
  userEmail: any[] = [];
  userRole: string | null = null;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
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
  stoppedChargingIds: number[] = [];
  userDetailsS: any;
  userDetailsId: any;
  userDetailsCId: any;
  private socket: WebSocket;
  totalActiveChargings: number = 0;
  company_id: any;
  partner_id: any;
  usergr_id: any;
  user_id: any;
  constructor(
    private chargingStatusService: ChargingStatusService,
    private chargingService: ChargingService,
    private chargerService: ChargerService,
    private connectorService: ConnectorService,
    private cardService: CardService,
    private ratePerDaysService: RatePerDaysService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.loadStoppedChargingIds();

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergr_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getAllChargings();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getAllChargings();
            break;
          case 'COMPANY_ADMIN':
            // console.log('COMPANY_ADMIN is set to true');
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getChargingsByCompanyId(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.getChargingsByCompanyId(this.company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            this.getChargingsByCompanyId(this.company_id);
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
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            console.log("usergr_id", this.usergr_id)
            this.getChargingsByUserGroupdId(this.usergr_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            console.log("usergr_id", this.usergr_id)
            this.getChargingsByUserGroupdId(this.usergr_id);
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupUser = true;
            this.isUserGroupRole = true;
            this.isUserRole = true;
            this.getChargingsByUserId(this.user_id);
            break;
          case 'PARTNER_ADMIN':
            this.isPartnerRole = true;
            this.getChargingsByPartnerId(this.partner_id);
            break;
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            this.getChargingsByPartnerId(this.partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isUserRole = true;
            this.getChargingsByUserId(this.user_id);
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

    this.startTimeUpdate();
    this.fetchAllChargingDetails();
    this.getCurrentUserDetail();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Fetch All Charging
  getAllChargings() {
    this.chargingService.getAllChargings().subscribe(
      (data) => {
        this.fetchAllData(data);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getCurrentUserDetail() {
    this.authService.getCurrentUserDetails().subscribe(
      (data) => {
        // console.log(data);
        this.userDetails = data.user;
        this.userDetailsId = data.user.id;
        this.userDetailsCId = data.user.company_id;
        this.connectToWebSocket();
      },
      error => {
        console.log(error);
      }
    )
  }

  getChargingsByCompanyId(company_id: string) {
    this.chargingService.getChargingByCompany(company_id).subscribe(
      (data) => {
        this.fetchAllData(data);

        // Count only active/charging sessions
        this.totalActiveChargings = data.length;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  // Fetch Charging By User Group
  getChargingsByUserGroupdId(usergr_id: string) {
    this.chargingService.getChargingByUserGroup(usergr_id).subscribe(
      (data) => {
        this.fetchAllData(data);
        // Count only active/charging sessions
        this.totalActiveChargings = data.filter(
          (session: any) => session.status === 'Charging' // or whatever field your backend uses
        ).length;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  // Fetch Charging By Partner
  getChargingsByPartnerId(partner_id: string) {
    this.chargingService.getChargingByPartner(partner_id).subscribe(
      (data) => {
        this.fetchAllData(data);
        // Count only active/charging sessions
        this.totalActiveChargings = data.filter(
          (session: any) => session.status === 'Charging' // or whatever field your backend uses
        ).length;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  getChargingsByUserId(user_id: string) {
    this.chargingService.getChargingByUser(user_id).subscribe(
      (data) => {
        this.fetchAllData(data);
        this.totalActiveChargings = data.filter(
          (session: any) => session.status === 'Charging' // or whatever field your backend uses
        ).length;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  // 🆕 BC Tenant gate: sot vetem Vega Charging (company_id=4) krijon fature ne BC.
  // Phase 2 do bej config DB-driven per multi-tenant.
  private readonly BC_ENABLED_COMPANY_IDS: number[] = [4];

  /**
   * 🆕 A do te krijoje BC fature ky charging?
   *
   *   1. Company duhet te jete e konfiguruar per BC (sot vetem company_id=4) — perndryshe FALSE
   *   2. Nese ka UG (charging.UserGroup nga API) → perdor check_fisk e UG-se
   *   3. Nese charging ka usergr_id por UG mungon nga API → FALSE defansiv + warning
   *   4. Asnje usergr_id askund → individual user → TRUE
   */
  willBeFiscalized(charging: any): boolean {
    if (!charging) return false;
    const cid = parseInt(charging.company_id, 10);
    if (!this.BC_ENABLED_COMPANY_IDS.includes(cid)) return false;

    const ug = charging.UserGroup || charging.User?.UserGroup || null;
    if (ug) {
      const cf = ug.check_fisk;
      return cf === true || cf === 1 || cf === '1' || cf === 'true';
    }

    const hasUgId = !!(charging.usergr_id || charging.User?.usergr_id);
    if (hasUgId) {
      // Loge nje here per cdo charging qe te shihet ne DevTools — heqim pas verifikimit
      if (!charging.__loggedUgWarn) {
        console.warn(
          '⚠️ willBeFiscalized — UG data mungon nga API. Charging dump:',
          {
            charging_id: charging.charging_id,
            company_id: charging.company_id,
            usergr_id: charging.usergr_id,
            user_usergr_id: charging.User?.usergr_id,
            hasUserGroupKey: 'UserGroup' in charging,
            hasUserUserGroupKey: charging.User && 'UserGroup' in charging.User,
            raw_UserGroup: charging.UserGroup,
            raw_User_UserGroup: charging.User?.UserGroup
          }
        );
        charging.__loggedUgWarn = true;
      }
      return false;
    }

    return true;
  }

  /**
   * 🆕 Numerimi i karikimeve qe do fiskalizohen — shfaqet siper liste per admin/analyst.
   */
  get fiscalizableCount(): number {
    return (this.chargings || []).filter(c => this.willBeFiscalized(c)).length;
  }

  /**
   * 🆕 Vetem admin/analyst sheh flag-un dhe count-in.
   */
  get canSeeFiscalFlag(): boolean {
    return this.isCompanyAdmin || this.isCompanyAnalyst || this.isRadXAdmin || this.isRadXModerator;
  }

  isChargingVisible(charging: any): boolean {

    // RadX sheh gjithçka
    if (this.isRadXRole) {
      return true;
    }

    // Company role
    if (this.isCompanyRole) {
      return charging.company_id === this.company_id;
    }

    // Partner role
    if (this.isPartnerRole) {
      return charging.partner_id === this.partner_id;

    }

    // User Group role
    if (this.isUserGroupRole) {
      return charging.usergr_id === this.usergr_id;
    }

    // User role
    if (this.isUserRole) {
      return charging.user_id === this.user_id;
    }

    return false;
  }
  // Fetch Charging By Partner
  getCharging(charging_id: string) {
    this.chargingService.getCharging(charging_id).subscribe(
      (data) => {
        const charging = data.charging;

        if (!this.isChargingVisible(charging)) {
          return;
        }

        this.chargings.push(data.charging);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }


  fetchAllData(response: any): void {
    if (response.success) {
      this.chargings = response.charging;
      this.fetchUserNames();
      this.fetchUsers();
      this.startCleanupInterval();
      this.fetchChargingTimes();
    } else {
      console.error('Error fetching charging records:', response.message);
    }
  }

  fetchUserNames(): void {
    this.chargerService.getCharger(this.chargings).subscribe({
      next: (names) => this.userNames = names,
      error: (err) => console.error('Error fetching user names:', err)
    });
  }

  fetchCardSerial(): void {
    this.chargings.forEach((charging, index) => {
      this.cardService.getCard(charging.card_id).subscribe({
        next: (serial) => {
          // console.log(serial)
          this.cardSerial[index] = serial.card.serial_no; // Ensure this.cardSerial is an array
        },
        error: (err) => console.error('Error fetching card serial:', err)
      });
    });
  }

  fetchUsers(): void {
    this.chargings.forEach((charging, index) => {
      this.userService.getUserById(charging.user_id).subscribe({
        next: (data) => {
          // console.log("fetchUsers", data)
          this.userDetails[index] = data.user.name;
          this.userEmail[index] = data.user.email;
        },
        error: (err) => console.error('Error fetching user name data:', err)
      });
    });
  }
  fetchChargingTimes(): void {
    this.chargingStatusService.getAllChargingTimes().subscribe({
      next: (data) => {
        if (data.success) {
          this.chargingTimes = data.chargingTimes.map((charging: any) => ({
            charging_id: charging.charging_id,
            started_time: new Date(charging.strted_time)
          }));
        } else {
          console.error('Error fetching charging times:', data.message);
        }
      },
      error: (err) => console.error('Error fetching charging times:', err)
    });
  }


  startTimeUpdate(): void {
    this.intervalId = setInterval(() => {
      this.chargingTimes = this.chargingTimes.map(charging => ({
        ...charging,
        time_difference: this.calculateTimeDifference(charging.started_time)
      }));
    }, 1000);
  }

  calculateTimeDifference(startTime: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(startTime).getTime();
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${this.pad(hours)}:${this.pad(minutes)}`;
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  fetchAllChargingDetails(): void {
    this.chargingStatusService.getAllChargingDetails().subscribe({
      next: (response) => {
        if (response.success) {
          this.chargingDetails = response.chargings;
        } else {
          console.error('Error fetching charging details:', response.message);
        }
      },
      error: (err) => console.error('Error fetching charging details:', err)
    });
  }

  getChargerName(chargingId: number): string {
    const detail = this.chargingDetails.find(d => d.charging_id === chargingId);
    return detail ? detail.Charger.charger_name : 'N/A';
  }

  getConnectorName(chargingId: number): string {
    const detail = this.chargingDetails.find(d => d.charging_id === chargingId);
    return detail ? detail.Connector.connector_name : 'N/A';
  }

  getLocationCity(chargingId: number): string {
    const detail = this.chargingDetails.find(d => d.charging_id === chargingId);
    return detail ? detail.Charger.Location.city : 'N/A';
  }


  stopTransaction(chargerID: number, charging_id: number): void {
    this.chargerService.getCharger(chargerID).subscribe({
      next: (response: any) => {
        const ocppId = response.charger.ocpp_id; // Assuming the API returns the charger object with `ocpp_id`
        if (ocppId) {
          this.chargerService.stopTransaction(ocppId, charging_id).subscribe({
            next: (result: any) => {
            },
            error: (error) => {
              console.error('Error stopping transaction:', error);
            },
          });
        } else {
          console.error('OCPP ID not found for the given charger.');
        }
      },
      error: (error) => {
        console.error('Error fetching charger details:', error);
      }
    });


  }

  connectToWebSocket() {
    const socketUrl = `wss://api.radx.app/wss?userId=${this.userDetailsId}&companyId=${this.userDetailsCId}`;
    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'chargingUpdate') {
        this.getCharging(data.charging_id);
      } else if (data.type === 'meterValuesUpdate') {
        const chargingIndex = this.chargings.findIndex(chg => chg.charging_id === data.charging_id);

        if (chargingIndex !== -1) {
          if (data.status === 'Finished') {
            this.chargings.splice(chargingIndex, 1);
          } else {
            this.chargings[chargingIndex] = {
              ...this.chargings[chargingIndex],
              energy: data.total_energy, // Ensure "energy" matches the HTML binding
              cost: data.total_cost, // Ensure "cost" matches the HTML binding
              socValue: data.socValue,
            };

            // Trigger UI update
            this.chargings = [...this.chargings];
          }
        }
      } else {
        console.warn('Unknown WebSocket message type:', data.type);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  confirmStop(chargerId: number, chargingId: number) {
    this.showConfirmation = true;
    this.selectedChargingId = chargingId;
    this.chargerIdToStop = chargerId;
  }


  stopConfirmed() {
    if (this.chargerIdToStop && this.selectedChargingId) {
      this.stopTransaction(this.chargerIdToStop, this.selectedChargingId);

      const stored = localStorage.getItem('stoppedChargingData');
      let stoppedList = stored ? JSON.parse(stored) : [];

      // Avoid duplicates
      if (!stoppedList.find(item => item.id === this.selectedChargingId)) {
        stoppedList.push({
          id: this.selectedChargingId,
          time: new Date().getTime()
        });
      }

      localStorage.setItem('stoppedChargingData', JSON.stringify(stoppedList));
    }

    this.showConfirmation = false;
    this.selectedChargingId = null;
    this.chargerIdToStop = null;
  }



  cancelStop() {
    this.showConfirmation = false;
    this.selectedChargingId = null;
    this.chargerIdToStop = null;
  }


  loadStoppedChargingIds() {
    const stored = localStorage.getItem('stoppedChargingData');
    const data = stored ? JSON.parse(stored) : [];
    this.stoppedChargingIds = data.map((item: any) => item.id);
  }

  startCleanupInterval() {
    setInterval(() => {

      const stored = localStorage.getItem('stoppedChargingData');
      let stoppedList = stored ? JSON.parse(stored) : [];
      const now = new Date().getTime();
      let updatedList = [];

      const chargingStatusObservables = stoppedList.map(item =>
        this.chargingService.getCharging(item.id).pipe(
          map((response) => {
            const chargingStatus = response?.charging?.charging_status;
            return {
              item,
              chargingStatus,
              chargingId: item.id
            };
          })
        )
      );

      forkJoin(chargingStatusObservables).subscribe((results: { item: any, chargingStatus: string, chargingId: number }[]) => {
        results.forEach(({ item, chargingStatus }) => {

          const isExpired = now - item.time > 5 * 60 * 1000; // 5 minutes expiration check
          const isFinished = chargingStatus === 'Finished'; // Check if status is "Finished"
          if (!(isExpired && isFinished)) {
            updatedList.push(item);
          } else {
            console.log(`Removing charging ID ${item.id}`);
          }
        });

        // Update the list in stoppedChargingIds and local storage
        this.stoppedChargingIds = updatedList.map(item => item.id);
        localStorage.setItem('stoppedChargingData', JSON.stringify(updatedList));

      }, (error) => {
        console.error('Error fetching charging status:', error);
      });

    }, 60 * 1000); // Run every 1 minute
  }

}