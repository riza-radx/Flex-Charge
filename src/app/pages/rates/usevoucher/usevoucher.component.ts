import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { VoucherService } from "../../../services/voucherService/voucher.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-usevoucher',
  templateUrl: './usevoucher.component.html',
  styles: [
  ]
})
export class UsevoucherComponent {
  voucher = {
    blockNo: '',
  };

  constructor(
      private voucherService: VoucherService, 
      private router: Router
    ) { }

    onSubmit() {
      const now = new Date();
      
      // Format to local time (YYYY-MM-DD HH:mm:ss)
      const usedDate = now.toLocaleString('en-GB', { 
        hour12: false, 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }).replace(',', '');
  
      // Ensure voucher data includes usedDate
      const voucherData = {
        ...this.voucher,
        usedDate: usedDate
      };

      this.voucherService.useVoucher(voucherData).subscribe(
        (response) => {
          logger.log('Currency used successfully:', response);
          this.router.navigate(['/profile']);  // Adjust the navigation as needed
        },
        (error) => {
          logger.error('Error using vouchers:', error);
        }
      );
    }
}
