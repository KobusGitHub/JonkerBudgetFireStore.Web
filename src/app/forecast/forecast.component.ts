import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseModel } from '../../models/expenses/expense-model';
import { CategoryModel } from '../../models/categories/category-model';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { LocalStorage } from '../../../node_modules/@ngx-pwa/local-storage';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit, OnDestroy {
  private subscriptions: any[] = [];

  loader: any;
  year: number = 0;
  month: string = '';
  income: number = 0;
  incomeLeft: number = 0;
  catBudget: number = 0;
  forecastBudget = 0;

  expenses: ExpenseModel[];
  categories: CategoryModel[];

  catOutstandingBudgets = [];

  getExpensesDone = false;
  getCategoriesDone = false;

  constructor(private _snackBarService: MatSnackBar, private _router: Router, protected secureLocalStorage: LocalStorage,
    private _activatedRoute: ActivatedRoute, private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider) {

    // tslint:disable-next-line:radix
    this.year = parseInt(localStorage.getItem('budgetYear'));
    this.month = localStorage.getItem('budgetMonth');
    // this.income = parseFloat(localStorage.getItem('budgetIncome'));
  }

  ngOnInit() {
    this.secureLocalStorage.getItem('budgetIncome').subscribe((res) => {
      this.income = res;
      this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
        this.expenseFirebaseServiceProvider.getSumInPeriod(this.year, this.month, (e) => this.getSumInPeriodCallback(e));
      }));
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

  }

  getExpenses() {
    this.getExpensesDone = false;
    this.getCategoriesDone = false;

    this.expenseFirebaseServiceProvider.getAllInPeriod(this.year.toString(), this.month, (e) => this.getExpensesCallback(e));
    this.categoryFirebaseServiceProvider.getAll((e) => this.getCategoriesCallback(e));

  }

  getSumInPeriodCallback(result: SqliteCallbackModel) {
    if (result.success) {
      let incomeUsed = result.data;
      // this.incomeLeft = parseFloat(localStorage.getItem('budgetIncome')) - incomeUsed;
      this.incomeLeft = this.income - incomeUsed;
    }
    this.getExpenses();
  }

  getExpensesCallback(result: SqliteCallbackModel) {
    this.getExpensesDone = true;

    if (result.success) {
      this.expenses = result.data;
    }

    if (this.getCategoriesDone === true) {
      this.getOutstandingExpenses();
    }
  }

  getCategoriesCallback(result: SqliteCallbackModel) {
    this.getCategoriesDone = true;

    this.catBudget = 0;

    if (result.success) {
      this.categories = result.data;
    }

    if (this.getExpensesDone === true) {
      this.getOutstandingExpenses();
    }
  }

  getOutstandingExpenses() {

    this.catOutstandingBudgets = [];

    let budgetToAdd: number = 0;

    this.categories.forEach((cat) => {
      let catGuidId = cat.guidId;
      let catBudget = cat.budget;
      // console.log(cat.categoryName);

      let sumExpense = 0;
      this.expenses.forEach((expense) => {
        if (expense.categoryGuidId === catGuidId) {
          sumExpense += expense.expenseValue;
        }
      });
      // console.log('catBudget:' + catBudget);
      // console.log('sumExpense:' + sumExpense);

      if (catBudget > sumExpense) {
        let catBudgetToAdd = catBudget - sumExpense;
        this.catOutstandingBudgets.push({ category: cat.categoryName, outstandingValue: catBudgetToAdd, selected: true });
        budgetToAdd += catBudgetToAdd;
        // console.log('catBudgetToAdd:' + catBudgetToAdd);

      }
    });
    this.calculate();
  }

  calculate() {
    let outstandingExpenseSum: number = 0;
    this.catOutstandingBudgets.forEach((outstanding) => {
      if (outstanding.selected === true) {
        outstandingExpenseSum += outstanding.outstandingValue;
      }
    });

    // console.log('calculate');
    // console.log('this.incomeLeft:' + this.incomeLeft);
    // console.log('this.outstandingExpenseSum:' + outstandingExpenseSum);

    this.forecastBudget = this.incomeLeft - outstandingExpenseSum;
    // console.log('this.forecastBudget:' + this.forecastBudget);

  }

  budgetClick(outstandingBudget) {
    if (outstandingBudget.selected === true) {
      outstandingBudget.selected = false;
    } else {
      outstandingBudget.selected = true;
    }
    this.calculate();
  }

  // backClick() {
  //   window.history.back();
  // }

}
