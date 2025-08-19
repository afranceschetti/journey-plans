import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  loadUsers() {
    console.debug("FirestoreService.loadUser");
    return getDocs(query(collection(this.firestore, 'users')));
  }

  loadUser(email: string) {
    console.debug("FirestoreService.loadUser");
    return getDocs(query(collection(this.firestore, 'users'), where("email", "==", email)));
  }

  saveUser(user: User) {
    console.debug("FirestoreService.saveUser - user", user);
    if (user.docId)
      return setDoc(doc(collection(this.firestore, 'users'), user.docId), User.cleanBeforeUpdate(user));
    else
      return setDoc(doc(collection(this.firestore, 'users')), User.cleanBeforeUpdate(user));
  }
}
