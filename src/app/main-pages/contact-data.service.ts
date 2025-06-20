import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactDataService {

  firestore = inject(Firestore);
  items$ = collectionData(this.getContactRef());

  constructor() { }

  getContactRef(){
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(colId:string, docId:string){
    return doc(collection(this.firestore, colId), docId)
  }

}
