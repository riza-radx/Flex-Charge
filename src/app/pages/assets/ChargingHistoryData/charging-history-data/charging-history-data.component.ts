import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargingHistoryService } from "../../../../services/chargingHistoryService/charging-history.service";

import { CardService } from "../../../../services/cardService/card.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { UserService } from "../../../../services/userService/user.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-charging-history-data',
  templateUrl: './charging-history-data.component.html',
  styles: [
  ]
})
export class ChargingHistoryDataComponent implements OnInit {

  errorMessage: any;
  id: string;
  chargingHistory: any = {}; // Ensure this is an object

  card: any = {}; // Ensure this is an object
  charger: any = {}; // Ensure this is an object
  connector: any = {}; // Ensure this is an object
  partner: any = {}; // Ensure this is an object
  user: any = {}; // Ensure this is an object
  userGroup: any = {}; // Ensure this is an object
  company: any = {}; // Ensure this is an object
  chargerLocation: any = {}; // Ensure this is an object
  selected: any[] = [];
  entries: number = 10;

  // 🆕 Roli i user-it aktual — perdoret ne UI qe te fshihen fushat financiare + snapshot
  // per role-t qe nuk kane akses (vetem COMPANY_ADMIN + COMPANY_ANALYST + RadX i shohin).
  userRole: string | null = null;
  isCompanyAdmin: boolean = false;
  isCompanyAnalyst: boolean = false;
  isRadXRole: boolean = false;
  get canSeeFinancials(): boolean {
    return this.isCompanyAdmin || this.isCompanyAnalyst || this.isRadXRole;
  }

  // 🆕 Computed properties per pjesen financiare — te gjitha bazohen ne
  // charging_history.total_cost, total_energy dhe energy_tariff_price (snapshot).

  // Total kWh (float).
  get totalEnergyKwh(): number {
    const v = parseFloat(this.chargingHistory?.total_energy);
    return isNaN(v) ? 0 : v;
  }

  // Sale Rate (Lek/kWh) — cmimi per kWh me te cilin i eshte shitur klientit.
  // Llogaritet nga total_cost / total_energy (nese kWh > 0), duke perjashtuar
  // idle fee (qe nuk eshte pjese e sale rate). Rrumbullakim ne 2 shifra.
  get saleRateComputed(): number {
    const kwh = this.totalEnergyKwh;
    if (kwh <= 0) return 0;
    return this.chargingCost / kwh;
  }

  // Purchase Rate (Lek/kWh) — cmimi i blerjes se energjise nga OSHEE ne kohen e sesionit.
  // Prioritet: charging_history.energy_tariff_price (snapshot).
  // Fallback: charger.tariff_energy (per rekordet e vjetra pa snapshot).
  get purchaseRate(): number {
    const snap = parseFloat(this.chargingHistory?.energy_tariff_price);
    if (!isNaN(snap) && snap > 0) return snap;
    const fallback = parseFloat(this.chargingHistory?.Charger?.tariff_energy);
    return isNaN(fallback) ? 0 : fallback;
  }

  // Purchase Cost (Lek) — kostoja totale e blerjes = kWh × Purchase Rate.
  get purchaseCost(): number {
    return this.totalEnergyKwh * this.purchaseRate;
  }

  // Net Profit (Lek) — fitimi = Sale Revenue (charging cost pa idle fee) − Purchase Cost.
  get netProfit(): number {
    return this.chargingCost - this.purchaseCost;
  }

  // 🆕 Partner Share % — snapshot i frozen ne charging_history (bazuar ne current_type):
  //   Charger AC  -> ac_split_percentage_snap  (fallback: partner.ac_split_percentage)
  //   Charger DC  -> dc_split_percentage_snap  (fallback: partner.dc_split_percentage)
  //   Charger tjeter/mungon -> split_percentage_snap (fallback: partner.split_percentage)
  get partnerSharePct(): number {
    const charger = this.chargingHistory?.Charger;
    const partner = this.chargingHistory?.Partner;
    const pick = (snap: any, current: any): number => {
      const s = parseFloat(snap);
      if (!isNaN(s)) return s;
      const c = parseFloat(current);
      return isNaN(c) ? 0 : c;
    };
    if (!partner) return 0;
    if (charger?.current_type === 'AC') {
      return pick(this.chargingHistory?.ac_split_percentage_snap, partner.ac_split_percentage);
    }
    if (charger?.current_type === 'DC') {
      return pick(this.chargingHistory?.dc_split_percentage_snap, partner.dc_split_percentage);
    }
    return pick(this.chargingHistory?.split_percentage_snap, partner.split_percentage);
  }

