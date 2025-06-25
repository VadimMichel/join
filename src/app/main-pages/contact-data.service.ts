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
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contacts } from './contacts-interface';

interface FirebaseContact {
  name: string;
  email: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactDataService {
  firestore = inject(Firestore);
  unsubList: () => void;
  contactlist:{letter:string; contacts: Contacts[]}[]  = [];

  constructor() {
    this.unsubList = onSnapshot(this.getContactRef(), (list) => {
      this.contactlist = [];
      for (let i = 65; i <= 90; i++) {
        this.contactlist.push({
        letter:String.fromCharCode(i),
        contacts: []
        });
      }
      list.forEach((element) => {
        let contact = this.setContactObject(element.data(), element.id);
        let firstLetter = contact.name.charAt(0).toUpperCase();
        let index = this.contactlist.findIndex(singleContact => singleContact.letter === firstLetter);
        if (index !== -1) {
          this.contactlist[index].contacts.push(contact);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.unsubList) {
      this.unsubList();
    }
  }

  getContactRef() {
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  setContactObject(obj: DocumentData, id: string): Contacts {
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
    try {
      await addDoc(this.getContactRef(), contactData);
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }

  async deleteContact(contactId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'contacts', contactId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  async updateContact(contactData: Contacts) {
    if (contactData.id) {
      let docRef = this.getSingleDocRef('contacts', contactData.id);
      await updateDoc(docRef, this.getCleanJson(contactData))
        .catch((err) => {
          console.error('Error updating contact:', err);
        })
        .then();
    }
  }

  getCleanJson(contact: Contacts): Omit<Contacts, 'id'> & { id?: string } {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
  }
}
