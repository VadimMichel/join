import { Firestore, collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc, QuerySnapshot, DocumentSnapshot } from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactDataService {

  firestore = inject(Firestore);
  unsubList: (() => void) | undefined;
  contactlist: any[] = [];
  
  // Add BehaviorSubject for reactive updates
  private contactsSubject = new BehaviorSubject<any[]>([]);
  public contacts$ = this.contactsSubject.asObservable();

  constructor() {
    this.unsubList = onSnapshot(this.getContactRef(), (snapshot: QuerySnapshot) => {
      this.contactlist = [];
      snapshot.forEach((doc) => {
        // Include the id in the contact data
        this.contactlist.push({ ...doc.data(), id: doc.id });
        console.log(doc.data());
      });
      // Emit the updated list to subscribers
      this.contactsSubject.next(this.contactlist);
    }, (error: any) => {
      console.error('Error listening to contacts:', error);
    });
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
