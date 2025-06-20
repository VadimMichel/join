import { Firestore, collection, doc, collectionData, onSnapshot, docData } from '@angular/fire/firestore';
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
}
