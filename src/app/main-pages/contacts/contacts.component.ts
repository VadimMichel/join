import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactDataService } from '../contact-data.service';
import { Contacts } from '../contacts-interface';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  imports: [ContactListComponent, ContactDetailsComponent, ContactDialogComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, OnDestroy {
  selectedContactId: string | null = null;
  showAddDialog: boolean = false;
  editingContact: Contacts | null = null;
  shouldCloseDialog: boolean = false;
  isMobileView: boolean = false;

  constructor(
    private contactDataService: ContactDataService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    
    // Check for saved contact ID from mobile-to-desktop transition
    setTimeout(() => {
      this.checkForSavedSelection();
    }, 100);

    // Listen for route changes to check for saved selection when navigating back
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/contacts') {
        setTimeout(() => {
          this.checkForSavedSelection();
        }, 50);
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize() {
    const wasInMobileView = this.isMobileView;
    this.isMobileView = window.innerWidth < 816;

    // If transitioning from mobile to desktop view and we are on a contact detail page,
    // redirect back to main contacts and show the detail in split view
    if (wasInMobileView && !this.isMobileView && this.router.url.includes('/contacts/')) {
      const contactId = this.router.url.split('/').pop();
      
      this.router.navigate(['/contacts']).then(() => {
        this.selectedContactId = contactId || null;
        
        // Ensure change detection runs after setting the value
        Promise.resolve().then(() => {
          this.cdr.detectChanges();
        });
      });
    }
  }

  private checkForSavedSelection() {
    // Check localStorage for saved contact ID
    const savedContactId = localStorage.getItem('selectedContactId');
    if (savedContactId) {
      this.selectedContactId = savedContactId;
      this.cdr.detectChanges();
      
      // Clear localStorage after ensuring the contact list has received the value
      setTimeout(() => {
        localStorage.removeItem('selectedContactId');
      }, 200);
      return;
    }

    // Fallback to service storage
    const serviceContactId = this.contactDataService.getSelectedContactId();
    if (serviceContactId) {
      this.selectedContactId = serviceContactId;
      this.contactDataService.setSelectedContactId(null);
      this.cdr.detectChanges();
    }
  }

  onContactSelected(contactId: string) {
    if (this.isMobileView) {
      this.router.navigate(['/contacts', contactId]);
    } else {
      this.selectedContactId = contactId;
      localStorage.setItem('selectedContactId', contactId);
    }
  }

  onBackRequested() {
    this.selectedContactId = null;
  }

  openAddContactDialog() {
    this.editingContact = null;
    this.showAddDialog = true;
  }

  openEditContactDialog(contact: Contacts) {
    this.editingContact = contact;
    this.showAddDialog = true;
  }

  startDialogClose() {
    this.shouldCloseDialog = true;
  }

  closeDialog() {
    this.showAddDialog = false;
    this.editingContact = null;
    this.shouldCloseDialog = false;
  }

  // Edit existing contact or add new contact
  async onContactSubmitted(contactData: Contacts) {
    try {
      if (this.editingContact) {
        await this.contactDataService.updateContact(contactData);
      } else {
        await this.contactDataService.addContact(contactData);
      }
      this.closeDialog();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Fehler beim Speichern des Kontakts. Bitte versuchen Sie es erneut.');
    }
  }

  // Delete contact and clear selected contact if it was deleted
  async deleteContact(contactId: string) {
    try {
      await this.contactDataService.deleteContact(contactId);
      if (this.selectedContactId === contactId) {
        this.selectedContactId = null;
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Fehler beim Löschen des Kontakts. Bitte versuchen Sie es erneut.');
    }
  }
}
