import { Firestore, collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc, QuerySnapshot, DocumentSnapshot } from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contacts } from './contacts-interface';

@Injectable({
  providedIn: 'root'
})
export class ContactDataService {

  firestore = inject(Firestore);
  unsubList;
  contactlist: Contacts[] = [];

  constructor() {

    this.unsubList = onSnapshot(this.getContactRef(), (list) => {
      this.contactlist = [];
        list.forEach(element => {
          this.contactlist.push(this.setContactObject(element.data(), element.id) )
        })
      })
  }

  ngOnDestroy(){
    if (this.unsubList) {
      this.unsubList();
    }
  }

  getContactRef(){
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(colId:string, docId:string){
    return doc(collection(this.firestore, colId), docId)
  }

  setContactObject(obj: any, id:string){
    return{
      id: id || '',
      name: obj.name,
      email: obj.email,
      phone: obj.phone 
    }    
  }

  getContactById(id: string): Observable<any> {
    return new Observable(observer => {
      const docRef = doc(this.firestore, 'contacts', id);
      
      const unsubscribe = onSnapshot(docRef, (doc: DocumentSnapshot) => {
        if (doc.exists()) {
          observer.next({ ...doc.data(), id: doc.id });
        } else {
          observer.next(null);
        }
      }, (error: any) => {
        observer.error(error);
      });

      // Return cleanup function
      return () => unsubscribe();
    });
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
