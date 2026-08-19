import { logger } from '@core/logger';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/companyService/company.service';

@Component({
  selector: 'app-companydeletecompany',
  templateUrl: './companydeletecompany.component.html'
})
export class CompanydeletecompanyComponent implements OnInit {

  companyId: number;
  companyName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params['id'];
    this.getCompanyDetails(this.companyId);
    logger.log('companyId ID:', this.companyId);
    logger.log('company Name:', this.companyName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.companyId = row.location_id;
    this.companyName = row.company_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.companyService.deleteCompany(this.companyId).subscribe({
      next: (response) => {
        logger.log('company deleted successfully:', response);
        // this.closePopupHandler();
        // this.router.navigate(['/companies/company']);
        this.closePopupHandler();
        this.closePopup.emit();
      },
      error: (error) => {
        logger.error('Error deleting location:', error);
      }
    });
  }

  getCompanyDetails(id: number): void {
    this.companyService.getCompany(id).subscribe({
      next: (response) => {
        this.companyName = response.company.company_name;
        logger.log('response:', response);
        logger.log('companyName:', this.companyName);
      },
      error: (error) => {
        logger.error('Error fetching company details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    setTimeout(() => {
      this.router.navigate(['/companies/company']);
    }, 300);
  }
}
