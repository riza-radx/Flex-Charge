import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/services/documentService/document.service';

@Component({
  selector: 'app-delete-documents',
  templateUrl: './delete-documents.component.html'
})
export class DeleteDocumentsComponent implements OnInit {
  documentId: number;
  documentName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private documentService: DocumentService,
  ) { }

  
  ngOnInit(): void {
    this.documentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.documentId) {
      this.getDocumentDetails(this.documentId);
    }
    
    console.log('Document Name:', this.documentName);
  }

  openDeletePopup(row: any): void {
    console.log('row:', row);
    this.documentId = row.document_id;
    this.documentName = row.file_name;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.documentService.deleteDocument(this.documentId).subscribe({
      next: (response) => {
        console.log('Document deleted successfully:', response);
        this.closePopupHandler();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  closePopupHandler(): void {
    this.isPopupVisible = false; // Hide the popup
    setTimeout(() => {
      this.router.navigate(['/assets/documents']); // Ensure navigation happens after the popup is closed
    }, 300);
  }

  getDocumentDetails(id: number): void {
    this.documentService.getDocument(id).subscribe({
      next: (response) => {
        this.documentName = response.document.file_name;
        console.log('response:', response);
        console.log('userName:', this.documentName);
      },
      error: (error) => {
        console.error('Error fetching User details:', error);
      }
    });
  }
}
