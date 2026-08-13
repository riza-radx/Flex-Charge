import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerService } from 'src/app/services/chargerService/charger.service';
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { CompanyService } from "../../../../services/companyService/company.service";
@Component({
  selector: 'app-companycreatechargers',
  templateUrl: './companycreatechargers.component.html',
  styles: [
  ]
})
export class CompanycreatechargersComponent {

  chargerForm: FormGroup;
  errorMessage: any;
  chargerLocations: any;
  partners: any;
  companies: any

  constructor(
    private fb: FormBuilder,
    private chargerService: ChargerService,
    private connectorService: ConnectorService,
    private chargerLocationService: ChargerLocationService,
    private partnerService: PartnerService,
    private companyService: CompanyService,
    private router: Router
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
      ocppId: ['', Validators.required],
      currentType: ['', Validators.required],
      maxPower: ['', Validators.required],
      maxVoltage: ['', Validators.required],
      maxAmperage: ['', Validators.required],
      phase: ['', Validators.required],
      phaseRotation: ['', Validators.required],
      allowReservation: [false],
      partnerId: ['', Validators.required],
      connectors: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.chargerForm = this.fb.group({
      chargerName: ['', [Validators.required, Validators.maxLength(20)]],
      type: ['', Validators.required],
      noOfConnectors: [1, Validators.required],
      valid: [false],
      status: ['', Validators.required],
      locationId: [null, Validators.required],
      ratedPower: [null, Validators.required],
      companyId: [null, Validators.required],
      ocppProtocol: ['', Validators.required],
      ocppId: ['', Validators.required],
      currentType: ['', Validators.required],
      maxPower: [null, Validators.required],
      maxVoltage: [null, Validators.required],
      maxAmperage: [null, Validators.required],
      phase: ['', Validators.required],
      phaseRotation: ['', Validators.required],
      allowReservation: [false],
      partnerId: [null, Validators.required],
      connectors: this.fb.array([]) // Initialize the form array
    });

    // Initialize connectors based on the initial number of connectors
    this.onNoOfConnectorsChange();

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      console.log('User Group ID:', company_id);
      this.getChargerLocations(company_id);
    this.getPartners(company_id);
    this.getCompanies(company_id);
    } else {
      console.error('No cugpCred found in localStorage');
    }
  }

  getChargerLocations(companyID: number) {
    this.chargerLocationService.getChargerLocation(companyID).subscribe(
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
  getCompanies(companyID: number) {
    this.companyService.getCompany(companyID).subscribe(
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
  getPartners(companyID: number) {
    this.partnerService.getPartner(companyID).subscribe(
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
    for (let i = 0; i < numberOfConnectors; i++) {
      connectors.push(this.fb.group({
        connectorNumber: ['', Validators.required],
        connectorImage: ['', Validators.required],
        connectorName: ['', Validators.required],
        ratedPower: ['', Validators.required],
        standard: ['', Validators.required],
        valid: [false],
        status: ['', Validators.required]
      }));
    }
  }

  setConnectors(noOfConnectors: number) {
    this.connectors.clear();
    for (let i = 0; i < noOfConnectors; i++) {
      this.connectors.push(this.createConnectorGroup());
    }
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

  onSubmit() {
    const chargerData = this.chargerForm.value;

    // this.chargerService.addCharger(chargerData).subscribe({
    //   next: (chargerResponse) => {
    //     console.log('Charger created successfully:', chargerResponse);
    //     this.addConnectors(chargerResponse.id);
    //   },
    //   error: (error) => {
    //     console.error('Error creating charger:', error);
    //   }
    // });
    this.chargerService.addCharger(this.chargerForm.value).subscribe((response: any) => {
      const responseObject = response as { id: number };
      this.addConnectors(responseObject.id);
    });
  }

  addConnectors(chargerId: number) {
    const connectorsData = this.chargerForm.value.connectors.map((connector: any) => ({
      ...connector,
      chargerId
    }));

    connectorsData.forEach((connectorData: any) => {
      this.connectorService.addConnector(connectorData).subscribe({
        next: (response) => {
          console.log('Connector created successfully:', response);
          // Navigate or show success message if needed
        },
        error: (error) => {
          console.error('Error creating connector:', error);
        }
      });
    });

    this.router.navigate(['/chargers']);
  }

}
