import { Firestore, collection, doc, collectionData, onSnapshot, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactDataService {

  firestore = inject(Firestore);
  items$ = collectionData(this.getContactRef(), { idField: 'id' });

  constructor() { }

  getContactRef(){
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(colId:string, docId:string){
    return doc(collection(this.firestore, colId), docId)
  }

  getContactById(id: string): Observable<any> {
    const docRef = doc(this.firestore, 'contacts', id);
    return docData(docRef, { idField: 'id' });
  }

  async addContact(contactData: any): Promise<void> {
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

  async updateContact(contactId: string, contactData: any): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'contacts', contactId);
      await updateDoc(docRef, contactData);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }
}
