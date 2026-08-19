import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from 'src/app/services/voucherService/voucher.service';

@Component({
  selector: 'app-usergroupusevoucher',
  templateUrl: './usergroupusevoucher.component.html',
  styleUrls: []
})
export class UsergroupusevoucherComponent implements OnInit{
  voucher = {
    blockNo: '',
  };
  usergrId: string = '';
  fromUserGroupDetail: boolean = false;
  constructor(
    private voucherService: VoucherService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['fromUserGroupDetail']) {
        this.fromUserGroupDetail = true;  // Set to true if from profile
      }
    });
    this.usergrId = this.route.snapshot.params['id'];
    logger.log('User ID from UsergroupusevoucherComponent:', this.usergrId);  // Debugging line
  }

  onSubmit() {
    if (this.usergrId) {
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
  
      this.voucherService.userGroupUseVoucher(this.usergrId, voucherData).subscribe({
        next: (response) => {
          logger.log('Voucher applied successfully:', response);
          if (this.fromUserGroupDetail) {
          this.router.navigate([`/users/usergroup/${this.usergrId}`]);
          }
          else{
            this.router.navigate([`/profile`]);
          }
        },
        error: (error) => {
          logger.error('Error applying voucher:', error);
        },
      });
    } else {
      logger.error('User ID not found in route parameters.');
    }
  }
}
