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

  constructor(
    public contactDataService: ContactDataService
  ) {}

  openContactDetail(contactId: string) {
    this.contactSelected.emit(contactId);
  }
}
