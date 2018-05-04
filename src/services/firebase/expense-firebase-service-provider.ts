import { Injectable } from '@angular/core';
import { ExpenseModel } from '../../models/expenses/expense-model';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ExpenseFirebaseServiceProvider {
    // https://www.youtube.com/watch?v=-GjF9pSeFTs

    // users
    // Category
    // Expense,

    constructor(private db: AngularFirestore) { }

    public insertRecord(expenseModel: ExpenseModel, callbackMethod) {
        this.db.collection('expense').doc(expenseModel.guidId).set(expenseModel).then((docRef) => {
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
        let docRef = this.db.doc('expense/' + guidId);
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
        let collectionRef = this.db.collection('expense', (ref) => {
            return ref.where('shareToken', '==', localStorage.getItem('shareToken')).orderBy('recordDate');
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges()
            .map((changes) => {
                return changes.map((snap) => {
                    return snap.payload.doc.data() as ExpenseModel;
                });
            });
        let subscription = snapshot.subscribe((res) => {
            callbackMethod({ success: true, data: res });
        }, (err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public getAllForCategory(categoryGuidId: string, callbackMethod) {
        let collectionRef = this.db.collection('expense', (ref) => {
            return ref.where('shareToken', '==', localStorage.getItem('shareToken')).where('categoryGuidId', '==', categoryGuidId);
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges()
            .map((changes) => {
                return changes.map((snap) => {
                    return snap.payload.doc.data() as ExpenseModel;
                });
            });
        let subscription = snapshot.subscribe((res) => {
            callbackMethod({ success: true, data: res });
        }, (err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public updateRecord(expenseModel: ExpenseModel, callbackMethod) {
        let docRef = this.db.doc('expense/' + expenseModel.guidId);
        docRef.set(expenseModel).then((ok) => {
            callbackMethod({ success: true, data: ok });
        }).catch((err) => {
            callbackMethod({ success: false, data: err });
        });
    }
    public deleteRecord(id: number, callbackMethod) {
        this.deleteRecordByGuidId(id, callbackMethod);
    }
    public deleteRecordByGuidId(guidId, callbackMethod) {
        let docRef = this.db.doc('expense/' + guidId);
        docRef.delete().then((ok) => {
            callbackMethod({ success: true, data: ok });
        }).catch((err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public getSumInPeriod(year: number, month: string, callbackMethod) {
        let yearString = year.toString();

        let collectionRef = this.db.collection('expense', (ref) => {
            return ref.where('shareToken', '==', localStorage.getItem('shareToken'))
            // tslint:disable-next-line:radix
            .where('month', '==', month).where('year', '==', parseInt(yearString)).orderBy('recordDate');
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges()
            .map((changes) => {
                return changes.map((snap) => {
                    return snap.payload.doc.data() as ExpenseModel;
                });
            });
        let subscription = snapshot.subscribe((res) => {
            let expenseValue = 0;
            res.forEach((exp) => {
                expenseValue += Number(exp.expenseValue);
            });

            callbackMethod({ success: true, data: expenseValue });
        }, (err) => {
            callbackMethod({ success: false, data: err });
        });

    }
    public getAllInPeriod(year: string, month: string, callbackMethod) {
        let collectionRef = this.db.collection('expense', (ref) => {
            return ref.where('shareToken', '==', localStorage.getItem('shareToken')).where('month', '==', month)
            // tslint:disable-next-line:radix
            .where('year', '==', parseInt(year)).orderBy('recordDate');
        });
        let notes = collectionRef.valueChanges();
        let subscription = notes.subscribe((res) => {
            // tslint:disable-next-line:no-debugger
            callbackMethod({ success: true, data: res });
        }, (err) => {
           callbackMethod({ success: false, data: err });
        });
    }
}
