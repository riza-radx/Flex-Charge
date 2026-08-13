import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from 'src/app/services/partnerService/partner.service';

@Component({
  selector: 'app-companydeletepartner',
  templateUrl: './companydeletepartner.component.html',
})
export class CompanydeletepartnerComponent implements OnInit {
  partnerId: number;
  partnerName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private partnerService: PartnerService
  ) { }

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.params['id'];
    this.getPartnerDetails(this.partnerId);
    console.log('Charger ID:', this.partnerId);
    console.log('Charger Name:', this.partnerName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.partnerId = row.partner_id;
    this.partnerName = row.partner_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.partnerService.deletePartner(this.partnerId).subscribe({
      next: (response) => {
        console.log('Partner deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/partners/partner']);
      },
      error: (error) => {
        console.error('Error deleting partner:', error);
      }
    });
  }

  getPartnerDetails(id: number): void {
    this.partnerService.getPartner(id).subscribe({
      next: (response) => {
        this.partnerName = response.partner.partner_name;
        console.log('response:', response);
        console.log('partnerName:', this.partnerName);
      },
      error: (error) => {
        console.error('Error fetching location details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/partners/partner']);
  }
}
