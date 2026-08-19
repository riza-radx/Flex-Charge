import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-companyupdatecompany',
  templateUrl: './companyupdatecompany.component.html',
  styles: [
  ]
})
export class CompanyupdatecompanyComponent implements OnInit {
  companyForm: FormGroup;
  companyId: number;
  selectedFileName: string | null = null;
  originalCompanyLogo: string | null = null;


  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.companyForm = this.fb.group({
      companyLogo: [''],
      company_name: ['', Validators.required],
      company_description: ['', Validators.required],
      company_email: ['', [Validators.required, Validators.email]],
      company_phone_no: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      company_address: ['', Validators.required],
      company_city: ['', Validators.required],
      company_country: ['', Validators.required],
      is_whitelabel: [false, Validators.required],
      // whitelabel_expiration_date: ['', Validators.required]

      //company_phone_no: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params['id'];
    this.getCompanyById(this.companyId);

    logger.log('this.locationId:', this.companyId);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file;  // Update the selected file name
      this.companyForm.patchValue({
        companyLogo: file // Set the file name in the form control
      });
    }
  }


  // onSubmit() {
  //   const companyData = this.companyForm.value;
  //   console.log('Form ', this.companyForm.value);
  //   // If no new file is selected, retain the original company logo
  //   if (this.companyForm.invalid) {
  //     console.log('Form is invalid');
  //     return;
  //   }
  //   if (!this.selectedFileName) {
  //     companyData.companyLogo = this.originalCompanyLogo;  // Retain the original logo
  //   } else {
  //     companyData.companyLogo = this.selectedFileName;  // Use the new file name
  //   }
  //   console.log('Submitting locationData:', companyData);

  //   this.companyService.updateCompany(this.companyId, companyData).subscribe({
  //     next: (response) => {
  //       if (response) {
  //         console.log('Location updated successfully:', response);
  //         this.router.navigate([`/companies/company/${this.companyId}`]);
  //       } else {
  //         console.error('Failed to update charger:', response);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error updating charger:', error);
  //     }
  //   });
  // }
  onSubmit() {
    if (this.companyForm.invalid) {
      logger.log('Form is invalid');
      this.companyForm.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
  
    // Append the form fields
    formData.append('company_name', this.companyForm.get('company_name')?.value);
    formData.append('company_description', this.companyForm.get('company_description')?.value);
    formData.append('company_email', this.companyForm.get('company_email')?.value);
    formData.append('company_phone_no', this.companyForm.get('company_phone_no')?.value);
    formData.append('company_address', this.companyForm.get('company_address')?.value);
    formData.append('company_city', this.companyForm.get('company_city')?.value);
    formData.append('company_country', this.companyForm.get('company_country')?.value);
    formData.append('is_whitelabel', this.companyForm.get('is_whitelabel')?.value);
  
    // Handle the file
    if (this.selectedFileName) {
      formData.append('companyLogo', this.selectedFileName); // Append the new file
    } else if (this.originalCompanyLogo) {
      formData.append('companyLogo', this.originalCompanyLogo); // Retain the original logo
    }
  
    logger.log('Submitting company data:', formData);
  
    this.companyService.updateCompany(this.companyId, formData).subscribe({
      next: (response) => {
        logger.log('Company updated successfully:', response);
        this.router.navigate([`/companies/company/${this.companyId}`]);
      },
      error: (error) => {
        logger.error('Error updating company:', error);
      },
    });
  }
  

  async getCompanyById(id: number): Promise<void> {
    try {
      // Fetch the company details
      const response = await this.companyService.getCompany(id).toPromise();
      logger.log('ID:', id);
      logger.log('API response:', response);

      const company = response.company;

      // Ensure the response data matches the form structure
      this.companyForm.patchValue({
        companyLogo: company.compan_logo,
        company_name: company.company_name,
        company_description: company.company_description,
        company_address: company.company_address,
        company_city: company.company_city,
        company_country: company.company_country,
        company_phone_no: company.company_phone_no,
        company_email: company.company_email,
        is_whitelabel: company.is_whitelabel,
        // whitelabel_expiration_date: company.whitelabel_expiration_date,


      });
      this.originalCompanyLogo = company.compan_logo;  // Store original logo name
      this.selectedFileName = this.originalCompanyLogo;  // Also update the selected file name


    } catch (error) {
      logger.error('Error fetching company or related details:', error);
    }
  }

  get phoneNumberInvalid() {
    return this.companyForm.get('company_phone_no')?.invalid && this.companyForm.get('company_phone_no')?.touched;
  }

}
