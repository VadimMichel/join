import { Component, Output, EventEmitter, Input, OnInit, OnChanges } from '@angular/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { Contacts } from '../../contacts-interface';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss',
  imports: [ContactFormComponent],
})
export class ContactDialogComponent implements OnInit, OnChanges {
  @Input() editingContact: Contacts | null = null;
  @Input() shouldClose: boolean = false;
  @Output() contactSubmitted = new EventEmitter<Contacts>();
  @Output() dialogClosed = new EventEmitter<void>();

  animated: boolean = false;
  isClosing: boolean = false;

  ngOnInit() {
    // Start opening animation immediately when component initializes
    this.animated = true;
  }

  ngOnChanges(changes: any) {
    // Watch for external close requests (like from mobile FAB)
    if (changes.shouldClose && changes.shouldClose.currentValue === true) {
      this.onClose();
    }
  }

  onContactSubmitted(contactData: Contacts) {
    this.startCloseAnimation(() => {
      this.contactSubmitted.emit(contactData);
    });
  }

  onClose() {
    this.startCloseAnimation(() => {
      this.dialogClosed.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    // Close dialog when clicking on overlay
    this.onClose();
  }

  private startCloseAnimation(callback: () => void) {
    this.isClosing = true;
    // Wait for animation to complete before emitting close event
    setTimeout(() => {
      callback();
    }, 300); // Match the animation duration
  }
}
