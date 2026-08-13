import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RechargeService } from "../../../services/rechargeService/recharge.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-recharge-details',
  templateUrl: './recharge-details.component.html',
  styles: [
  ]
})
export class RechargeDetailsComponent {
  errorMessage: any;
  id: string;
  recharge: any[] = [];
  // tempRecharge = [];

  constructor(
    private rechargeService: RechargeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getRecharge();
    
  }

  getRecharge() {
    this.rechargeService.getRechargeByCard(this.id).subscribe(
      (data) => {
        this.recharge = data;
        console.log(data);
        
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);
        
      }
    )
  }

}
