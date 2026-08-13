import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RechargeService } from '../../../../services/rechargeService/recharge.service'
import { UserService } from 'src/app/services/userService/user.service';
import { CardService } from 'src/app/services/cardService/card.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-radxrecharges',
  templateUrl: './radxrecharges.component.html',
  styles: [
  ]
})
export class RadxrechargesComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  constructor(
    private rechargeService: RechargeService, 
    private userService: UserService,
    private cardService: CardService,
    private userGroupService: UserGroupService,
    private router: Router) {
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    const val = ($event.target.value || '').toString().toLowerCase();
    if (!val) {
      this.temp = [...this.rows];
      return;
    }
    this.temp = this.rows.filter((d) => {
      for (const key in d) {
        if (d[key] === null || d[key] === undefined) { continue; }
        if (String(d[key]).toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // this.activeRow = event.row;
    this.activeRow = event.row;
    // if (event.type === 'click') {
    //   this.router.navigate([`/rfid-cards/recharges/${this.activeRow.recharge_id}`]);  // Navigate to company details page
    // }
  }

  ngOnInit() {
    this.getRecharges();
  }

  getRecharges() {
    this.rechargeService.getAllRecharges().subscribe(
      (data) => {
        this.rows = data.recharges;
        this.temp = [...this.rows];
        console.log(this.rows);
        this.rows.forEach((row, index) => {
          this.cardService.getCard(row.card_id).subscribe(
            (cardData) => {
              this.rows[index].card = cardData.card.serial_no;  
              if(cardData.card.user_id != null){
              console.log("row.card.user_id",cardData.card.user_id);
              this.userService.getUserById(cardData.card.user_id).subscribe(
                (userData) => {
                  this.rows[index].user = userData.user.username; 
                  this.temp = [...this.rows];  
                },
                (error) => {
                  this.errorMessage = error.message;
                  console.log(error);
                }
              );}
              else{
                this.userGroupService.getUserGroup(cardData.card.usergr_id).subscribe(
                  (userData) => {
                    this.rows[index].user = userData.user.username; 
                    this.temp = [...this.rows];  
                  },
                  (error) => {
                    this.errorMessage = error.message;
                    console.log(error);
                  }
                );
              }
              this.temp = [...this.rows];  
            },
            (error) => {
              this.errorMessage = error.message;
              console.log(error);
            }
          );
         
        });
      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);
        
      }
    )
  }

}
