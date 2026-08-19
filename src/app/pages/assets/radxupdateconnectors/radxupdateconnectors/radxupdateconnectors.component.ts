import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectorService } from 'src/app/services/connectorService/connector.service';

@Component({
  selector: 'app-radxupdateconnectors',
  templateUrl: './radxupdateconnectors.component.html'
})
export class RadxupdateconnectorsComponent {
  connectorForm: FormGroup;
  connectorId: number;
  selectedFileName: string | null = null;
  originalConnectorImage: string | null = null;
  selectedStandard: string;
  dropdownOpen: boolean = false;  
  errorMessage: string = ''; 
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
  constructor(
    private fb: FormBuilder,
    private connectorService: ConnectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.connectorForm = this.fb.group({
      connectorNumber: ['', Validators.required],
      connectorImage: [''],
      connectorName: ['', Validators.required],
      ratedPower: ['', Validators.required],
      standard: ['', Validators.required],
      valid: [''],
      status: ['', Validators.required],
      charger_id: ['']
    });
  }

  ngOnInit(): void {
    this.connectorId = this.route.snapshot.params['id'];
    this.getConnectorById(this.connectorId);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getStandardOptions() {
    return Object.keys(this.imageMap);  // Get the keys from imageMap
  }

  selectOption(option: string) {
    this.selectedStandard = option; // Update the selected standard for display
    const imagePath = this.imageMap[option]; // Get the image path from the imageMap
  
    // Update the form control values for both `standard` and `connectorImage`
    this.connectorForm.patchValue({
      standard: option, // Save the connector type
      connectorImage: imagePath // Save the actual image path
    });
  
    // Display the updated image in the template
    this.selectedFileName = imagePath; // Update the UI image display
  
    this.toggleDropdown(); // Close the dropdown
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  onSubmit() {
    if (this.connectorForm.invalid) {
      // Mark all fields as touched to show validation messages
      this.connectorForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => this.errorMessage = '', 5000); // Clear error message after 5 seconds
      return;
    }
  
    const connectorData = {
      ...this.connectorForm.value,
      valid: this.connectorForm.value.valid,
      connectorImage: this.connectorForm.get('connectorImage')?.value
    };
  
    // Handle file logic
    if (!this.selectedFileName) {
      connectorData.connectorImage = this.connectorForm.get('connectorImage')?.value;
    } else {
      connectorData.connectorImage = this.selectedFileName;
    }
  
    // Call the service to update the connector
    this.connectorService.updateConnector(this.connectorId, connectorData).subscribe({
      next: (response) => {
        logger.log('Connector updated successfully:', response);
        this.router.navigate(['/assets/chargers', connectorData.charger_id]); // Redirect after update
      },
      error: (error) => {
        logger.error('Error updating connector:', error);
        this.errorMessage = error.message || 'An error occurred while updating the connector.';
        setTimeout(() => this.errorMessage = '', 5000); // Clear error message after 5 seconds
      }
    });
  }


  getConnectorById(id: number): void {
    this.connectorService.getConnector(id).subscribe({
      next: (response) => {
        const connector = response.connector;
        this.connectorForm.patchValue({
          connectorNumber: connector.connector_no,
          connectorImage: connector.connector_image,
          connectorName: connector.connector_name,
          ratedPower: connector.rated_power,
          standard: connector.standard,
          valid: connector.valid === '1' || connector.valid === true,
          status: connector.status,
          charger_id: connector.charger_id
        });
        this.originalConnectorImage = connector.connector_image;
        this.selectedFileName = this.originalConnectorImage;

        // Set the selected standard and the corresponding image on initialization
        this.selectedStandard = connector.standard;
      },
      error: (error) => {
        logger.error('Error fetching connector details:', error);
      }
    });
  }
}
