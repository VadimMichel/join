import { Component, Output, EventEmitter } from '@angular/core';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  @Output() contactSelected = new EventEmitter<string>();
  @Output() addContactRequested = new EventEmitter<void>();

  constructor(
    public contactDataService: ContactDataService
  ) {}

  openContactDetail(contactId: string) {
    this.contactSelected.emit(contactId);
  }

  openAddContactDialog() {
    this.addContactRequested.emit();
  }
}
