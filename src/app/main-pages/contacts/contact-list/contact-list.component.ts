import { Component, Output, EventEmitter, OnInit } from '@angular/core';
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
  @Output() contactSelected = new EventEmitter<string>();
  @Output() addContactRequested = new EventEmitter<void>();

  alphabet: string[] = [];
  isSelected: boolean = false;
  selectedContactId: string | null = null;

  constructor(public contactDataService: ContactDataService) {}
  ngOnInit(): void {
    for (let i = 65; i <= 90; i++) {
      this.alphabet.push(String.fromCharCode(i));
    }
  }

  openContactDetail(contactId: string) {
    this.contactSelected.emit(contactId);
  }

  openAddContactDialog() {
    this.addContactRequested.emit();
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
