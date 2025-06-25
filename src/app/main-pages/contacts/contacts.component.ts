import { Component } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactDataService } from '../contact-data.service';
import { Contacts } from '../contacts-interface';

@Component({
  selector: 'app-contacts',
  imports: [ContactListComponent, ContactDetailsComponent, ContactDialogComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  selectedContactId: string | null = null;
  showAddDialog: boolean = false;
  editingContact: Contacts | null = null;
  shouldCloseDialog: boolean = false;

  constructor(private contactDataService: ContactDataService) {}

  onContactSelected(contactId: string) {
    this.selectedContactId = contactId;
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

  // Method to initiate dialog closing with animation
  startDialogClose() {
    // Signal the dialog to start its closing animation
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
