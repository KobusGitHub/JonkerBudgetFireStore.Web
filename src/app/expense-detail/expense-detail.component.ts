import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { ExpenseModel } from '../../models/expenses/expense-model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit, OnDestroy  {
  private subscriptions: any[] = [];
  expenseGuidId = '';
  categories = undefined;
  record: any = {};
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  frmComment: FormGroup;
  formData: any = {};
  expenseModel: ExpenseModel;
  showEditForm = false;

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private _activatedRoute: ActivatedRoute, private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider, public builder: FormBuilder) { }

  ngOnInit() {
    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.expenseGuidId = params['expenseGuidId'];
      if (this.expenseGuidId === '0') {
        this.expenseGuidId = '';
      }
      // alert(this.categoryGuidId);

      this.frmComment = this.builder.group({
        'comment': [{ value: '' }]
      });

      this.loadData();
    }));
  }

  loadData() {
    this.categoryFirebaseServiceProvider.getAll((e) => this.getAllCategoriesCallback(e));
  }

  getAllCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel) {
    if (sqliteCallbackModel.success) {
      this.categories = sqliteCallbackModel.data;
      this.getExpense();
    }
  }

  getExpense() {

    this.expenseFirebaseServiceProvider.getRecord(this.expenseGuidId, (e) => this.getExpenseRecordCallback(e));

  }

  getExpenseRecordCallback(sqliteCallbackModel: SqliteCallbackModel) {
    if (sqliteCallbackModel.success) {
      let catName = '';
      let rec = sqliteCallbackModel.data;
      this.expenseModel = sqliteCallbackModel.data;

      this.categories.forEach((cat) => {
        if (cat.guidId === rec.categoryGuidId) {
          catName = cat.categoryName;
        }
      });

      let dt = new Date(rec.recordDate);

      this.record = {
        expenseGuidId: rec.guidId,
        category: catName,
        expenseValue: rec.expenseValue,
        comment: rec.comment,
        recordDate: dt.getDate() + ' ' + this.monthNames[(dt.getMonth())] + ' ' + dt.getFullYear()
      };

      this.frmComment.reset(this.record);
    }
  }

  goBack() {
    window.history.back();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

  }

  itemEdit(item: ExpenseModel) {
    this.showEditForm = true;
  }

  cancelClick() {
    this.showEditForm = false;
  }

  saveClick(frmCmps) {
    this.expenseModel.comment = this.frmComment.value.comment;
    this.expenseFirebaseServiceProvider.updateRecord(this.expenseModel, (e) => this.updateExpenseRecordCallback(e));
    this.cancelClick();
  }

  updateExpenseRecordCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this.record.comment = this.frmComment.value.comment;
      this._snackBarService.open('Expense edited successfully', undefined, { duration: 3000 });
      return;
    }
    this._snackBarService.open('Error editing expense', undefined, { duration: 3000 });
    // alert(JSON.stringify(result.data));
  }

}
