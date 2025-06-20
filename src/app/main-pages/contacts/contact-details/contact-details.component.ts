import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent implements OnInit, OnChanges {
  @Input() contactId: string | null = null;
  @Input() showBackButton: boolean = true;
  @Output() editContactRequested = new EventEmitter<any>();
  @Output() deleteContactRequested = new EventEmitter<string>();
  
  contact$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public contactDataService: ContactDataService
  ) {}

  ngOnInit() {
    // If contactId is not provided as input, get it from route params
    if (!this.contactId) {
      this.contactId = this.route.snapshot.params['id'];
    }
    
    if (this.contactId) {
      this.loadContact();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactId'] && this.contactId) {
      this.loadContact();
    }
  }

  private loadContact() {
    if (this.contactId) {
      this.contact$ = this.contactDataService.getContactById(this.contactId);
    }
  }

  goBack() {
    this.router.navigate(['/contacts']);
  }

  editContact(contact: any) {
    this.editContactRequested.emit(contact);
  }

  deleteContact(contactId: string) {
    if (confirm('Sind Sie sicher, dass Sie diesen Kontakt löschen möchten?')) {
      this.deleteContactRequested.emit(contactId);
    }
  }
}
