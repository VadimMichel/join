import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { Contacts } from '../../contacts-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
})
export class ContactDialogComponent implements OnInit, OnChanges {
  @Input() editingContact: Contacts | null = null;
  @Input() shouldClose: boolean = false;
  @Output() contactSubmitted = new EventEmitter<Contacts>();
  @Output() dialogClosed = new EventEmitter<void>();
  @Output() closeRequested = new EventEmitter<void>();
  @Output() closeCanceled = new EventEmitter<void>();

  animated: boolean = false;
  isClosing: boolean = false;

  ngOnInit() {
    this.animated = true;
      document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
      document.body.style.overflow = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shouldClose'] && changes['shouldClose'].currentValue === true) {
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
    this.onClose();
  }

  private startCloseAnimation(callback: () => void) {
    this.isClosing = true;
    setTimeout(() => {
      callback();
    }, 300); 
  }
}
