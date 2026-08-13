import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from 'src/app/services/voucherService/voucher.service';

@Component({
  selector: 'app-userusevoucher',
  templateUrl: './userusevoucher.component.html',
  styles: [
  ]
})
export class UserusevoucherComponent implements OnInit {
  voucher = {
    blockNo: '',
  };
  userId: string = '';
  constructor(
    private voucherService: VoucherService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    console.log('User ID from UserusevoucherComponent:', this.userId);  // Debugging line
  }

  onSubmit() {
    if (this.userId) {
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
  
      this.voucherService.userDettailUseVoucher(this.userId, voucherData).subscribe({
        next: (response) => {
          console.log('Voucher applied successfully:', response);
          this.router.navigate([`/users/user/${this.userId}`]);
        },
        error: (error) => {
          console.error('Error applying voucher:', error);
        },
      });
    } else {
      console.error('User ID not found in route parameters.');
    }
  }
  
  
}
