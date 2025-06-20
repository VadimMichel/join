import { Component } from '@angular/core';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  constructor(
    public contactDataService: ContactDataService,
    private router: Router
  ) {}

  openContactDetail(contactId: string) {
    this.router.navigate(['/contacts', contactId]);
  }
}
