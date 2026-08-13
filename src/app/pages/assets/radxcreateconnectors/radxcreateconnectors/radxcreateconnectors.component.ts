import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectorService } from 'src/app/services/connectorService/connector.service';
import { ChargerService } from 'src/app/services/chargerService/charger.service';

@Component({
  selector: 'app-radxcreateconnectors',
  templateUrl: './radxcreateconnectors.component.html'
})
export class RadxcreateconnectorsComponent implements OnInit {
  connectorForm: FormGroup;
  connectorId: string | null = null;
  chargerId: string | null = null;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
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
    private connectorService: ConnectorService,
    private chargerService: ChargerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.connectorForm = this.fb.group({
      connectorNumber: ['', Validators.required],
      connectorImage: [''],
      connectorName: ['', Validators.required],
      ratedPower: ['', Validators.required],
      standard: ['', Validators.required],
      valid: [false],
      status: ['', Validators.required],
      chargerId: ['']
    });
  }

  ngOnInit() {
    // Retrieve connectorId and chargerId from the route
    this.route.paramMap.subscribe(params => {
      this.chargerId = params.get('id');
      console.log('chargerId:', this.chargerId);
      if (!this.chargerId) {
        console.error('chargerId not found in the route');
      } else {
        console.log('chargerId:', this.chargerId);
        this.connectorForm.patchValue({ chargerId: this.chargerId });
      }
    });

  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getStandardOptions() {
    return Object.keys(this.imageMap);  // Get the keys from imageMap
  }

  selectOption(option: string) {
    this.selectedStandard = option; // Update the selected standard for display
  
    // Get the image path from the imageMap using the selected option
    const imagePath = this.imageMap[option];
  
    // Update the form control values for both `standard` and `connectorImage`
    this.connectorForm.patchValue({
      standard: option, // Save the connector type
      connectorImage: imagePath // Save the actual image path
    });
  
    this.toggleDropdown(); // Close the dropdown
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name); // Log the selected file name
      this.selectedFileName = file.name; // Store the file name
      // Optionally, you could directly set the file here if sending the file
      this.connectorForm.patchValue({
        connectorImage: file // For example, if you want to upload the actual file
      });
    }
  }

  onSubmit() {
    console.log('Form submission triggered');
    if (this.connectorForm.invalid) {
      console.log('Form is invalid');
      this.connectorForm.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields.';
      setTimeout(() => this.errorMessage = '', 5000); // Hide error message after 5 seconds
      return;
    }
    // Prepare the data to send, including the actual image path
    const connectorData = {
      connectorNumber: this.connectorForm.get('connectorNumber')?.value,
      connectorName: this.connectorForm.get('connectorName')?.value,
      ratedPower: this.connectorForm.get('ratedPower')?.value,
      standard: this.connectorForm.get('standard')?.value,
      valid: this.connectorForm.get('valid')?.value,
      status: this.connectorForm.get('status')?.value,
      chargerId: this.connectorForm.get('chargerId')?.value,
      connectorImage: this.connectorForm.get('connectorImage')?.value // Send the actual image path
    };
  
    console.log('Connector Data:', connectorData);
  
    // Send JSON data
    this.connectorService.addConnector(connectorData).subscribe({
      next: (response) => {
        console.log('Connector created successfully', response);
        // Redirect after successful creation
        this.router.navigate(['/assets/chargers', this.chargerId]);
      },
      error: (error) => {
        console.error('Error creating connector', error);
        this.errorMessage = error.message || 'An error occurred while creating the connector.';
        setTimeout(() => this.errorMessage = '', 5000); // Hide error message after 5 seconds
      }
    });
  }
}
