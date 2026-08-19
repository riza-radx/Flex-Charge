import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerLocationService } from 'src/app/services/chargerLocationService/charger-location.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';

@Component({
  selector: 'app-companyupdatelocations',
  templateUrl: './companyupdatelocations.component.html',
  styles: [
  ]
})
export class CompanyupdatelocationsComponent implements OnInit {
  locationForm: FormGroup;
  locationId: number;
  successMessage: string = '';
  errorMessage: string = '';
  partners: any;
  company_id: any;
  // 🆕 Role gating per fushen Vendor Number OSHEE — vetem COMPANY_ADMIN + COMPANY_ANALYST.
  userRole: string | null = null;
  isCompanyAdmin: boolean = false;
  isCompanyAnalyst: boolean = false;
  constructor(
    private fb: FormBuilder,
    private locationService: ChargerLocationService,
    private router: Router,
    private partnerService: PartnerService,
    private route: ActivatedRoute
  ) {
    this.locationForm = this.fb.group({
      locationName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      partnerId: [null],
      // 🆕 Vendor Number OSHEE — vetem COMPANY_ADMIN/COMPANY_ANALYST i redaktojne (kontrolli behet ne template).
      vendor_number_oshee: [''],
    });
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['id'];
    const cugpCred = localStorage.getItem('cugpCred');
    const parsedCugpCred = JSON.parse(cugpCred);
    this.company_id = parsedCugpCred.company_id;
    // 🆕 Kap rolin per gate-in e fushes Vendor Number OSHEE.
    this.userRole = localStorage.getItem('userRole');
    if (this.userRole === 'COMPANY_ADMIN') this.isCompanyAdmin = true;
    if (this.userRole === 'COMPANY_ANALYST') this.isCompanyAnalyst = true;
    this.getLocationById(this.locationId);
    this.getPartnersByCompany(this.company_id);
    logger.log('this.locationId:', this.locationId);
    // throw new Error('Method not implemented.');
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
  onSubmit() {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields correctly before submitting.';
      setTimeout(() => (this.errorMessage = ''), 5000);
      return;
    }
  
    const locationData = { ...this.locationForm.value };
    // 🆕 Vendor Number OSHEE — dergohet VETEM nese user-i ka rolin (admin/analyst).
    // Kur s'jane te lejuar, e heqim nga payload-i qe backend-i te mos e prek fushen.
    if (!(this.isCompanyAdmin || this.isCompanyAnalyst)) {
      delete locationData.vendor_number_oshee;
    }
    logger.log('Submitting locationData:', locationData);

    this.locationService.updateChargerLocation(this.locationId, locationData).subscribe({
      next: (response: any) => {
        if (response?.success) {
          logger.log('Location updated successfully:', response);
          
          this.successMessage = 'Location updated successfully!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate([`/assets/locations/${this.locationId}`]);
          }, 3000);
        } else {
          logger.error('Failed to update charger:', response);
          this.errorMessage = response?.message || 'Failed to update location.';
          setTimeout(() => (this.errorMessage = ''), 5000);
        }
      },
      error: (error) => {
        logger.error('Error updating charger:', error);
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

  getLocationById(id: number): void {
    this.locationService.getChargerLocation(id).subscribe({
      next: (response) => {
        logger.log('ID:', id);
        logger.log('API response:', response);
        const location = response.location;

        // Ensure the response data matches the form structure
        this.locationForm.patchValue({
          locationName: location.location_name,
          address: location.addres,
          city: location.city,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
          partnerId: location.partner_id,
          // 🆕 Vendor Number OSHEE — load nga backend (admin/analyst do ta shohin).
          vendor_number_oshee: location.vendor_number_oshee || '',
        });

      },
      error: (error) => {
        logger.error('Error fetching charger details:', error);
      }
    });
  }


}
