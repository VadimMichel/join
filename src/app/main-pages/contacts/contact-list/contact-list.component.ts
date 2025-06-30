import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getRandomColor } from '../../../shared/color-utils';
import { ContactDataService } from '../../shared-data/contact-data.service';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  @Input() isDialogOpen: boolean = false;
  @Input() selectedContactId: string | null = null;
  @Output() contactSelected = new EventEmitter<string>();
  @Output() addContactRequested = new EventEmitter<void>();
  @Output() closeDialogRequested = new EventEmitter<void>();

  alphabet: string[] = [];

  constructor(public contactDataService: ContactDataService) {}

  /**
   * Initializes the component and generates alphabet array
   */
  ngOnInit(): void {
    this.generateAlphabet();
  }

  /**
   * Generates the alphabet array for contact grouping
   */
  private generateAlphabet() {
    for (let i = 65; i <= 90; i++) {
      this.alphabet.push(String.fromCharCode(i));
    }
  }

  /**
   * Opens the add contact dialog
   */
  openAddContactDialog() {
    this.addContactRequested.emit();
  }

  /**
   * Opens or closes the mobile add contact dialog based on current state
   */
  openMobileAddContactDialog() {
    if (this.isDialogOpen) {
      this.closeDialogRequested.emit();
    } else {
      this.addContactRequested.emit();
    }
  }

  /**
   * Gets initials from a contact name
   * @param name - The contact name
   * @returns The initials string
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
  }

  /**
   * Gets a random color for the contact avatar
   * @param name - The contact name
   * @returns A color string
   */
  getRandomColor(name: string): string {
    return getRandomColor(name);
  }

  /**
   * Gets the first letter of a name
   * @param name - The contact name
   * @returns The first letter
   */
  getFirstLetter(name: string) {
    return name.charAt(0);
  }

  /**
   * Handles contact selection
   * @param contactId - The ID of the selected contact
   */
  selectContact(contactId: string | undefined) {
    if (contactId !== undefined) {
      localStorage.setItem('selectedContactId', contactId);
      this.contactSelected.emit(contactId);
    }
  }
}
