import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contacts } from '../../../contacts-interface';
import { getRandomColor } from '../../../../shared/color-utils';
import { ContactDataService } from '../../../contact-data.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() editingContact: Contacts | null = null;
  @Output() contactSubmitted = new EventEmitter<Contacts>();
  @Output() formCancelled = new EventEmitter<void>();

  contactForm: FormGroup;
  contactDataService = inject(ContactDataService);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]],
    });
  }

  /**
   * Initializes the form with prefilled data if editing
   */
  ngOnInit() {
    this.prefillForm();
  }

  /**
   * Handles changes to the editing contact input
   * @param changes - The changes to component inputs
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingContact'] && !changes['editingContact'].firstChange) {
      this.prefillForm();
    }
  }

  /**
   * Prefills the form with existing contact data or resets it
   */
  private prefillForm() {
    if (this.editingContact) {
      this.contactForm.patchValue({
        name: this.editingContact.name || '',
        email: this.editingContact.email || '',
        phone: this.editingContact.phone || '',
      });
    } else {
      this.contactForm.reset();
    }
  }

  /**
   * Checks if a form field is invalid and should show errors
   * @param fieldName - The name of the field to check
   * @returns True if field is invalid and should show errors
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Handles form submission for creating or updating contacts
   */
  onSubmit() {
    if (this.contactForm.valid) {
      this.submitValidForm();
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  /**
   * Submits a valid form with contact data
   */
  private submitValidForm() {
    const contactData: Contacts = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      phone: this.contactForm.value.phone || '',
    };

    if (this.editingContact) {
      contactData.id = this.editingContact.id;
    }

    this.contactSubmitted.emit(contactData);
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markAllFieldsAsTouched() {
    Object.keys(this.contactForm.controls).forEach((key) => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Deletes the current contact via ContactDataService
   */
  async deleteContact() {
    if (this.editingContact?.id) {
      try {
        await this.contactDataService.deleteContact(this.editingContact.id);
        this.formCancelled.emit();
      } catch (error) {
        console.error('Error:', error);
        alert('Error. Cannot delete contact.');
      }
    }
  }

  /**
   * Handles form cancellation
   */
  onCancel() {
    this.formCancelled.emit();
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
}
