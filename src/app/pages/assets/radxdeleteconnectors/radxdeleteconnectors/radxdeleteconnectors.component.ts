import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectorService } from 'src/app/services/connectorService/connector.service';

@Component({
  selector: 'app-radxdeleteconnectors',
  templateUrl: './radxdeleteconnectors.component.html'
})
export class RadxdeleteconnectorsComponent {
  connectorId: number;
  connectorName: string = '';
  chargerId: number;
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private connectorService: ConnectorService
  ) { }

  ngOnInit(): void {
    this.connectorId = this.route.snapshot.params['id'];
    this.getConnectorDetails(this.connectorId);
    console.log('Connector ID:', this.connectorId);
    console.log('Connector Name:', this.connectorName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.connectorId = row.connector_id; // Assuming 'row' contains connector data
    this.connectorName = row.connector_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.connectorService.deleteConnector(this.connectorId).subscribe({
      next: (response) => {
        console.log('Connector deleted successfully:', response);
        this.closePopupHandler();
        this.router.navigate(['/assets/chargers', this.chargerId]);
      },
      error: (error) => {
        console.error('Error deleting connector:', error);
      }
    });
  }

  getConnectorDetails(id: number): void {
    this.connectorService.getConnector(id).subscribe({
      next: (response) => {
        this.connectorName = response.connector.connector_name;
        this.chargerId = response.connector.charger_id;  // Assuming 'charge_id' exists in the response
        console.log('response:', response);
        console.log('connectorName:', this.connectorName);
      },
      error: (error) => {
        console.error('Error fetching connector details:', error);
      }
    });
  }


  closePopupHandler(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/assets/chargers', this.chargerId]);
  }
}
