import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargerLocationService } from 'src/app/services/chargerLocationService/charger-location.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { RateService } from 'src/app/services/rateService/rate.service';

@Component({
  selector: 'app-companyupdatechargers',
  templateUrl: './companyupdatechargers.component.html',
  styles: []
})
export class CompanyupdatechargersComponent implements OnInit {
  chargerForm: FormGroup;
  chargerId: number;
  chargerLocations: any;
  partners: any;
  companies: any;
  errorMessage: any;
  successMessage: string = '';
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
  rates = [];
  constructor(
    private fb: FormBuilder,
    private chargerService: ChargerService,
    private connectorService: ConnectorService,
    private rateService: RateService,
    private router: Router,
    private route: ActivatedRoute,
    private chargerLocationService: ChargerLocationService,
    private partnerService: PartnerService,
    private companyService: CompanyService,
  ) {
    this.chargerForm = this.fb.group({
      chargerName: ['', [Validators.required, Validators.maxLength(20)]],
      type: ['', Validators.required],
      // noOfConnectors: [1, [Validators.required, Validators.min(1)]],
      valid: [false],
      status: ['', Validators.required],
      locationId: [null, Validators.required],
      ratedPower: [null, Validators.required],
      companyId: [null, Validators.required],
      ocppProtocol: ['', Validators.required],
      ocppId: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      currentType: ['', Validators.required],
      maxPower: [null, Validators.required],
      maxVoltage: [null, Validators.required],
      maxAmperage: [null, Validators.required],
      phase: ['', Validators.required],
      phaseRotation: ['', Validators.required],
      reservation_fee: ['', Validators.required],
      reservation_wait: [null, Validators.required],
      // 🆕 Zevendesimi i tariff_energy me referencë ne rate. Fusha e vjeter mbetet
      // ne DB por s'perdoret me nga UI. Nese uses_bursa_price=true, kjo s'kerkohet.
      energy_tariff_rate_id: [null],
      // 🆕 Eficenca ne %: FormControl e komentuar sepse fusha eshte fshehur nga UI.
      // Backend ka DEFAULT 100 ne DB — payload-i s'e dergon me kete field.
      // efficiency_percentage: [100, [Validators.required, Validators.min(0), Validators.max(100)]],
      partnerId: [null],
      allowReservation: [false],
      rate_id: [null],
      fullchargefeeperminute: [0, [Validators.required, Validators.min(0)]],
      is_public: [false],
      isHexReverse: [false],
      // Toggle Switch (Vega Charging): kur ON, charger.rate_id fiton mbi user.rate_id.
      charger_rate_priority: [false],
      // Datetime lokal (YYYY-MM-DDTHH:mm) — kur duhet te fillojë skedulimi. Bosh = tani.
      charger_rate_priority_start: [null],
      // Datetime lokal (YYYY-MM-DDTHH:mm) kur toggle fiket vete. Bosh = pa limit kohor.
      charger_rate_priority_until: [null],
      // 🆕 G/L accounts per BC — vetem COMPANY_ADMIN/COMPANY_ANALYST i redaktojne (kontrolli behet ne template).
      g_l_purchase: [''],
      g_l_earnings: [''],
      // 🆕 Bursa Pricing: kur ON, cmimi i blerjes vjen nga bursa_hourly_price (ALPEX day-ahead).
      uses_bursa_price: [false],
      // connectors: this.fb.array([]) // Initialize the form array
    });
  }

