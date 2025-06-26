import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
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
export class ContactDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() editingContact: Contacts | null = null;
  @Input() shouldClose: boolean = false;
  @Output() contactSubmitted = new EventEmitter<Contacts>();
  @Output() dialogClosed = new EventEmitter<void>();
  @Output() closeRequested = new EventEmitter<void>();
  @Output() closeCanceled = new EventEmitter<void>();

  animated: boolean = false;
  isClosing: boolean = false;
  isMobile = false;

  /**
   * Initializes the dialog with animations and viewport settings
   */
  ngOnInit() {
    this.setupDialog();
    this.setupViewportListener();
  }

  /**
   * Cleans up resources when component is destroyed
   */
  ngOnDestroy(): void {
    document.body.style.overflow = '';
    window.removeEventListener('resize', this.checkViewportWidth);
  }

  /**
   * Handles input changes, particularly the shouldClose trigger
   * @param changes - The changes to component inputs
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['shouldClose'] && changes['shouldClose'].currentValue === true) {
      this.onClose();
    }
  }

  /**
   * Sets up the dialog animation and body overflow
   */
  private setupDialog() {
    this.animated = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Sets up the viewport width listener
   */
  private setupViewportListener() {
    this.checkViewportWidth();
    window.addEventListener('resize', this.checkViewportWidth);
  }

  /**
   * Checks viewport width and updates mobile state
   */
  checkViewportWidth = () => {
    this.isMobile = window.innerWidth < 1040;
  };

  /**
   * Handles contact submission with close animation
   * @param contactData - The submitted contact data
   */
  onContactSubmitted(contactData: Contacts) {
    this.startCloseAnimation(() => {
      this.contactSubmitted.emit(contactData);
    });
  }

  /**
   * Handles dialog close request
   */
  onClose() {
    this.startCloseAnimation(() => {
      this.dialogClosed.emit();
    });
  }

  /**
   * Handles overlay click to close dialog
   * @param event - The mouse event
   */
  onOverlayClick(event: MouseEvent) {
    this.onClose();
  }

  /**
   * Starts the close animation and executes callback
   * @param callback - Function to execute after animation
   */
  private startCloseAnimation(callback: () => void) {
    this.isClosing = true;
    setTimeout(() => {
      callback();
    }, 300);
  }
}
