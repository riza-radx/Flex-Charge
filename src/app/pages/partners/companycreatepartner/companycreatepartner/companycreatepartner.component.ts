import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-companycreatepartner',
  templateUrl: './companycreatepartner.component.html',
  styles: [
  ]
})
export class CompanycreatepartnerComponent {

  partner = {
    partnerName: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    nipt: '',
    companyId: '',
    userId: ''
  };

  constructor(private partnerService: PartnerService, private router: Router) {}

  onSubmit() {
    this.partnerService.createPartner(this.partner).subscribe(
      response => {
        logger.log('Partner created successfully!', response);
        this.router.navigate(['/partners']);
      },
      error => {
        logger.error('Error creating partner:', error);
      }
    );
  }

}
