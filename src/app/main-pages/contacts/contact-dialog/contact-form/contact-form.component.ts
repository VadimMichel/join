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

  ngOnInit() {
    this.prefillForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingContact'] && !changes['editingContact'].firstChange) {
      this.prefillForm();
    }
  }

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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Include the contact ID if we're editing
  // Mark all fields as touched to show validation errors
  onSubmit() {
    if (this.contactForm.valid) {
      const contactData: Contacts | undefined = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone || '',
      };

      if (this.editingContact) {
        contactData.id = this.editingContact.id;
      }

      this.contactSubmitted.emit(contactData);
    } else {
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  // delete contact via ContactDataService
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

  onCancel() {
    this.formCancelled.emit();
  }

  getRandomColor(name: string): string {
    return getRandomColor(name);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
  }
}
