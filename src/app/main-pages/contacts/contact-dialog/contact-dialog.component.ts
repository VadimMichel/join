import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { Contacts } from '../../contacts-interface';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss',
  imports: [ContactFormComponent],
})
export class ContactDialogComponent {
  @Input() editingContact: Contacts | null = null;
  @Output() contactSubmitted = new EventEmitter<Contacts>();
  @Output() dialogClosed = new EventEmitter<void>();

  animated: boolean = true;

  onContactSubmitted(contactData: Contacts) {
    this.contactSubmitted.emit(contactData);
  }

  onClose() {
    this.dialogClosed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    // Close dialog when clicking on overlay
    this.onClose();
  }
}
