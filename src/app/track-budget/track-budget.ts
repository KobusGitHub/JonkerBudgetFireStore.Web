import { Component, Input, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';

@Component({
  selector: 'app-track-budget',
  templateUrl: 'track-budget.html'
})
export class TrackBudgetComponent implements OnChanges {

  @Input() categoryGuidId: string;
  expenseTotal: number = 0;
  budgetValue: number = 0;
  haveExpenseTotal: boolean = false;
  haveCategoryBudget: boolean = false;

  displayTotal = 0;

  textColor = 'lightgray';

  budgetYear = 1900;
  budgetMonth = 'January';

  constructor(private _snackBarService: MatSnackBar, private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider) {
    this.categoryGuidId = '';
    this.displayTotal = 0;

    // tslint:disable-next-line:radix
    this.budgetYear = parseInt(localStorage.getItem('budgetYear')),
      this.budgetMonth = localStorage.getItem('budgetMonth');
  }

  ngOnChanges() {
    // if (this.categoryGuidId === '') {
    //   return;
    // }

    if (!this.categoryGuidId) {
      this.displayTotal = 0;
    }

    this.loadData();
  }

  loadData() {
    if (!this.categoryGuidId || this.categoryGuidId === '') {
      this.displayTotal = 0;
      this.textColor = 'lightgray';
      return;
    }

    this.expenseTotal = 0;
    this.budgetValue = 0;
    this.haveExpenseTotal = false;
    this.haveCategoryBudget = false;
    this.textColor = 'lightgray';

    this.categoryFirebaseServiceProvider.getRecordByGuidId(this.categoryGuidId, (e) => this.getCategoryCallback(e));
    this.expenseFirebaseServiceProvider.getAllInPeriod(this.budgetYear.toString(), this.budgetMonth, (e) => this.getAllExpensesCallback(e));
  }

  getCategoryCallback(result: SqliteCallbackModel) {
    this.haveCategoryBudget = true;
    if (result.success) {
      this.budgetValue = result.data.budget;
    }
    if (this.haveCategoryBudget && this.haveExpenseTotal) {
      this.calculateValue();
    }
  }

  getAllExpensesCallback(result: SqliteCallbackModel) {
    this.haveExpenseTotal = true;

    if (result.success) {
      result.data.forEach((expense) => {
        if (expense.categoryGuidId === this.categoryGuidId) {
          // console.log(Number(this.expenseTotal) + ' + ' + Number(expense.expenseValue));
          this.expenseTotal = Number(this.expenseTotal) + Number(expense.expenseValue);
          // console.log('expenseTotal: ' + this.expenseTotal);

        }
      });

    }
    if (this.haveCategoryBudget && this.haveExpenseTotal) {
      this.calculateValue();
    }

  }

  calculateValue() {
    // console.log(Number(this.budgetValue) + ' - ' + Number(this.expenseTotal));
    this.displayTotal = this.budgetValue - this.expenseTotal;
    // console.log('total:' + this.displayTotal);
    this.textColor = 'green';
    if (this.displayTotal < 0) {
      this.textColor = 'red';
    }

  }
}