  // 🆕 Company Share % = 100 − Partner Share % (kur ka partner, ndryshe 100%).
  get companySharePct(): number {
    return this.chargingHistory?.Partner ? (100 - this.partnerSharePct) : 100;
  }

  // 🆕 Fitimi i partnerit = Net Profit × Partner Share % / 100.
  get partnerEarning(): number {
    return this.netProfit * this.partnerSharePct / 100;
  }

  // 🆕 Fitimi i kompanise = Net Profit − Partner's Earning.
  get companyEarning(): number {
    return this.netProfit - this.partnerEarning;
  }

  get idleFeeCost(): number {
    const v = this.chargingHistory?.fullchargefeecost;
    const n = typeof v === 'number' ? v : parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  get feePerMinute(): number {
    const v = this.chargingHistory?.fullchargefeeperminute;
    const n = typeof v === 'number' ? v : parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  // Billable idle minutes only (excludes the grace period before the fee starts).
  get billableIdleMinutes(): number {
    return this.feePerMinute > 0 ? Math.round(this.idleFeeCost / this.feePerMinute) : 0;
  }

  get chargingCost(): number {
    const total = parseFloat(this.chargingHistory?.total_cost);
    const idle = this.idleFeeCost;
    if (isNaN(total)) return 0;
    const diff = total - idle;
    return diff < 0 ? 0 : diff;
  }

  constructor(
    private chargingHistoryService: ChargingHistoryService,
    private cardService: CardService,
    private chargerService: ChargerService,
    private chargerLocationService: ChargerLocationService,
    private connectorService: ConnectorService,
    private partnerService: PartnerService,
    private userService: UserService,
    private UserGroupService: UserGroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    // 🆕 Merr rolin qe UI te vendose nese shfaqet seksioni financiar / snapshot.
    this.userRole = localStorage.getItem('userRole');
    this.isCompanyAdmin = this.userRole === 'COMPANY_ADMIN';
    this.isCompanyAnalyst = this.userRole === 'COMPANY_ANALYST';
    this.isRadXRole = this.userRole === 'RadX_Admin' || this.userRole === 'RADX_MODERATOR';
    this.getChargingHistory();
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

  getChargingHistory() {
    this.chargingHistoryService.getCharging(this.id).subscribe(
      (data) => {
        logger.log(data.chargingHistory);
        if (data && data.chargingHistory) {
          this.chargingHistory = data.chargingHistory; // Make sure data.promo is an object
          // this.getCard(data.chargingHistory.card_id)
          this.getCharger(data.chargingHistory.charger_id)
          // this.getConnector(data.chargingHistory.connector_id)
          // this.getUserById(data.chargingHistory.user_id)
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // getUserById(userId: number) {
  //   this.userService.getUserById(userId).subscribe(
  //     (data) => {
  //       console.log(data.user)
  //       this.user = data.user
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  // getUserGroupById(userGroupId: number) {
  //   this.UserGroupService.getUserGroup(userGroupId).subscribe(
  //     (data) => {
  //       console.log(data.userGroup)
  //       this.userGroup = data.userGroup
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  // getPartnerById(partnerId: number) {
  //   this.partnerService.getPartner(partnerId).subscribe(
  //     (data) => {
  //       console.log(data.partner)
  //       this.partner = data.partner
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  // getCard(cardId: number) {
  //   this.cardService.getCard(cardId).subscribe(
  //     (data) => {
  //       console.log(data.card)
  //       this.card = data.card
  //       this.getUserById(data.card.user_id)
  //       // this.getUserGroupById(data.card.usergr_id)
  //       // this.getPartnerById(data.card.partner_id)
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  
  getCharger(chargerId: any) {
    this.chargerService.getCharger(chargerId).subscribe(
      (data) => {
        // console.log(data.charger)
        // this.charger = data.charger
        this.getLocation(data.charger.location_id)
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  
  // getConnector(connectorId: number) {
  //   this.connectorService.getConnector(connectorId).subscribe(
  //     (data) => {
  //       console.log(data.connector)
  //       this.connector = data.connector
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  
  getLocation(locationId: number) {
    this.chargerLocationService.getChargerLocation(locationId).subscribe(
      (data) => {
        logger.log(data.location)
        this.chargerLocation = data.location
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

}
