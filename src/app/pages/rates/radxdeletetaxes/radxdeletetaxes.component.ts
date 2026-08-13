import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxService } from 'src/app/services/taxService/tax.service';

@Component({
  selector: 'app-radxdeletetaxes',
  templateUrl: './radxdeletetaxes.component.html'
})
export class RadxdeletetaxesComponent implements OnInit {

  taxId: number;
  taxName: string = ''; 
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.taxId = this.route.snapshot.params['id'];
    this.getTaxDetails(this.taxId); 
    console.log('tax ID:', this.taxId);
  }

  openDeletePopup(row: any): void {
    this.taxId = row.tax_id;
    this.taxName = row.tax_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.taxService.deleteTax(this.taxId).subscribe({
      next: (response) => {
        console.log('Tax deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rates/taxes']);
      },
      error: (error) => {
        console.error('Error deleting Tax:', error);
      }
    });
  }

  getTaxDetails(id: number): void {
    this.taxService.getTax(id).subscribe({
      next: (response) => {
        this.taxName = response.tax.tax_name; 
        console.log('response:',response);  
        console.log('tax_name:', this.taxName); 
      },
      error: (error) => {
        console.error('Error fetching tax details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/taxes']); 
  }
}
