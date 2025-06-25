import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';
import { getRandomColor } from '../../../shared/color-utils';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  @Input() isDialogOpen: boolean = false;
  @Output() contactSelected = new EventEmitter<string>();
  @Output() addContactRequested = new EventEmitter<void>();
  @Output() closeDialogRequested = new EventEmitter<void>();

   alphabet: string[] = [];
   selectedContactId: string | null = null;
   showMobileDialog: boolean = false;

  constructor(public contactDataService: ContactDataService) {}
  
  ngOnInit(): void {
    for (let i = 65; i <= 90; i++) {
      this.alphabet.push(String.fromCharCode(i));
    }
  }

  openAddContactDialog() {
    this.addContactRequested.emit();
  }

  openMobileAddContactDialog() {
    // Toggle dialog: close if open, open if closed
    if (this.isDialogOpen) {
      this.closeDialogRequested.emit();
    } else {
      this.addContactRequested.emit();
    }
  }

  closeMobileDialog() {
    // This method is no longer needed since we're using the existing dialog
    // Keep it for backward compatibility but make it empty
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

  getfirstletter(name: string) {
    return name.charAt(0);
  }
  
  selectContact(contactId: string | undefined) {
    if (contactId !== undefined) {
      this.selectedContactId = contactId;
      this.contactSelected.emit(contactId);
    }
  }
}
