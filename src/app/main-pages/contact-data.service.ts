import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactDataService {

  firestore = inject(Firestore);
  unsubList;
  contactlist: any[] = [];

  constructor() {
    this.unsubList = onSnapshot(this.getContactRef(), (list) => {
      this.contactlist = [];
      list.forEach(element => {
      this.contactlist.push(element.data())
      console.log(element.data())
      })
    })
  }

  ngonDestroy(){
    this.unsubList();
  }

  getContactRef(){
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(colId:string, docId:string){
    return doc(collection(this.firestore, colId), docId)
  }

}
