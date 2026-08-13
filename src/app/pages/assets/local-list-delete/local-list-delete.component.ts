import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalListService } from 'src/app/services/localList/local-list.service';

@Component({
  selector: 'app-local-list-delete',
  templateUrl: './local-list-delete.component.html',
  styles: [
  ]
})
export class LocalListDeleteComponent {
 isPopupVisible: boolean = true;
 cllId: number;
 chargerId: number;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
      private router: Router,
      private route: ActivatedRoute,
       private localListService: LocalListService,
    ) { }

    ngOnInit(): void {
      this.cllId = this.route.snapshot.params['cllId'];   
      this.chargerId = this.route.snapshot.params['chargerId'];     
      console.log('cllId ID:', this.cllId);
    }

    openDeletePopup(row: any): void {
      this.cllId = row.charger_local_list_id;
      this.isPopupVisible = true;
    }
  
    confirmDelete(): void {
      this.localListService.deleteChargerLocalList(this.cllId).subscribe({
        next: (response) => {
          console.log('Charger local list deleted successfully:', response);
          this.closePopupHandler();
          this.router.navigate([`/assets/chargers/${this.chargerId}`]);

        },
        error: (error) => {
          console.error('Error deleting charger:', error);
        }
      });
    }
  
    closePopupHandler(): void {
      this.isPopupVisible = false;
      this.router.navigate([`/assets/chargers/${this.chargerId}`]);  // Navigate away after closing the popup
    }
}
