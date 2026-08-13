import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectorService } from 'src/app/services/connectorService/connector.service';

@Component({
  selector: 'app-qr-code-popup',
  templateUrl: './qr-code-popup.component.html'
})
export class QrCodePopupComponent implements OnInit {


  connectorId: any;
  connectorName: any;
  connectorNo: any;
  chargerId: any;
  qrCodeUrl: string;
  isPopupVisible: boolean = true;

  constructor(
    private connectorService: ConnectorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.connectorId = this.route.snapshot.paramMap.get('connectorId') as string;
    this.fetchQRCodeUrl();
  }

  fetchQRCodeUrl() {
    this.connectorService.getConnector(this.connectorId).subscribe(
      (data: any) => {
        console.log('Connector:', data);
        this.qrCodeUrl = data.connector.qrCodeUrl;
        this.chargerId = data.connector.charger_id
        this.connectorName = data.connector.connector_name;
        this.connectorNo = data.connector.connector_no;
      },
      (error) => {
        console.error('Error fetching QR Code URL', error);
      }
    );
  }

  closePopup() {
    this.isPopupVisible = false;
    this.router.navigate([`/assets/chargers/${this.chargerId}`]);
  }
  downloadQRCode() {
    const imageUrl = this.qrCodeUrl;
    
    // Create a new image object to fetch the image and convert it into a Blob
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a new Blob URL from the fetched Blob
        const url = window.URL.createObjectURL(blob);
        const fileName = `${this.connectorName}-${this.connectorNo}-${this.connectorId}-${this.chargerId}.png`;

        // Create a temporary link element to trigger the download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName; // Set default file name
  
        // Append the link to the body, click it to trigger the download, then remove it
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Optionally, revoke the Blob URL to free memory
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading QR code', error);
      });
  }

}
