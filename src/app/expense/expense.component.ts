import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../../models/categories/category-model';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { ExpenseModel } from '../../models/expenses/expense-model';
import { LocalStorage } from '../../../node_modules/@ngx-pwa/local-storage';
import { UserFirebaseServiceProvider } from '../../services';
import { UserModel } from '../../models';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  private shareToken: string;
  formData: any = {};
  loader: any;
  categories: CategoryModel[] = [];
  isTransferExpense: boolean = false;
  isNegativeExpense: boolean = false;
  transferToGuidId = '';
  incomeUsed = 0;
  incomeLeft = 0;

  modelToSave: ExpenseModel = undefined;

  constructor(private _snackBarService: MatSnackBar, private _router: Router, protected secureLocalStorage: LocalStorage,
    private _activatedRoute: ActivatedRoute, private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider,
    private userFirebaseServiceProvider: UserFirebaseServiceProvider,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider) {

      this.secureLocalStorage.getItem('shareToken').subscribe((res) => {
        this.shareToken = res;
      }, (err) => {
        this._router.navigate(['/login']);
      });
     }

  ngOnInit() {
    // localStorage.setItem('budgetYear', '2018');
    // localStorage.setItem('budgetMonth', 'April');
    // localStorage.setItem('budgetIncome', '50000');

    this.loadData();
  }

  canExpenseBeNegative() {
    if (this.isTransferExpense) {
      this.isNegativeExpense = false;
      return false;
    }

    if (this.formData.expenseValue === '') {
      this.isNegativeExpense = false;
      return false;
    }
    return true;
  }

  isTransferClick(isTransfer) {
    if (isTransfer) {
      this.isNegativeExpenseClicked(false);
    }
  }
  isNegativeExpenseClicked(isNegative) {
    if (!isNegative && this.formData.expenseValue < 0) {
      return;
    }
    this.formData.expenseValue = this.formData.expenseValue * -1;
  }

  getCategoryPlaceholder() {
    if (this.isTransferExpense) {
      return 'Transfer from';
    }
    return 'Category';
  }

  getNewGuid(): string {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  buildEmptyModel() {

  }

  loadData() {
    this.categoryFirebaseServiceProvider.getAll((e) => this.getAllCallback(e));
  }

  getAllCallback(result: SqliteCallbackModel) {

    if (result.success) {
      this.categories = result.data;
      this.buildEmptyModel();

      // Buid Empty Model
      this.secureLocalStorage.getItem('budgetIncome').subscribe((res) => {
        this.formData.income = res;

        this.formData.id = 0;
        // tslint:disable-next-line:radix
        this.formData.year = parseInt(localStorage.getItem('budgetYear'));
        this.formData.month = localStorage.getItem('budgetMonth');
        // this.formData.income = parseFloat(localStorage.getItem('budgetIncome'));
        this.formData.categoryGuidId = '';
        this.formData.expenseValue = '';
        this.formData.expenseCode = '';
        this.formData.comment = '';
        this.formData.inSync = false;

        // Get sum in period
        this.expenseFirebaseServiceProvider.getSumInPeriod(this.formData.year, this.formData.month, (e) => this.getSumInPeriodCallback(e));
      });

      return;
    }
    this._snackBarService.open('Error retrieving data', undefined, { duration: 3000 });

  }

  getSumInPeriodCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this.incomeUsed = result.data;
      this.incomeLeft = this.formData.income - this.incomeUsed;
    }
  }

  saveClick() {

    if (!this.isTransferExpense) {
      this.modelToSave = {
        // tslint:disable-next-line:radix
        year: parseInt(localStorage.getItem('budgetYear')),
        month: localStorage.getItem('budgetMonth'),
        categoryGuidId: this.formData.categoryGuidId,
        guidId: this.getNewGuid(),
        expenseValue: this.formData.expenseValue,
        comment: this.formData.comment,
        recordDate: new Date().toString(),
        expenseCode: this.getNewExpenseCode(),
        shareToken: this.shareToken
      };
    } else {
      let eValue = Number((-1) * this.formData.expenseValue);
      // console.log(eValue);
      this.modelToSave = {
        // tslint:disable-next-line:radix
        year: parseInt(localStorage.getItem('budgetYear')),
        month: localStorage.getItem('budgetMonth'),
        categoryGuidId: this.formData.categoryGuidId,
        guidId: this.getNewGuid(),
        expenseValue: eValue,
        comment: this.formData.comment,
        recordDate: new Date().toString(),
        expenseCode: this.getNewExpenseCode(),
        shareToken: this.shareToken
      };
    }
    this.saveExpense();
  }

  saveExpense() {
    this.saveExpenseToSql();
  }

  saveExpenseToSql() {
    this.expenseFirebaseServiceProvider.insertRecord(this.modelToSave, (e) => this.insertExpenseTableCallback(e));
    if (this.isTransferExpense) {
      this.saveTransfer();
      return;
    } else {
      // console.log('clearScreen');
      this.clearScreen();
      // this._router.navigate(['/expense']);
    }
  }

  insertExpenseTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this._snackBarService.open('Expense uploaded successfully', undefined, { duration: 3000 });
      this.updateUserActivityToSql();
      return;
    }
    this._snackBarService.open('Error uploading expense', undefined, { duration: 3000 });
    // alert(JSON.stringify(result.data));
  }

  getNewExpenseCode(): string {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  disableSaveButton() {
    if (this.formData.categoryGuidId === undefined || this.formData.categoryGuidId === null
      || this.formData.categoryGuidId === 0 || this.formData.categoryGuidId === '' ||
      this.formData.expenseValue === undefined || this.formData.expenseValue === null
      || this.formData.expenseValue === 0 || this.formData.expenseValue === '') {
      return true;
    }

    if (this.isTransferExpense && this.transferToGuidId === '') {
      return true;
    }

    if (this.isTransferExpense && this.transferToGuidId === this.formData.guidId) {
      return true;
    }

    return false;
  }

  saveTransfer() {

    this.secureLocalStorage.getItem('shareToken').subscribe((res) => {
      this.modelToSave = {
        // tslint:disable-next-line:radix
        year: parseInt(localStorage.getItem('budgetYear')),
        month: localStorage.getItem('budgetMonth'),
        categoryGuidId: this.transferToGuidId,
        guidId: this.getNewGuid(),
        expenseValue: this.formData.expenseValue,
        comment: this.formData.comment,
        recordDate: new Date().toString(),
        expenseCode: this.getNewExpenseCode(),
        shareToken: res
      };
      this.saveTransferToSql();

    }, (err) => {
      this._router.navigate(['/login']);
    });
  }

  saveTransferToSql() {
    this.expenseFirebaseServiceProvider.insertRecord(this.modelToSave, (e) => this.transferToExpenseTableCallback(e));
    this.clearScreen();
  }

  transferToExpenseTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this._snackBarService.open('Transfer uploaded successfully', undefined, { duration: 3000 });
      return;
    }
    this._snackBarService.open('Error uploading transfer', undefined, { duration: 3000 });
    // alert(JSON.stringify(result.data));
  }

  // forecastClick() {
  //   let obj = {
  //     incomeLeft: this.incomeLeft
  //   };
  //   this._router.navigate(['/forecast/' + this.incomeLeft]);
  // }

  forecastClick() {
    let obj = {
      incomeLeft: this.incomeLeft
    };
    this._router.navigate(['/forecast']);
  }

  clearScreen() {
    this.formData.categoryGuidId = '';
    this.formData.expenseValue = '';
    this.formData.expenseCode = '';
    this.formData.comment = '';
    this.formData.categoryGuidId = undefined;
    this.transferToGuidId = undefined;
    this.loadData();
  }

  updateUserActivityToSql() {
    this.secureLocalStorage.getItem('userGuidId').subscribe((stRes) => {
      let userGuidId = stRes;
      this.userFirebaseServiceProvider.getRecord(userGuidId, (e) => this.getUserCallback(e));
    });
  }

  getUserCallback(result: SqliteCallbackModel) {
    if (result.success) {
      let model: UserModel = result.data;
      model.lastActive = new Date().toString();

      this.userFirebaseServiceProvider.updateRecord(model,  (e) => this.updateUserCallback(e));
      return;
    }
  }

  updateUserCallback(result: SqliteCallbackModel) {
    if (result.success) {
      return;
    }
  }
}
