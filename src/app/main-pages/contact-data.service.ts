import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  QuerySnapshot,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contacts } from './contacts-interface';

@Injectable({
  providedIn: 'root',
})
export class ContactDataService {
  firestore = inject(Firestore);
  unsubList;
  contactlist: Contacts[] = [];

  constructor() {
    this.unsubList = onSnapshot(this.getContactRef(), (list) => {
      this.contactlist = [];
      list.forEach((element) => {
        this.contactlist.push(
          this.setContactObject(element.data(), element.id)
        );
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

  setContactObject(obj: any, id: string): Contacts {
    return {
      id: id || '',
      name: obj.name,
      email: obj.email,
      phone: obj.phone,
    };
  }

  getContactById(id: string): Observable<Contacts | null> {
    return new Observable<Contacts | null>((observer) => {
      const findAndEmitContact = () => {
        const contact = this.contactlist.find((c) => c.id === id);
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

  getCleanJson(contact: Contacts): {} {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
  }
}
