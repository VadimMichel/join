import { Component } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactDataService } from '../contact-data.service';

@Component({
  selector: 'app-contacts',
  imports: [ContactListComponent, ContactDetailsComponent, ContactDialogComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  selectedContactId: string | null = null;
  showAddDialog: boolean = false;
  editingContact: any = null;

  constructor(private contactDataService: ContactDataService) {}

  onContactSelected(contactId: string) {
    this.selectedContactId = contactId;
  }

  openAddContactDialog() {
    this.editingContact = null;
    this.showAddDialog = true;
  }

  openEditContactDialog(contact: any) {
    this.editingContact = contact;
    this.showAddDialog = true;
  }

  closeDialog() {
    this.showAddDialog = false;
    this.editingContact = null;
  }

  async onContactSubmitted(contactData: any) {
    try {
      if (this.editingContact) {
        // Edit existing contact
        await this.contactDataService.updateContact(contactData.id, {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone
        });
      } else {
        // Add new contact
        await this.contactDataService.addContact(contactData);
      }
      this.closeDialog();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Fehler beim Speichern des Kontakts. Bitte versuchen Sie es erneut.');
    }
  }

  async deleteContact(contactId: string) {
    try {
      await this.contactDataService.deleteContact(contactId);
      // Clear selected contact if it was deleted
      if (this.selectedContactId === contactId) {
        this.selectedContactId = null;
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Fehler beim Löschen des Kontakts. Bitte versuchen Sie es erneut.');
    }
  }
}
