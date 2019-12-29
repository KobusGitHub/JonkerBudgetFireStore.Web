import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '../../../node_modules/@ngx-pwa/local-storage';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { UserFirebaseServiceProvider } from '../../services';
import { TdDialogService } from '../../../node_modules/@covalent/core';
import { UserModel } from '../../models';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'];

  selectedMonth = '';
  selectedYear = '1900';
  income: number = 0;
  shareToken = '';
  storeIncome: boolean = false;
  userGuidId = '';
  userModel: UserModel = new UserModel();

  constructor(private _snackBarService: MatSnackBar,
    private userFirebaseService: UserFirebaseServiceProvider
    , private _router: Router, protected secureLocalStorage: LocalStorage,
    private _activatedRoute: ActivatedRoute) {
    // tslint:disable-next-line:radix
    this.selectedYear = localStorage.getItem('budgetYear');
    this.selectedMonth = localStorage.getItem('budgetMonth');

    // this.income = parseFloat(localStorage.getItem('budgetIncome'));
    this.secureLocalStorage.getItem('budgetIncome').subscribe((res) => {
      this.income = res;
    });

    this.secureLocalStorage.getItem('userGuidId').subscribe((res) => {
      this.userGuidId = res;
      this.userFirebaseService.getRecord(this.userGuidId, (e) => this.getRecordCallback(e));
    });

    this.secureLocalStorage.getItem('shareToken').subscribe((res) => {
      this.shareToken = res;
    }, (err) => {
      this._router.navigate(['/login']);
    });
  }

  ngOnInit() {
  }

  getRecordCallback(callback: SqliteCallbackModel) {
    if (callback.success) {
      this.userModel = callback.data;
      if (this.userModel.budget === 0) {
        this.storeIncome = false;
      } else {
        this.storeIncome = true;
      }
      return;
    }

    this._snackBarService.open('Error getting user', '', {
      duration: 2000
    });
  }

  isSaveDisabled() {

    if (!this.selectedYear || this.selectedYear.toString() === '') {
      return true;
    }

    if (!this.selectedMonth || this.selectedMonth.toString() === '') {
      return true;
    }

    if (!this.income || this.income.toString() === '') {
      return true;
    }

    if (!this.shareToken || this.shareToken.toString() === '') {
      return true;
    }

    return false;
  }

  saveClick() {
    localStorage.setItem('budgetMonth', this.selectedMonth);
    localStorage.setItem('budgetYear', this.selectedYear.toString());

    this.secureLocalStorage.setItem('budgetIncome', this.income).subscribe((res) => {
      localStorage.setItem('isIncomeSetup', 'true');

      localStorage.setItem('category-group-report-month', this.selectedMonth);
      localStorage.setItem('category-group-report-year', this.selectedYear.toString());
      localStorage.setItem('expense-report-month', this.selectedMonth);
      localStorage.setItem('expense-report-year', this.selectedYear.toString());

      if (this.storeIncome === true) {
        this.userModel.budget = this.income;
      } else {
        this.userModel.budget = 0;
      }
      this.userFirebaseService.updateRecord(this.userModel, (e) => this.updateUserCallback(e));

    }, (err) => { });

  }

  updateUserCallback(callback: SqliteCallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong updating user! Please contact your Administrator', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('Saved Successfully', undefined, { duration: 3000 });
    this._router.navigate(['/']);

  }

  generateShareTokenClick() {
    this.shareToken = this.getNewExpenseCode();
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

}
