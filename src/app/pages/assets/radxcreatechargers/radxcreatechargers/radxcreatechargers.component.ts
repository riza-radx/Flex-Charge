import { logger } from '@core/logger';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { CompanyService } from "../../../../services/companyService/company.service";
import { RateService } from 'src/app/services/rateService/rate.service';

@Component({
  selector: 'app-radxcreatechargers',
  templateUrl: './radxcreatechargers.component.html',
  styles: [
  ]
})
export class RadxcreatechargersComponent {
  @ViewChild('locationForm') locationForm!: NgForm;
  chargerForm: FormGroup;
  connectorForm: FormGroup;

  errorMessage: any;
  chargerLocations: any;
  partners: any;
  companies: any
  selectedConnectorFileNames: string[] = [];
  showPopup: boolean = false;
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
  company_id: number | null = null;  // Store company_id properly
  partner_id: number | null = null;
  isDropdownOpen: boolean = false;
  company: any;
  selectedStandard: string;
  dropdownOpen: boolean[] = [];
  successMessage: string = '';
  imageMap: { [key: string]: string } = {
    'J1772': 'assets/connectors/J1772.png',
    'Type2': 'assets/connectors/Type2.png',
    'Type3': 'assets/connectors/general.png',
    'CHAdeMO': 'assets/connectors/CHAdeMO.png',
    'CCS1': 'assets/connectors/CCS1.png',
    'CCS2': 'assets/connectors/CCS1.png',
    'GB/TDC': 'assets/connectors/GB TDC.png',
    'GB/TAC': 'assets/connectors/GB TAC.png',
    'Schuko': 'assets/connectors/general.png',
    'NACS': 'assets/connectors/general.png',
    'InductivePaddle': 'assets/connectors/general.png',
    'NEMA5-20': 'assets/connectors/general.png',
    'TypeEFrenchStandard': 'assets/connectors/general.png',
    'TypeJSwissStandard': 'assets/connectors/general.png',
    'AVCON': 'assets/connectors/general.png'
  };
  rates = [];
  constructor(
    private fb: FormBuilder,
    private chargerService: ChargerService,
    private connectorService: ConnectorService,
    private chargerLocationService: ChargerLocationService,
    private rateService: RateService,
    private partnerService: PartnerService,
    private companyService: CompanyService,
    private router: Router,
    private locationService: ChargerLocationService,
  ) {
    this.chargerForm = this.fb.group({
      chargerName: ['', [Validators.required, Validators.maxLength(20)]],
      type: ['', Validators.required],
      noOfConnectors: ['', [Validators.required, Validators.min(1)]],
      valid: [false],
      status: ['', Validators.required],
      locationId: ['', Validators.required],
      ratedPower: ['', Validators.required],
      companyId: ['', Validators.required],
      ocppProtocol: ['', Validators.required],
      ocppId: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      currentType: ['', Validators.required],
      maxPower: ['', Validators.required],
      maxVoltage: ['', Validators.required],
      maxAmperage: ['', Validators.required],
      phase: ['', Validators.required],
      phaseRotation: ['', Validators.required],
      reservation_fee: [0, [Validators.required, Validators.min(0)]],
      reservation_wait: [0, [Validators.required, Validators.min(0)]],
      // 🆕 Rate i blerjes se energjise — dropdown me rate-t e kompanise.
      // Fusha e vjeter numerike tariff_energy nuk perdoret me nga UI, u zevendesua
      // me kete lidhje me rate qe mban fasha orare (rate_per_days).
      energy_tariff_rate_id: [null, Validators.required],
      // 🆕 Eficenca ne %: FormControl e komentuar sepse fusha eshte fshehur nga UI.
      // Backend ka DEFAULT 100 ne DB — payload-i s'e dergon me kete field.
      // efficiency_percentage: [100, [Validators.required, Validators.min(0), Validators.max(100)]],
      allowReservation: [false],
      partnerId: [null],
      rate_id: [null],
      fullchargefeeperminute: [0, [Validators.required, Validators.min(0)]],
      connectors: this.fb.array([]),
      is_public: [false],
      isHexReverse: [false],
      // 🆕 G/L accounts per BC — vetem COMPANY_ADMIN/COMPANY_ANALYST i redaktojne.
      g_l_purchase: [''],
      g_l_earnings: [''],
    });

  }
  location: any = {
    id: null,
    locationName: '',
    address: '',
    city: '',
    country: '',
    companyId: null,
    partnerId: null,
    latitude: null,
    longitude: null
  };

