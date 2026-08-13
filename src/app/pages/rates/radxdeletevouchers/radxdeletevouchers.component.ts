import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from 'src/app/services/voucherService/voucher.service';

@Component({
  selector: 'app-radxdeletevouchers',
  templateUrl: './radxdeletevouchers.component.html'
})
export class RadxdeletevouchersComponent implements OnInit {
  voucherId: number;
  voucherName: string = ''; 
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private voucherService: VoucherService,
  ) {}

  ngOnInit(): void {
    this.voucherId = this.route.snapshot.params['id'];
    this.getVoucherDetails(this.voucherId); 
    console.log('voucherId ID:', this.voucherId);
    console.log('voucher Name:', this.voucherName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.voucherId = row.voucher_id;
    this.voucherName = row.voucher_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.voucherService.deleteVoucher(this.voucherId).subscribe({
      next: (response) => {
        console.log('Voucher deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/rates/vouchers']);
      },
      error: (error) => {
        console.error('Error deleting voucher:', error);
      }
    });
  }

  getVoucherDetails(id: number): void {
    this.voucherService.getVoucher(id).subscribe({
      next: (response) => {
        this.voucherName = response.voucher.serial_no; 
        console.log('response:',response);  
        console.log('voucherName:', this.voucherName); 
      },
      error: (error) => {
        console.error('Error fetching voucher details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/rates/vouchers']); 
  }
}
