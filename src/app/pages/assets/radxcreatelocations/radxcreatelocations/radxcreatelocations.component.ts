import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { CompanyService } from 'src/app/services/companyService/company.service';

@Component({
  selector: 'app-radxcreatelocations',
  templateUrl: './radxcreatelocations.component.html',
  styles: [
  ]
})
export class RadxcreatelocationsComponent {
  location: any = {
    locationName: '',
    address: '',
    city: '',
    country: '',
    companyId: null,
    latitude: null,
    longitude: null 
  };
  companies = [];

  constructor(private locationService: ChargerLocationService, private companyService: CompanyService, private router: Router) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      response => this.companies = response.company,
      error => console.error('Error fetching companies', error)
    );
  }

  onSubmit() {
    this.locationService.createChargerLocation(this.location).subscribe({
      next: (response) => {
        console.log('Location created successfully:', response);
        // Navigate or show success message
        this.router.navigate(['/locations']);
      },
      error: (error) => {
        console.error('Error creating location:', error);
      }
    });
  }

}