  ngOnInit(): void {


    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

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

            this.selectedConnectorFileNames = Array(this.chargerForm.get('noOfConnectors')?.value).fill(null);

            break;
          case 'COMPANY_ADMIN':
            // 🆕 Set isCompanyAdmin qe fushat G/L te aktivizohen ne template.
            this.isCompanyAdmin = true;
            this.getChargerLocationsByCompany(this.company_id);
            this.getPartnersByCompany(this.company_id);
            this.getCompaniesByCompany(this.company_id);
            this.loadRatesbyCompany(this.company_id);
            break;
          case 'COMPANY_ANALYST':
            // 🆕 Set isCompanyAnalyst qe fushat G/L te aktivizohen ne template.
            this.isCompanyAnalyst = true;
            this.getChargerLocationsByCompany(this.company_id);
            this.getPartnersByCompany(this.company_id);
            this.getCompaniesByCompany(this.company_id);
            this.loadRatesbyCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          // case 'USER':
          case 'COMPANY_USER':
            // case 'SUPER_USER':this.getChargerLocationsByCompany();
            this.getChargerLocationsByCompany(this.company_id);
            this.getPartnersByCompany(this.company_id);
            this.getCompaniesByCompany(this.company_id);
            this.loadRatesbyCompany(this.company_id);
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
            this.getChargerLocationsByPartner(this.partner_id);
            this.getPartnersByPartner(this.partner_id);
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
    this.chargerForm = this.fb.group({
      chargerName: ['', [Validators.required, Validators.maxLength(20)]],
      type: ['', Validators.required],
      noOfConnectors: [1, Validators.required],
      valid: [false],
      status: ['', Validators.required],
      locationId: [null, Validators.required],
      ratedPower: [null, Validators.required],
      companyId: [this.company?.company_id || '', Validators.required],
      ocppProtocol: ['', Validators.required],
      ocppId: ['', Validators.required],
      currentType: ['', Validators.required],
      maxPower: [null, Validators.required],
      maxVoltage: [null, Validators.required],
      maxAmperage: [null, Validators.required],
      phase: ['', Validators.required],
      phaseRotation: ['', Validators.required],
      reservation_fee: [0, [Validators.required, Validators.min(0)]],
      reservation_wait: [0, [Validators.required, Validators.min(0)]],
      // 🆕 Rate i blerjes se energjise — dropdown me rate-t e kompanise.
      // Fusha e vjeter numerike tariff_energy nuk perdoret me nga UI, u zevendesua
      // me kete lidhje me rate qe mban fasha orare (rate_per_days).
      energy_tariff_rate_id: [null, Validators.required],
      // 🆕 Eficenca ne %: FormControl e komentuar sepse fusha eshte fshehur nga UI.
      // Backend ka DEFAULT 100 ne DB — payload-i s'e dergon me kete field.
      // efficiency_percentage: [100, [Validators.required, Validators.min(0), Validators.max(100)]],
      allowReservation: [false],
      partnerId: [null],
      rate_id: [null],
      fullchargefeeperminute: [0, [Validators.required, Validators.min(0)]],
      connectors: this.fb.array([]), // Initialize the form array
      is_public: [false],
      isHexReverse: [false],
      // 🆕 G/L accounts per BC — vetem COMPANY_ADMIN/COMPANY_ANALYST i redaktojne.
      g_l_purchase: [''],
      g_l_earnings: ['']
    });
    // Initialize connectors based on the initial number of connectors
    this.onNoOfConnectorsChange();
    // this.getChargerLocations();
    // this.getPartners();
    // this.getCompanies();

  }
  toggleDropdown(index: number) {
    this.dropdownOpen[index] = !this.dropdownOpen[index];
  }

