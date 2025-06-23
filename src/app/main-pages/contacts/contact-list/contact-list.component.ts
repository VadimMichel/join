import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';
import { getRandomColor } from '../../../shared/color-utils';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnInit{
  @Output() contactSelected = new EventEmitter<string>();
  @Output() addContactRequested = new EventEmitter<void>();

   alphabet: string[] = [];

  constructor(
    public contactDataService: ContactDataService
  ) {}
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
      .split(' ') // Split the name into words
      .map(word => word.charAt(0)) // Get the first character of each word
      .join(''); // Join the characters to form initials
  }

  getRandomColor(name: string): string {
    return getRandomColor(name); // Use the shared utility function
  }

  getfirstletter(name:string){
    return name.charAt(0);
  }
}
