import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { getRandomColor } from '../../../shared/color-utils';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit, OnChanges {
  @Input() contactId: string | null = null;
  @Input() showBackButton: boolean = true;
  @Output() editContactRequested = new EventEmitter<any>();
  @Output() deleteContactRequested = new EventEmitter<string>();

  contact$!: Observable<any>;
  animated: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public contactDataService: ContactDataService
  ) {}

  ngOnInit() {
    if (!this.contactId) {
      this.contactId = this.route.snapshot.params['id'];
    }

    if (this.contactId) {
      this.loadContact();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactId'] && this.contactId) {
      this.resetAnimation();
      this.loadContact();
    }
  }

  private resetAnimation() {
    this.animated = false;
    setTimeout(() => {
      this.animated = true;
    }, 10);
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
      this.deleteContactRequested.emit(contactId);
  }

  getInitials(name: string): string {
    return name
      .split(' ') // Split the name into words
      .map((word) => word.charAt(0)) // Get the first character of each word
      .join(''); // Join the characters to form initials
  }

  getRandomColor(name: string): string {
    return getRandomColor(name); // Use the shared utility function
  }
}
