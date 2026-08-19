import { logger } from '@core/logger';
import { Component, Inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {
  title: string;
  message: any;
  choices: any[] = [];
  selectedChoice: any = null;
  searchTerm: string = '';
  filteredChoices: any[] = [];
  remoteStartReason: string = '';
  showValidationError: boolean = false;

  // Get Diagnostics form fields
  gdLocation: string = '';
  gdStartTime: string = '';
  gdStopTime: string = '';
  gdRetries: number | null = null;
  gdRetryInterval: number | null = null;
  showGdValidation: boolean = false;

  // @Output() onClose = new EventEmitter<{ confirmed: boolean; choice?: string }>();
  @Output() onClose = new EventEmitter<{ confirmed: boolean; choice?: string; reason?: string; payload?: any }>();


  constructor(public bsModalRef: BsModalRef, private cdRef: ChangeDetectorRef) {
    this.title = bsModalRef?.content?.title;
    this.message = bsModalRef?.content?.message;
    this.choices = bsModalRef?.content?.choices || [];
    this.filteredChoices = [...this.choices]; // Initially, no filtering
    logger.log('Choices:', this.choices); // Check the values of choices
  }
  ngOnInit(): void {
    logger.log('Choices onInit:', this.choices); // Log to confirm data
    // Trigger filtering logic to populate filtered choices on initial load
    this.filterChoices();

    // Automatically enable the confirm button if only one choice is available
    // if (this.filteredChoices.length > 0) {
    //   this.selectedChoice = this.filteredChoices[0].value;
    // }
  }

onConfirm(): void {
  logger.log('onConfirm called');
  if (this.title === 'Confirm Start Remote Charging') {
    if (!this.selectedChoice || !this.remoteStartReason?.trim()) {
      this.showValidationError = true;
      return;
    }

    this.showValidationError = false;
    this.bsModalRef.hide(); // 🔁 Call first
    this.onClose.emit({
      confirmed: true,
      choice: this.selectedChoice,
      reason: this.remoteStartReason
    });
  } else if (this.title === 'Confirm Get Diagnostics') {
    if (!this.gdLocation || !this.gdLocation.trim()) {
      this.showGdValidation = true;
      return;
    }
    this.showGdValidation = false;
    const payload: any = { location: this.gdLocation.trim() };
    if (this.gdStartTime)     payload.startTime = new Date(this.gdStartTime).toISOString();
    if (this.gdStopTime)      payload.stopTime = new Date(this.gdStopTime).toISOString();
    if (this.gdRetries !== null && this.gdRetries !== undefined && `${this.gdRetries}` !== '')
      payload.retries = Number(this.gdRetries);
    if (this.gdRetryInterval !== null && this.gdRetryInterval !== undefined && `${this.gdRetryInterval}` !== '')
      payload.retryInterval = Number(this.gdRetryInterval);
    this.bsModalRef.hide();
    this.onClose.emit({ confirmed: true, payload });
  } else {
    this.bsModalRef.hide(); // 🔁 Call first
    if (this.selectedChoice) {
      this.onClose.emit({ confirmed: true, choice: this.selectedChoice });
    } else {
      this.onClose.emit({ confirmed: true });
    }
  }
}


  onCancel(): void {
    this.onClose.emit({ confirmed: false });
    this.bsModalRef.hide();
  }

  filterChoices(): void {
  const defaultOption = { label: 'Select user', value: null };

  if (this.searchTerm.trim() === '') {
    this.filteredChoices = [defaultOption, ...this.choices];
  } else {
    const filtered = this.choices.filter(choice =>
      choice.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredChoices = [defaultOption, ...filtered];
  }

  // Always reset to default on filter
  this.selectedChoice = null;
}
}
