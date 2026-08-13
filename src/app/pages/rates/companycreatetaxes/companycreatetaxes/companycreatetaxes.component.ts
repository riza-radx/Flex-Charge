import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaxService } from 'src/app/services/taxService/tax.service';

@Component({
  selector: 'app-companycreatetaxes',
  templateUrl: './companycreatetaxes.component.html',
  styles: [
  ]
})
export class CompanycreatetaxesComponent {
  tax = {
    taxName: '',
    percentage: 0,
    companyId: 0,
    idNo: '',
    userGrId: 0,
    userId: 0,
    partnerId: 0
  };

  constructor(private taxService: TaxService, private router: Router) {}

  onSubmit() {
    this.taxService.addTax(this.tax).subscribe({
      next: (response) => {
        console.log('Tax created successfully', response);
        this.router.navigate(['/taxes']);
      },
      error: (error) => {
        console.error('Error creating tax', error);
      }
    });
  }

}
