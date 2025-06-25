import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { getRandomColor } from '../../../shared/color-utils';
import { Contacts } from '../../contacts-interface';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, ContactDialogComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contactId: string | null = null;
  @Output() editContactRequested = new EventEmitter<Contacts>();
  @Output() deleteContactRequested = new EventEmitter<string>();
  @Output() backRequested = new EventEmitter<void>();

  contact$!: Observable<Contacts | null>;
  animated: boolean = true;
  isMobileView: boolean = false;
  showEditDialog: boolean = false;
  shouldCloseDialog: boolean = false;
  contactToEdit: Contacts | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public contactDataService: ContactDataService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    if (!this.contactId) {
      this.contactId = this.route.snapshot.params['id'];
    }

    if (this.contactId) {
      this.loadContact();
    }
    
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }
  
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactId'] && this.contactId) {
      this.resetAnimation();
      this.loadContact();
    }
  }

  private resetAnimation() {
    this.animated = false;
    setTimeout(() => {
      this.animated = true;
    }, 10);
  }

  private loadContact() {
    if (this.contactId) {
      this.contact$ = this.contactDataService.getContactById(this.contactId);
    }
  }

  goBack() {
    if (this.router.url.includes('/contacts/')) {
      this.router.navigate(['/contacts']);
    } else {
      this.backRequested.emit();
    }
  }

  editContact(contact: Contacts) {
    if (this.isMobileView && this.router.url.includes('/contacts/')) {
      this.contactToEdit = contact;
      this.showEditDialog = true;
    } else {
      this.editContactRequested.emit(contact);
    }
  }

  deleteContact(contactId: string | undefined) {
    if (!contactId) return;
    
    if (this.isMobileView && this.router.url.includes('/contacts/')) {
      this.contactDataService.deleteContact(contactId).then(() => {
        this.router.navigate(['/contacts']);
      });
    } else {
      this.deleteContactRequested.emit(contactId);
    }
  }

  startDialogClose() {
    this.shouldCloseDialog = true;
  }

  closeDialog() {
    this.showEditDialog = false;
    this.contactToEdit = null;
    this.shouldCloseDialog = false;
  }

  async onContactSubmitted(contactData: Contacts) {
    try {
      await this.contactDataService.updateContact(contactData);
      this.closeDialog();
      this.loadContact();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Fehler beim Speichern des Kontakts. Bitte versuchen Sie es erneut.');
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ') 
      .map((word) => word.charAt(0)) 
      .join('');
  }

  getRandomColor(name: string): string {
    return getRandomColor(name); 
  }
}
