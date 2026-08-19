import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { VoucherService } from "../../../../services/voucherService/voucher.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-companycreatevouchers',
  templateUrl: './companycreatevouchers.component.html',
  styles: [
  ]
})
export class CompanycreatevouchersComponent {
  voucher = {
    voucherName: '',
    voucherDescription: '',
    amount: null,
    percentage: null,
    serial_no: '',
    block_no: '',
    companyId: null,
    userId: null,
    date: '',
    is_distributor_card: false,
    distributor_name: ''
  };

  useAmount: boolean = true;

  constructor(private voucherService: VoucherService, private router: Router) {}

  onSubmit() {
    this.voucherService.addVoucher(this.voucher).subscribe(
      response => {
        logger.log('Voucher created successfully:', response);
        this.router.navigate(['/vouchers']); // Navigate to the vouchers list or a success page
      },
      error => {
        logger.error('Error creating voucher:', error);
      }
    );
  }

  toggleUseAmount(event: any) {
    this.useAmount = event.target.checked;
  }

}
