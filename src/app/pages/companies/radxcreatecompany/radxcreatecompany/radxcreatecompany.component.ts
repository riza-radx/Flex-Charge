

import { Component } from '@angular/core';
import { CompanyService } from "../../../../services/companyService/company.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/userService/user.service';
import { Router } from '@angular/router';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-radxcreatecompany',
  templateUrl: './radxcreatecompany.component.html',
  styles: []
})
export class RadxcreatecompanyComponent {
  companyForm: FormGroup;
  selectedFile: File | null = null;
  countries: any[] = [];
  selectedCountryCode: string = '';  

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private companyService: CompanyService,
    private countryService: CountryService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      // company_logo: ['', Validators.required],
      company_name: ['', Validators.required],
      company_description: ['', Validators.required],
      company_email: ['', [Validators.required, Validators.email]],
      company_phone: ['', [Validators.required]],
      company_address: ['', Validators.required],
      company_city: ['', Validators.required],
      company_country: ['', Validators.required],
      is_whitelabel: [false, Validators.required],
      // whitelabel_expiration_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
      // Caktoni një kod shteti të parazgjedhur
      this.selectedCountryCode = this.countries[0].prefix;
    });
    // this.loadUsers();
  }



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }
  onSubmit() {
    console.log('Form submission triggered');
    console.log('Form Valid:', this.companyForm.valid);
    console.log('Form Value:', this.companyForm.value);

    if (this.companyForm.invalid) {
      console.log('Form is invalid');
      this.companyForm.markAllAsTouched();
      return;
    }

    // Prepare FormData to include both the form fields and the file
    const formData = new FormData();
    formData.append('company_name', this.companyForm.get('company_name')?.value);
    formData.append('company_description', this.companyForm.get('company_description')?.value);
    formData.append('company_address', this.companyForm.get('company_address')?.value);
    formData.append('company_city', this.companyForm.get('company_city')?.value);
    formData.append('company_country', this.companyForm.get('company_country')?.value);
    formData.append('company_phone_number', this.companyForm.get('company_phone')?.value);
    formData.append('company_email', this.companyForm.get('company_email')?.value);
    formData.append('is_whitelabel', this.companyForm.get('is_whitelabel')?.value.toString());

    // Append the file if selected
    if (this.selectedFile) {
      formData.append('company_logo', this.selectedFile, this.selectedFile.name);
    }

    console.log('Company Data to Submit:', formData);

    // Send the FormData
    this.companyService.addCompany(formData).subscribe(
      (response) => {
        console.log('Company created successfully', response);
        // Redirect after successful creation
        this.router.navigate(['/companies/company']);
      },
      (error) => {
        console.error('Error creating company', error);
        // Handle error
      }
    );
  }

  get phoneNumberInvalid() {
    return this.companyForm.get('company_phone')?.invalid && this.companyForm.get('company_phone')?.touched;
  }

  onCountryChange(event: any) {
    this.selectedCountryCode = event.target.value;
    const currentValue = this.companyForm.get('company_phone').value;

    // Ensure the phone number starts with the selected country code
    if (!currentValue.startsWith(this.selectedCountryCode)) {
        this.companyForm.patchValue({
            company_phone: this.selectedCountryCode + currentValue.replace(/^\+\d+/, '')
        });
    }
}

formatPhoneNumber() {
    const currentValue = this.companyForm.get('company_phone').value;

    if (!currentValue.startsWith(this.selectedCountryCode)) {
        this.companyForm.patchValue({
            company_phone: this.selectedCountryCode + currentValue.replace(/^\+\d+/, '')
        });
    }
}

}
