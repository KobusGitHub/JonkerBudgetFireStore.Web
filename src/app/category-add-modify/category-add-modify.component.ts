import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { CategoryModel } from '../../models/categories/category-model';
import { MatSnackBar } from '@angular/material';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';

@Component({
  selector: 'app-category-add-modify',
  templateUrl: './category-add-modify.component.html',
  styleUrls: ['./category-add-modify.component.scss']
})
export class CategoryAddModifyComponent implements OnInit, OnDestroy {
  private subscriptions: any[] = [];
  private categoryGuidId: string;

  frmBudget: FormGroup;
  formData: any = {};
  isFavourite = false;
  modelToSave: CategoryModel = undefined;

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'];
  currentMonthText = '';
  currentMonthExpenses = 0;
  oneBackMonthText = '';
  oneBackMonthExpenses = 0;
  twoBackMonthText = '';
  twoBackMonthExpenses = 0;
  avarageExpenses = 0;
  showHistory = false;
  currentBudget = 0;

  constructor(private _snackBarService: MatSnackBar, private _router: Router, private _activatedRoute: ActivatedRoute, public builder: FormBuilder,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider,
    private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider) {
    this.frmBudget = builder.group({
      'frmCmpCategory': [{ value: '' }, Validators.required],
      'frmCmpBudget': [{ value: '' }, Validators.required]
    });

  }

  favouriteClick() {
    this.isFavourite = !this.isFavourite;
  }

  ngOnInit(): void {
    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.categoryGuidId = params['expenseGuidId'];
      if (this.categoryGuidId === '0') {
        this.categoryGuidId = '';
      }
      // alert(this.categoryGuidId);

      this.loadData();
    }));
  }

  loadData() {
    if (this.categoryGuidId === '') {
      this.buildEmptyModel();
      return;
    }

    this.categoryFirebaseServiceProvider.getRecord(this.categoryGuidId, (e) => this.getRecordCallback(e));
  }

  getRecordCallback(result: SqliteCallbackModel) {
    if (result.success) {
      // console.log(result.data);
      this.formData = result.data;
      this.currentBudget = result.data.budget;
      this.isFavourite = result.data.isFavourite;
      return;
    }
    alert('Error retrieving data');
  }

  buildEmptyModel() {
    this.formData.id = 0;
    this.formData.guidId = '';
    this.formData.categoryName = '';
    this.formData.budget = '';
    this.formData.isFavourite = false;
    this.formData.inSync = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

  }

  cancelClick() {
    this._router.navigate(['/categories']);
  }
  saveClick(frmCmps) {
    this.modelToSave = {
      guidId: this.formData.guidId,
      categoryName: frmCmps.frmCmpCategory,
      budget: frmCmps.frmCmpBudget,
      isFavourite: this.isFavourite,
      shareToken: localStorage.getItem('shareToken')
    };

    if (this.categoryGuidId === '') {
      this.modelToSave.guidId = this.getNewGuid();
    }
    this.saveCategoryToSql();
  }

  saveCategoryToSql() {
    if (this.categoryGuidId === '') {
      this.categoryFirebaseServiceProvider.insertRecord(this.modelToSave, (e) => this.insertBudgetSetupTableCallback(e));
      this._router.navigate(['/categories']);
    } else {
      this.categoryFirebaseServiceProvider.updateRecord(this.modelToSave, (e) => this.updateBudgetSetupTableCallback(e));
      this._router.navigate(['/categories']);
    }
  }

  insertBudgetSetupTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this._snackBarService.open('Insert category successfully', undefined, { duration: 3000 });
      return;
    }
    this._snackBarService.open('Error inserting category', undefined, { duration: 3000 });
  }

  updateBudgetSetupTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this._snackBarService.open('Updated category successfully', undefined, { duration: 3000 });

      return;
    }
    this._snackBarService.open('Error updating category', undefined, { duration: 3000 });
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

  backClick() {
    this.showHistory = false;
  }

  getHistoryData() {
    if (this.categoryGuidId === '') {
      this._snackBarService.open('Cannot generate history on new Category', undefined, { duration: 3000 });
      return;
    }
    this.showHistory = true;

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    this.currentMonthText = this.monthNames[currentMonth];

    let backOneDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    let backOneYear = backOneDate.getFullYear();
    let backOneMonth = backOneDate.getMonth() + 1;
    this.oneBackMonthText = this.monthNames[backOneMonth];

    let backTwoDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    let backTwoYear = backTwoDate.getFullYear();
    let backTwoMonth = backTwoDate.getMonth() + 1;
    this.twoBackMonthText = this.monthNames[backTwoMonth];

    this.currentMonthExpenses = 0;
    this.oneBackMonthExpenses = 0;
    this.twoBackMonthExpenses = 0;
    this.avarageExpenses = 0;

    this.expenseFirebaseServiceProvider.getAllInPeriod(currentYear.toString(), this.currentMonthText,
      (e) => this.getAllInCurrentPeriodCallback(e));

    this.expenseFirebaseServiceProvider.getAllInPeriod(backOneYear.toString(), this.oneBackMonthText,
      (e) => this.getAllInOneBackPeriodCallback(e));

    this.expenseFirebaseServiceProvider.getAllInPeriod(backTwoYear.toString(), this.twoBackMonthText,
      (e) => this.getAllInTwoBackPeriodCallback(e));

  }

  getAllInCurrentPeriodCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.currentMonthExpenses = 0;
    if (sqliteCallbackModel.success) {
      sqliteCallbackModel.data.forEach((rec) => {
        if (this.categoryGuidId === rec.categoryGuidId) {
          this.currentMonthExpenses = this.currentMonthExpenses + parseFloat(rec.expenseValue);
        }
      });
    }
    this.avarageExpenses = (this.currentMonthExpenses + this.oneBackMonthExpenses + this.twoBackMonthExpenses) / 3;
  }

  getAllInOneBackPeriodCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.oneBackMonthExpenses = 0;
    if (sqliteCallbackModel.success) {
      sqliteCallbackModel.data.forEach((rec) => {
        if (this.categoryGuidId === rec.categoryGuidId) {
          this.oneBackMonthExpenses = this.oneBackMonthExpenses + parseFloat(rec.expenseValue);
        }
      });
    }
    this.avarageExpenses = (this.currentMonthExpenses + this.oneBackMonthExpenses + this.twoBackMonthExpenses) / 3;
  }

  getAllInTwoBackPeriodCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.twoBackMonthExpenses = 0;
    if (sqliteCallbackModel.success) {
      sqliteCallbackModel.data.forEach((rec) => {
        if (this.categoryGuidId === rec.categoryGuidId) {
          this.twoBackMonthExpenses = this.twoBackMonthExpenses + parseFloat(rec.expenseValue);
        }
      });
    }
    this.avarageExpenses = (this.currentMonthExpenses + this.oneBackMonthExpenses + this.twoBackMonthExpenses) / 3;
  }
}