  // Validim per Toggle Scheduler (Start + End rregullat).
  // Refuzon cdo datetime ne te kaluaren — deri ne minute (jo vetem diten e djeshme).
  //   • toggle=OFF + End + s'ka Start → error: cakto Start ose bej ON
  //   • Start/End < tani              → refuzohet (60s slack per latency e user-it)
  //   • End <= Start                  → refuzohet
  ratePriorityScheduleError(): string | null {
    const enabled = !!this.chargerForm.get('charger_rate_priority')?.value;
    const startVal = this.chargerForm.get('charger_rate_priority_start')?.value;
    const untilVal = this.chargerForm.get('charger_rate_priority_until')?.value;

    if (!enabled && !startVal && untilVal) {
      return 'Te lutem bej check toggle switch ose percakto nje Start datetime.';
    }

    const now = new Date();
    // 60s slack per latency e user-it (kur toggle-i check-ohet, Start populohet me nowIsoMinute();
    // user-i mund te klikoje Save disa sekonda me pas, cka do te thote qe start eshte tashme
    // teknikisht ne te kaluaren nga disa sekonda). onSubmit e ri-fresk-on.
    const nowMinusSlack = now.getTime() - 60000;

    if (startVal) {
      const s = new Date(startVal);
      if (Number.isNaN(s.getTime())) return 'Start jo i vlefshem.';
      if (s.getTime() < nowMinusSlack) {
        return 'Start s\'mund te jete ne te kaluaren (deri ne minute).';
      }
    }

    if (untilVal) {
      const u = new Date(untilVal);
      if (Number.isNaN(u.getTime())) return 'End jo i vlefshem.';
      if (u.getTime() <= now.getTime()) {
        return 'End s\'mund te jete ne te kaluaren ose tani (duhet ne te ardhmen).';
      }
      if (startVal) {
        const s = new Date(startVal);
        if (u.getTime() <= s.getTime()) {
          return 'End duhet te jete pas Start.';
        }
      }
    }

    return null;
  }

  // Backwards-compat — perdoret nga rreshtat e vjeter te template-it nese kane mbetur.
  ratePriorityUntilError(): string | null {
    return this.ratePriorityScheduleError();
  }

