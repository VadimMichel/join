import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  DocumentData,
} from '@angular/fire/firestore';
import { Injectable, OnDestroy, inject, NgZone, Injector, runInInjectionContext } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contacts } from './contacts-interface';
import { ErrorHandlerService } from '../shared/error-handler.service';

interface FirebaseContact {
  name: string;
  email: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactDataService implements OnDestroy {
  private firestore!: Firestore;
  private errorHandler!: ErrorHandlerService;
  private ngZone = inject(NgZone);
  private injector = inject(Injector);
  private unsubList: (() => void) | null = null;
  contactlist: {letter: string; contacts: Contacts[]}[] = [];
  
  // Add a BehaviorSubject to track the selected contact ID
  private selectedContactIdSubject = new BehaviorSubject<string | null>(null);
  selectedContactId$ = this.selectedContactIdSubject.asObservable();
  
  private isInitialized = false;

  constructor() {
    // Initialize alphabet structure immediately
    this.initializeAlphabet();
    
    // Initialize dependencies in injection context
    runInInjectionContext(this.injector, () => {
      this.firestore = inject(Firestore);
      this.errorHandler = inject(ErrorHandlerService);
    });
  }

  private initializeAlphabet() {
    this.contactlist = [];
    for (let i = 65; i <= 90; i++) {
      this.contactlist.push({
        letter: String.fromCharCode(i),
        contacts: []
      });
    }
  }

  // Call this method from a component after Angular is fully initialized
  initializeFirestore() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    runInInjectionContext(this.injector, () => {
      try {
        this.unsubList = onSnapshot(
          collection(this.firestore, 'contacts'),
          (list) => {
            this.ngZone.run(() => {
              this.initializeAlphabet();
              list.forEach((element) => {
                let contact = this.setContactObject(element.data(), element.id);
                let firstLetter = contact.name.charAt(0).toUpperCase();
                let index = this.contactlist.findIndex(singleContact => singleContact.letter === firstLetter);
                if (index !== -1) {
                  this.contactlist[index].contacts.push(contact);
                }
              });
            });
          },
          (error) => {
            this.ngZone.run(() => {
              this.errorHandler.handleFirebaseError(error, 'snapshot listener');
            });
          }
        );
      } catch (error) {
        this.ngZone.run(() => {
          this.errorHandler.handleFirebaseError(error, 'initializing listener');
        });
      }
    });
  }

  // Method to set the selected contact ID
  setSelectedContactId(contactId: string | null) {
    this.selectedContactIdSubject.next(contactId);
  }
  
  // Method to get the current selected contact ID
  getSelectedContactId(): string | null {
    return this.selectedContactIdSubject.getValue();
  }

  ngOnDestroy() {
    if (this.unsubList) {
      this.unsubList();
    }
  }

  private setContactObject(obj: DocumentData, id: string): Contacts {
    return {
      id: id || '',
      name: obj['name'] as string,
      email: obj['email'] as string,
      phone: obj['phone'] as string || '',
    };
  }

  getContactById(id: string): Observable<Contacts | null> {
    return new Observable<Contacts | null>((observer) => {
      const findAndEmitContact = () => {
        let contact: Contacts | undefined;

        for (const group of this.contactlist) {
          contact = group.contacts.find(c => c.id === id);
          if (contact) break;
        }

        observer.next(contact || null);
      };

      findAndEmitContact();
      const intervalId = setInterval(findAndEmitContact, 300);

      return () => clearInterval(intervalId);
    });
  }

  async addContact(contactData: Contacts): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        await addDoc(collection(this.firestore, 'contacts'), contactData);
      } catch (error) {
        this.errorHandler.handleFirebaseError(error, 'add contact');
        throw error;
      }
    });
  }

  async deleteContact(contactId: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        const docRef = doc(this.firestore, 'contacts', contactId);
        await deleteDoc(docRef);
      } catch (error) {
        this.errorHandler.handleFirebaseError(error, 'delete contact');
        throw error;
      }
    });
  }

  async updateContact(contactData: Contacts) {
    if (contactData.id) {
      return runInInjectionContext(this.injector, async () => {
        try {
          let docRef = doc(this.firestore, 'contacts', contactData.id!);
          await updateDoc(docRef, this.getCleanJson(contactData));
        } catch (error) {
          this.errorHandler.handleFirebaseError(error, 'update contact');
          throw error;
        }
      });
    }
  }

  private getCleanJson(contact: Contacts): Omit<Contacts, 'id'> & { id?: string } {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
  }
}
