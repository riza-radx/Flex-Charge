import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from "../../../../services/voucherService/voucher.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-voucherdetails',
  templateUrl: './voucherdetails.component.html',
  styles: [
  ]
})
export class VoucherdetailsComponent implements OnInit {
  errorMessage: any;
  id: string;
  voucher: any = {}; // Ensure this is an object
  // ratePerDays: any[] = [];
  tempRatePerDays: any[] = [];
  selected: any[] = [];
  entries: number = 10;

  constructor(
    private voucherService: VoucherService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getVoucher();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    // Handle row activation if needed
  }

  getVoucher() {
    this.voucherService.getVoucher(this.id).subscribe(
      (data) => {
        logger.log(data);
        if (data && data.voucher) {
          this.voucher = data.voucher; // Make sure data.voucher is an object
        }
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

}
