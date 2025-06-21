import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-contact-dialog',
  imports: [ContactFormComponent],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss'
})
export class ContactDialogComponent {
  @Input() editingContact: any = null;
  @Output() contactSubmitted = new EventEmitter<any>();
  @Output() dialogClosed = new EventEmitter<void>();

  onContactSubmitted(contactData: any) {
    this.contactSubmitted.emit(contactData);
  }

  onClose() {
    this.dialogClosed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    // Close dialog when clicking on overlay
    this.onClose();
  }

  // KI freier Code:
  
}
