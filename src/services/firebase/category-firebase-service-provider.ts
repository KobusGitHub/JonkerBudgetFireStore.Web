import { Injectable } from '@angular/core';
import { CategoryModel } from '../../models/categories/category-model';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { LocalStorage } from '../../../node_modules/@ngx-pwa/local-storage';

@Injectable()
export class CategoryFirebaseServiceProvider {
    // https://www.youtube.com/watch?v=-GjF9pSeFTs

    // users
    // Category
    // Expense,

    constructor(protected secureLocalStorage: LocalStorage,
        private db: AngularFirestore) { }

    public insertRecord(categoryModel: CategoryModel, callbackMethod) {
        let dd = 6;
        this.db.collection('category').doc(categoryModel.guidId).set(categoryModel).then((docRef) => {
            // console.log(docRef);
            callbackMethod({ success: true, data: undefined });
        }).catch((error) => {
            // console.log(error);
            callbackMethod({ success: false, data: undefined });
        });
    }

    public getRecord(id, callbackMethod) {
        this.getRecordByGuidId(id, callbackMethod);
    }

    public getRecordByGuidId(guidId, callbackMethod) {
        let docRef = this.db.doc('category/' + guidId);
        let valueChangesSub = docRef.valueChanges();

        let subscription = valueChangesSub.subscribe((res) => {
            callbackMethod({ success: true, data: res });
            subscription.unsubscribe();
        }, (err) => {
            callbackMethod({ success: false, data: err });
            subscription.unsubscribe();
        });
    }

    public getAll(callbackMethod) {

        this.secureLocalStorage.getItem('shareToken').subscribe((stRes) => {
            let shareToken = stRes;

            // tslint:disable-next-line:no-debugger
            let categoryCollectionRef = this.db.collection('category', (ref) => {
                return ref.where('shareToken', '==', shareToken).orderBy('isFavourite', 'desc').orderBy('categoryName');
            });
            let notes = categoryCollectionRef.valueChanges();
            let subscription = notes.subscribe((res) => {
                // tslint:disable-next-line:no-debugger
                callbackMethod({ success: true, data: res });
            }, (err) => {
                callbackMethod({ success: false, data: err });
            });

        }, (err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public updateRecord(categoryModel: CategoryModel, callbackMethod) {
        let docRef = this.db.doc('category/' + categoryModel.guidId);
        docRef.set(categoryModel).then((ok) => {
            callbackMethod({ success: true, data: ok });
        }).catch((err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public deleteRecord(id, callbackMethod) {
        this.deleteRecordByGuidId(id, callbackMethod);
    }

    public deleteRecordByGuidId(guidId, callbackMethod) {
        let docRef = this.db.doc('category/' + guidId);
        docRef.delete().then((ok) => {
            callbackMethod({ success: true, data: ok });
        }).catch((err) => {
            callbackMethod({ success: false, data: err });
        });
    }
}