  getStandardOptions() {
    return Object.keys(this.imageMap);  // Get the keys from imageMap
  }

  selectOption(option: string, index: number) {
    // Get the image path from the imageMap using the selected option
    const imagePath = this.imageMap[option];

    // Update the specific connector's form control values
    this.connectors.controls[index].patchValue({
      standard: option, // Save the connector type
      connectorImage: imagePath // Save the actual image path
    });

    // Close the dropdown for this specific connector
    this.dropdownOpen[index] = false;
  }

  loadRatesbyCompany(companyId: number) {
    this.rateService.getRateByCompany(companyId).subscribe(
      (data) => {
        logger.log("Fetched rates:", data.rate);
        this.rates = data.rate;
      },
      (error) => {
        logger.log("Error fetching rates:", error);
      }
    );
  }
  getChargerLocations() {
    this.chargerLocationService.getAllChargerLocations().subscribe(
      (data) => {
        logger.log("data.location", data.location);
        this.chargerLocations = data.location;
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getChargerLocationsByCompany(companyId: number) {
    this.chargerLocationService.getChargerLocationByCompany(companyId).subscribe(
      (data) => {
        logger.log(data.location);
        this.chargerLocations = data.location;
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getChargerLocationsByPartner(partnerId: number) {
    this.chargerLocationService.getChargerLocationByPartner(partnerId).subscribe(
      (data) => {
        logger.log(data.location);
        this.chargerLocations = data.location;
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        logger.log(data.company);
        this.company = data.company;
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getCompaniesByCompany(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(
      (data) => {
        this.company = data.company;
        logger.log("data.company getCompaniesByCompany", this.company);

        // Set the companyId form field value
        this.chargerForm.patchValue({
          companyId: this.company?.company_id  // Ensure this maps to the correct field
        });
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }
  getPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        logger.log(data.partners);
        this.partners = data.partners;
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        logger.log(data.partner);
        this.partners = data.partner;
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getPartnersByPartner(partnerId: number) {
    this.partnerService.getPartner(partnerId).subscribe(
      (data) => {
        logger.log(data.partner);
        this.partners = [data.partner];
        this.getCompaniesByCompany(data.partner.company_id);
      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }

  get connectors(): FormArray {
    return this.chargerForm.get('connectors') as FormArray;
  }

  onNoOfConnectorsChange(): void {
    const numberOfConnectors = this.chargerForm.get('noOfConnectors')?.value;
    const connectors = this.connectors;

    // Clear existing connectors
    while (connectors.length) {
      connectors.removeAt(0);
    }

    // Add new connector groups
    // Add new connector groups and reset selected file names
    for (let i = 0; i < numberOfConnectors; i++) {
      connectors.push(this.createConnectorGroup());
    }

    // Reset selected file names
    this.selectedConnectorFileNames = Array(numberOfConnectors).fill(null);

  }

  onConnectorImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      logger.log('File selected:', file.name);
      this.selectedConnectorFileNames[index] = file.name; // Store the selected file name
      this.connectors.at(index).patchValue({ connectorImage: file }); // Patch the form control
    }
  }

  setConnectors(noOfConnectors: number) {
    this.connectors.clear();
    for (let i = 0; i < noOfConnectors; i++) {
      this.connectors.push(this.createConnectorGroup());
    }
  }

  createConnectorGroup(): FormGroup {
    this.connectorForm = this.fb.group({
      connectorNumber: ['', Validators.required],
      connectorImage: [''],
      connectorName: ['', Validators.required],
      ratedPower: ['', Validators.required],
      standard: ['', Validators.required],
      valid: [false],
      status: ['', Validators.required],
    });
    return this.connectorForm;
  }


  onSubmit() {
    logger.log("Charger form is valid:", this.chargerForm.valid);

    if (this.chargerForm.invalid) {
      this.chargerForm.markAllAsTouched();
      const connectorsArray = this.chargerForm.get('connectors') as FormArray;
      connectorsArray.controls.forEach(connector => {
        connector.markAllAsTouched();
      });
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      setTimeout(() => this.errorMessage = '', 5000); // Hide error message after 5 seconds
      return;
    }

    this.chargerForm.patchValue({
      is_public: this.chargerForm.value.is_public ? 'true' : 'false',
      isHexReverse: this.chargerForm.value.isHexReverse ? 'true' : 'false'
    });
    logger.log("Charger form values:", this.chargerForm.value);
    this.chargerService.addCharger(this.chargerForm.value).subscribe(
      (response: any) => {
        logger.log("Response from addCharger:", response);
        const chargerId = response?.rate?.charger_id;
        if (chargerId) {
          this.addConnectors(chargerId);
        } else {
          logger.error('charger_id not found in the response');
        }
      },
      (error) => {
        logger.error("Error adding charger:", error);
      }
    );
  }


  addConnectors(chargerId: number) {
    const connectorsData = this.chargerForm.value.connectors.map((connector: any, index: number) => ({
      ...connector,
      chargerId,
      connectorImage: this.connectorForm.get('connectorImage')?.value // Use the selected file name
    }));

    connectorsData.forEach((connectorData: any) => {
      this.connectorService.addConnector(connectorData).subscribe({
        next: (response) => {
          logger.log('Connector created successfully:', response);
          // Navigate or show success message if needed
        },
        error: (error) => {
          logger.error('Error creating connector:', error);
        }
      });
    });

    this.router.navigate(['/assets/chargers']);
  }
  openPopup(): void {
    this.showPopup = true;
    logger.log(this.showPopup);
  }

  // To close the popup
  closePopup(): void {
    this.showPopup = false;
  }

  onSubmitLocation() {
    this.location.companyId = this.company.company_id;

    this.markFormGroupTouched(this.locationForm);

    if (this.locationForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }

    this.locationService.createChargerLocation(this.location).subscribe({
      next: (response: any) => {
        logger.log('Location created successfully:', response);

        if (!response.success) {
          this.errorMessage = response.message || 'Failed to create location.';
          setTimeout(() => (this.errorMessage = ''), 5000);
          return;
        }

        if (response.location?.location_id) {
          this.location.id = response.location.location_id;
          this.chargerForm.get('locationId')?.setValue(this.location.id);
        } else {
          logger.warn('Location ID is missing from the response.');
        }

        // Fetch updated location list based on user role
        switch (this.userRole) {
          case 'RadX_Admin':
          case 'RADX_MODERATOR':
            this.getChargerLocations();
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
            this.getChargerLocationsByCompany(this.company_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.getChargerLocationsByPartner(this.partner_id);
            break;
          default:
            logger.log('Role does not require location fetch');
            break;
        }

        this.successMessage = 'Location created successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.closePopup();
        }, 3000);
      },
      error: (error) => {
        logger.error('Error creating location:', error);
        this.handleError(error);
      }
    });
  }

  handleError(error: any) {
    if (error.status === 400) {
      this.errorMessage = 'Invalid data. Please check your inputs and try again.';
    } else if (error.status === 409) {
      this.errorMessage = 'A user with this email already exists.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to perform this action.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again later.';
    }

    setTimeout(() => {
      this.errorMessage = '';
    }, 5000); // Clears message after 5 seconds
  }

  private markFormGroupTouched(formGroup: NgForm) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  onLocationSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'create') {
      this.openPopup(); // Open the popup to create a new location
    } else {
      // Handle selecting an existing location (if needed)
      const selectedLocationId = selectedValue;
      logger.log('Selected Location ID:', selectedLocationId);
      // You can add additional logic here for using the selected location ID
    }
  }

}
