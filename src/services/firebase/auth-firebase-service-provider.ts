import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from '@firebase/auth-types';

@Injectable()
export class AuthFirebaseServiceProvider {
    // https://www.youtube.com/watch?v=-GjF9pSeFTs
    // https://www.youtube.com/watch?v=-OKrloDzGpU
    // https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/

    // users
    // Category
    // Expense,

    constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

    loginWithEmailPassword(email, password, callbackMethod) {
        const promise = this.afAuth.auth.signInWithEmailAndPassword(email, password);
        promise.then((res) => {
            callbackMethod({ success: true, data: res });
        });
        promise.catch((error) => {
            callbackMethod({ success: false, data: error });
        });

    }

    logout(callbackMethod) {
        const promise = this.afAuth.auth.signOut();
        promise.then((res) => {
            callbackMethod({ success: true, data: res });
        });
        promise.catch((error) => {
            callbackMethod({ success: false, data: error });
        });
    }

    createUserWithEmailPassword(email, password, callbackMethod) {
        const promise = this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        promise.then((res) => {
            callbackMethod({ success: true, data: res });
        });
        promise.catch((error) => {
            callbackMethod({ success: false, data: error });
        });
    }

    authStateChange(callbackMethod) {
        let observable = this.afAuth.authState;
        let subscription = observable.subscribe((res) => {
            callbackMethod({ success: false, data: res });
        });
    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    private oAuthLogin(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                this.updateUserData(credential.user);
            });
    }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return userRef.set(data, { merge: true });
  }
}
