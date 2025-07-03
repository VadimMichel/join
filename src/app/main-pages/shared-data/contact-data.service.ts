import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { Contacts } from './../contacts-interface';

@Injectable({
  providedIn: 'root',
})
export class ContactDataService {
  // firestore = inject(Firestore);
 private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector); 
  
  unsubList!: () => void;
  contactlist:{letter:string; contacts: Contacts[]}[]  = [];
  
  private selectedContactIdSubject = new BehaviorSubject<string | null>(null);
  selectedContactId$ = this.selectedContactIdSubject.asObservable();

  /**
   * Initializes the ContactDataService and sets up Firebase listeners
   */
  constructor() {
    this.initializeContactList();
  }

  /**
   * Sets up the Firebase listener for contact list updates
   */
  private initializeContactList() {
    this.unsubList = onSnapshot(this.getContactRef(), (list) => {
      this.resetContactList();
      this.processContactList(list);
    });
  }

  /**
   * Resets the contact list with alphabetical structure
   */
  private resetContactList() {
    this.contactlist = [];
    for (let i = 65; i <= 90; i++) {
      this.contactlist.push({
        letter: String.fromCharCode(i),
        contacts: []
      });
    }
  }

  /**
   * Processes the Firebase contact list and organizes by letter
   * @param list - Firebase snapshot list
   */
  private processContactList(list: QuerySnapshot<DocumentData>): void {
    list.forEach((element: QueryDocumentSnapshot<DocumentData>) => {
      const contact = this.setContactObject(element.data(), element.id);
      const firstLetter = contact.name.charAt(0).toUpperCase();
      const index = this.contactlist.findIndex(singleContact => singleContact.letter === firstLetter);
      if (index !== -1) {
        this.contactlist[index].contacts.push(contact);
        this.contactlist[index].contacts.sort((a, b) => a.name.localeCompare(b.name));
      }
    });
  }

  /**
   * Sets the selected contact ID in the behavior subject
   * @param contactId - The contact ID to select
   */
  setSelectedContactId(contactId: string | null) {
    this.selectedContactIdSubject.next(contactId);
  }

  /**
   * Gets the current selected contact ID
   * @returns The currently selected contact ID or null
   */
  getSelectedContactId(): string | null {
    return this.selectedContactIdSubject.getValue();
  }

  /**
   * Cleans up Firebase listeners on component destruction
   */
  ngOnDestroy() {
    if (this.unsubList) {
      this.unsubList();
    }
  }

  /**
   * Gets the Firebase contacts collection reference
   * @returns Firebase collection reference for contacts
   */
  getContactRef(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'contacts');
  }

  /**
   * Gets a single document reference
   * @param colId - Collection ID
   * @param docId - Document ID
   * @returns Firebase document reference
   */
  getSingleDocRef(colId: string, docId: string): DocumentReference<DocumentData> {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * Creates a contact object from Firebase document data
   * @param obj - Firebase document data
   * @param id - Document ID
   * @returns Contacts object
   */
  setContactObject(obj: DocumentData, id: string): Contacts {
    return {
      id: id || '',
      name: obj['name'] as string,
      email: obj['email'] as string,
      phone: obj['phone'] as string || '',
    };
  }

  /**
   * Gets a contact by ID as an observable
   * @param id - Contact ID to find
   * @returns Observable of contact or null
   */
  getContactById(id: string): Observable<Contacts | null> {
    return new Observable<Contacts | null>((observer) => {
      const findAndEmitContact = this.createContactFinder(id, observer);
      return this.setupContactObserver(findAndEmitContact);
    });
  }

  /**
   * Creates a contact finder function
   * @param id - Contact ID to find
   * @param observer - Observable observer
   * @returns Contact finder function
   */
  private createContactFinder(id: string, observer: Observer<Contacts | null>) {
    return () => {
      const contact = this.findContactInList(id);
      observer.next(contact || null);
    };
  }

  /**
   * Finds a contact in the contact list
   * @param id - Contact ID to find
   * @returns Contact or undefined
   */
  private findContactInList(id: string): Contacts | undefined {
    for (const group of this.contactlist) {
      const contact = group.contacts.find(c => c.id === id);
      if (contact) return contact;
    }
    return undefined;
  }

  /**
   * Sets up the contact observer with interval
   * @param findAndEmitContact - Function to find and emit contact
   * @returns Cleanup function
   */
  private setupContactObserver(findAndEmitContact: () => void) {
    findAndEmitContact();
    const intervalId = setInterval(findAndEmitContact, 300);
    return () => clearInterval(intervalId);
  }

  /**
   * Adds a new contact to Firebase
   * @param contactData - Contact data to add
   */
async addContact(contactData: Contacts): Promise<void> {
  try {
    await runInInjectionContext(this.injector, () => 
      addDoc(this.getContactRef(), contactData)
    );
  } catch (error: unknown) {
    console.error('Error adding contact:', error);
    throw error;
  }
}


  /**
   * Deletes a contact from Firebase
   * @param contactId - ID of contact to delete
   */
  async deleteContact(contactId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'contacts', contactId);
      await deleteDoc(docRef);
    } catch (error: unknown) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  /**
   * Updates an existing contact in Firebase
   * @param contactData - Updated contact data
   */
  async updateContact(contactData: Contacts): Promise<void> {
    if (contactData.id) {
      const docRef = this.getSingleDocRef('contacts', contactData.id);
      try {
        await updateDoc(docRef, this.getCleanJson(contactData));
      } catch (err: unknown) {
        console.error('Error updating contact:', err);
        throw err;
      }
    }
  }

  /**
   * Cleans contact object for Firebase storage
   * @param contact - Contact object to clean
   * @returns Clean contact object
   */
  getCleanJson(contact: Contacts): Omit<Contacts, 'id'> & { id?: string } {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
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