  // Min per datetime-local input — momenti aktual (YYYY-MM-DDTHH:mm).
  nowIsoMinute(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  nowIsoDate(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  // Konverton nje datetime nga API (mund te jete ISO UTC) ne format `YYYY-MM-DDTHH:mm` local
  // te pershtatshem per input type="datetime-local".
  toLocalDatetimeInput(v: string | Date): string {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  ngOnInit(): void {
    this.chargerId = this.route.snapshot.params['id'];
    this.getChargerById(this.chargerId);
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    // 🆕 Auto-populate Start me datetime tani kur user checkon toggle-in.
    // Nese user-i e ndryshon Start-in manualisht pas checkimit, ndryshimi mbetet.
    const toggleControl = this.chargerForm.get('charger_rate_priority');
    const startControl = this.chargerForm.get('charger_rate_priority_start');
    if (toggleControl && startControl) {
      toggleControl.valueChanges.subscribe((isChecked: boolean) => {
        if (isChecked && !startControl.value) {
          startControl.setValue(this.nowIsoMinute());
        }
      });
    }

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      this.loadRatesbyCompany(company_id);
      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.getChargerLocations();
            this.getPartners();
            this.getCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.getChargerLocations();
            this.getPartners();
            this.getCompanies();
            break;
          case 'COMPANY_ADMIN':
            // 🆕 Set isCompanyAdmin qe fushat G/L (dhe gates te tjera admin-only) te aktivizohen.
            this.isCompanyAdmin = true;
            this.getChargerLocationsByCompany(company_id);
            this.getPartnersByCompany(company_id);
            this.getCompaniesByCompany(company_id);
            break;
          case 'COMPANY_ANALYST':
            // 🆕 Set isCompanyAnalyst qe fushat G/L te aktivizohen.
            this.isCompanyAnalyst = true;
            this.getChargerLocationsByCompany(company_id);
            this.getPartnersByCompany(company_id);
            this.getCompaniesByCompany(company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':this.getChargerLocationsByCompany();
            this.getChargerLocationsByCompany(company_id);
            this.getPartnersByCompany(company_id);
            this.getCompaniesByCompany(company_id);
            // this.getChargersByCompany(company_id);
            // this.getCurrencies(company_id);
            break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getTaxesByByUserGroup(usergroup_id);
          //   break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.getChargerLocationsByPartner(partner_id);
            this.getPartnersByPartner(partner_id);
            // this.getCompaniesByPartner(partner_id);
            // this.getChargersByPartner(partner_id);
            break;
          // case 'USER':
          case 'COMPANY_USER':
          // case 'SUPER_USER':
          // this.getTaxesByByUser(user_id);
          // // this.getCurrencies(company_id);
          // break;
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
    // this.getChargerLocations();
    //   this.getPartners();
    //   this.getCompanies();
    console.log('Charger Form:', this.chargerForm);
    console.log('Connectors FormArray:', this.connectors?.controls || []);
  }

  getChargerLocations() {
    this.chargerLocationService.getAllChargerLocations().subscribe(
      (data) => {
        console.log(data.location);
        this.chargerLocations = data.location;
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        console.log(data.company);
        this.companies = data.company;
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        console.log(data.partners);
        this.partners = data.partners;
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getChargerLocationsByCompany(companyId: number) {
    this.chargerLocationService.getChargerLocationByCompany(companyId).subscribe(
      (data) => {
        console.log(data.location);
        this.chargerLocations = data.location;
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getChargerLocationsByPartner(partnerId: number) {
    this.chargerLocationService.getChargerLocationByPartner(partnerId).subscribe(
      (data) => {
        console.log(data.location);
        this.chargerLocations = data.location;
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getCompaniesByCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data) => {
        console.log(data.company);
        this.companies = [data.company];
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  getPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        console.log(data.partner);
        this.partners = data.partner;
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getPartnersByPartner(partnerId: number) {
    this.partnerService.getPartner(partnerId).subscribe(
      (data) => {
        console.log(data.partner);
        this.partners = [data.partner];
        this.getCompaniesByCompany(data.partner.company_id);
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  get connectors(): FormArray {
    return this.chargerForm.get('connectors') as FormArray;
  }

  // onNoOfConnectorsChange(): void {
  //   const numberOfConnectors = this.chargerForm.get('noOfConnectors')?.value;
  //   this.setConnectors(numberOfConnectors);
  // }

  // setConnectors(noOfConnectors: number) {
  //   this.connectors.clear();
  //   for (let i = 0; i < noOfConnectors; i++) {
  //     this.connectors.push(this.createConnectorGroup());
  //   }
  // }
  // setConnectors(numberOfConnectors: number) {
  //   const connectorsArray = this.chargerForm.get('connectors') as FormArray;
  //   if (connectorsArray) {
  //     connectorsArray.clear();
  //     console.log('Initializing Connectors FormArray with', numberOfConnectors, 'connectors.');
  //     for (let i = 0; i < numberOfConnectors; i++) {
  //       connectorsArray.push(this.createConnectorGroup());
  //     }
  //     console.log('Connectors FormArray after initialization:', connectorsArray.controls);
  //   } else {
  //     console.error('Connectors FormArray is not defined.');
  //   }
  // }
  setConnectors(numberOfConnectors: number) {
    const connectorsArray = this.chargerForm.get('connectors') as FormArray;

    const currentConnectorsCount = connectorsArray.length;
    console.log('Current number of connectors:', currentConnectorsCount);

    // If the new number of connectors is greater than the current, add new connectors
    if (numberOfConnectors > currentConnectorsCount) {
      console.log('Adding more connectors:', numberOfConnectors - currentConnectorsCount);
      for (let i = currentConnectorsCount; i < numberOfConnectors; i++) {
        connectorsArray.push(this.createConnectorGroup());
      }
    } else {
      console.log('No connectors to add');
    }

    console.log('Connectors FormArray after updating:', connectorsArray.controls);
  }


  createConnectorGroup(): FormGroup {
    return this.fb.group({
      connectorNumber: ['', Validators.required],
      connectorImage: ['', Validators.required],
      connectorName: ['', Validators.required],
      ratedPower: ['', Validators.required],
      standard: ['', Validators.required],
      valid: [false],
      status: ['', Validators.required]
    });
  }

  loadRatesbyCompany(companyId: string) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        console.log("Fetched rates:", data.rate);
        this.rates = data.rate;
      },
      (error) => {
        console.log("Error fetching rates:", error);
      }
    );
  }

  // getChargerById(id: number): void {
  //   this.chargerService.getCharger(id).subscribe({
  //     next: (charger) => {
  //       console.log(charger)
  //       // Populate the form with charger data
  //       this.chargerForm.patchValue({
  //         chargerName: charger.charger_name,
  //         type: charger.type,
  //         noOfConnectors: charger.no_of_connectors,
  //         valid: charger.valid === 'true',
  //         status: charger.status,
  //         locationId: charger.location_id,
  //         ratedPower: charger.rated_power,
  //         companyId: charger.company_id,
  //         ocppProtocol: charger.ocpp_protocol,
  //         ocppId: charger.ocpp_id,
  //         currentType: charger.current_type,
  //         maxPower: charger.max_power,
  //         maxVoltage: charger.max_voltage,
  //         maxAmperage: charger.max_amperage,
  //         phase: charger.phase,
  //         phaseRotation: charger.phase_rotation,
  //         partnerId: charger.partner_id
  //       });

  //       // Populate connectors if they exist
  //       if (charger.connectors && charger.connectors.length > 0) {
  //         this.setConnectors(charger.connectors.length);
  //         charger.connectors.forEach((connector: any, index: number) => {
  //           this.connectors.at(index).patchValue({
  //             connectorNumber: connector.connector_number,
  //             connectorImage: connector.connector_image,
  //             connectorName: connector.connector_name,
  //             ratedPower: connector.rated_power,
  //             standard: connector.standard,
  //             valid: connector.valid === 'true',
  //             status: connector.status
  //           });
  //         });
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching charger details:', error);
  //     }
  //   });
  // }
  getChargerById(id: number): void {
    this.chargerService.getCharger(id).subscribe({
      next: (response) => {
        console.log('API response:', response); // Debugging line
        const charger = response.charger;

        // Ensure the response data matches the form structure
        this.chargerForm.patchValue({
          chargerName: charger.charger_name,
          type: charger.type,
          // noOfConnectors: charger.no_of_connectors,
          valid: charger.valid === "1",
          status: charger.status,
          locationId: charger.location_id,
          ratedPower: charger.rate_power,
          ocppProtocol: charger.ocpp_protocol,
          ocppId: charger.ocpp_id,
          currentType: charger.current_type,
          maxPower: charger.max_power,
          maxVoltage: charger.max_voltage,
          maxAmperage: charger.max_amperage,
          phase: charger.phase,
          phaseRotation: charger.phase_rotation,
          reservation_fee: charger.reservation_fee,
          reservation_wait: charger.reservation_wait,
          // 🆕 Patchoj rate-in e blerjes; fusha e vjeter tariff_energy nuk perdoret.
          energy_tariff_rate_id: charger.energy_tariff_rate_id != null ? charger.energy_tariff_rate_id : null,
          // 🆕 Eficenca ne %; patchValue e komentuar sepse FormControl-i eshte hequr nga UI.
          // efficiency_percentage: charger.efficiency_percentage != null ? Number(charger.efficiency_percentage) : 100,
          companyId: charger.company_id,
          partnerId: charger.partner_id,
          rate_id: charger.rate_id,
          fullchargefeeperminute: charger.fullchargefeeperminute,
          allowReservation: charger.allow_reservation === "1",
          is_public: charger.is_public === "1" || charger.is_public === "true" || charger.is_public === true,
          isHexReverse: charger.isHexReverse === "1" || charger.isHexReverse === "true" || charger.isHexReverse === true,
          charger_rate_priority: charger.charger_rate_priority === 'true' || charger.charger_rate_priority === true,
          // datetime-local input pret format "YYYY-MM-DDTHH:mm"
          charger_rate_priority_start: charger.charger_rate_priority_start
            ? this.toLocalDatetimeInput(charger.charger_rate_priority_start)
            : null,
          charger_rate_priority_until: charger.charger_rate_priority_until
            ? this.toLocalDatetimeInput(charger.charger_rate_priority_until)
            : null,
          // 🆕 G/L accounts (BC) — load nga backend; admin/analyst mund ta ndryshojne.
          g_l_purchase: charger.g_l_purchase || '',
          g_l_earnings: charger.g_l_earnings || '',
          uses_bursa_price: !!charger.uses_bursa_price,
        });

        // Fetch connectors
        this.connectorService.getConnectorByCharger(id).subscribe({
          next: (connectorResponse) => {
            console.log('Connector Response:', connectorResponse);
            console.log('Fetched Connectors:', connectorResponse.connector); // Debugging line

            const connector = connectorResponse.connector || [];
            this.setConnectors(connector.length);
            connector.forEach((connector: any, index: number) => {
              if (index < this.connectors.length) {
                this.connectors.at(index).patchValue({
                  connectorNumber: connector.connector_no,
                  connectorImage: connector.connector_image,
                  connectorName: connector.connector_name,
                  ratedPower: connector.rated_power,
                  standard: connector.standard,
                  valid: connector.valid === 'true',
                  status: connector.status
                });
              }
            });
          },
          error: (error) => {
            console.error('Error fetching connectors:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching charger details:', error);
      }
    });
  }



  onSubmit() {
    if (this.chargerForm.invalid) {
      // If the form is invalid, mark all fields as touched to show error messages
      this.chargerForm.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      setTimeout(() => this.errorMessage = '', 5000); // Hide error message after 5 seconds
      return;
    }

    // 🆕 Ri-fresko Start me nowIsoMinute() kur toggle=ON dhe Start eshte teknikisht
    // ne te kaluaren nga disa sekonda (auto-populate stale). Kjo eliminon race
    // conditionin kur user-i klikon Save disa sekonda pas checkimit te toggle-it.
    if (this.chargerForm.get('charger_rate_priority')?.value) {
      const startCtrl = this.chargerForm.get('charger_rate_priority_start');
      const currentStart = startCtrl?.value;
      const nowIso = this.nowIsoMinute();
      if (!currentStart || new Date(currentStart).getTime() < Date.now() - 60000) {
        startCtrl?.setValue(nowIso);
      }
    }

    // Scheduler validim (Start + End rregullat)
    const priorityError = this.ratePriorityScheduleError();
    if (priorityError) {
      this.errorMessage = priorityError;
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    // Convert partnerId to null if it's empty or undefined (e.g., "Select Partner" is chosen)
    const chargerData = { ...this.chargerForm.value };
    chargerData.partnerId = (chargerData.partnerId === "" || chargerData.partnerId === null || isNaN(Number(chargerData.partnerId)) || chargerData.partnerId === 0)
      ? null : Number(chargerData.partnerId);
    chargerData.rate_id = (chargerData.rate_id === "" || chargerData.rate_id === null || isNaN(Number(chargerData.rate_id)) || chargerData.rate_id === 0)
      ? null : Number(chargerData.rate_id);

    // Toggle Switch shkon ne nje endpoint te dedikuar (audit + validim i dedikuar).
    // Backend pret ISO datetime; e ndertojme nga datetime-local (te trajtuar si Europe/Tirane).
    const toIsoOrNull = (v: any): string | null => {
      if (!v) return null;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    };
    const togglePayload = {
      enabled: !!chargerData.charger_rate_priority,
      start: toIsoOrNull(chargerData.charger_rate_priority_start),
      until: toIsoOrNull(chargerData.charger_rate_priority_until),
    };
    delete chargerData.charger_rate_priority;
    delete chargerData.charger_rate_priority_start;
    delete chargerData.charger_rate_priority_until;

    // 🆕 G/L accounts — dergohen VETEM nese user-i ka rolin (admin/analyst).
    // Kur s'jane te lejuar, i heqim nga payload-i qe backend-i te mos i prek fushat.
    if (!(this.isCompanyAdmin || this.isCompanyAnalyst)) {
      delete chargerData.g_l_purchase;
      delete chargerData.g_l_earnings;
    }

    console.log('Submitting chargerData:', chargerData);

    this.chargerService.updateCharger(this.chargerId, chargerData).subscribe({
      next: (response: any) => {
        if (!response?.success) {
          console.error('Failed to update charger:', response?.message);
          this.errorMessage = response?.message || 'Failed to update charger. Please try again.';
          setTimeout(() => this.errorMessage = '', 5000);
          return;
        }

        // Apliko Toggle Switch ne nje step te dyte — pavarur nga update-i klasik.
        this.chargerService.updateRatePriority(this.chargerId, togglePayload).subscribe({
          next: (priorityResp: any) => {
            if (priorityResp?.success === false) {
              // Charger u perditesua, por toggle deshtoi (p.sh. charger pa rate_id).
              this.errorMessage = priorityResp.message || 'Toggle Switch s\'u perditesua.';
              setTimeout(() => this.errorMessage = '', 5000);
              return;
            }
            this.successMessage = response.message || 'Charger u perditesua.';
            setTimeout(() => {
              this.successMessage = '';
              this.router.navigate([`/assets/chargers/`]);
            }, 3000);
          },
          error: (err) => {
            console.error('Toggle Switch error:', err);
            this.errorMessage = 'Charger u perditesua, por Toggle Switch s\'u ruajt.';
            setTimeout(() => this.errorMessage = '', 5000);
          }
        });
      },
      error: (error) => {
        console.error('Error updating charger:', error);
        this.errorMessage = 'An error occurred while updating the charger. Please try again.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

}
