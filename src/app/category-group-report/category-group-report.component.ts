import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { TdLoadingService } from '@covalent/core';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-category-group-report',
  templateUrl: './category-group-report.component.html',
  styleUrls: ['./category-group-report.component.scss']
})
export class CategoryGroupReportComponent implements OnInit {
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'];

  selectedMonth = '';
  selectedYear = '1900';
  showReport = false;
  categories = [];

  showExport = false;
  exportReportLines: string[] = [];

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider,
    private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.categoryFirebaseServiceProvider.getAll((e) => this.getAllCategoriesCallback(e));
    this.selectedYear = localStorage.getItem('category-group-report-year');
    this.selectedMonth = localStorage.getItem('category-group-report-month');
    if (this.selectedMonth !== undefined && this.selectedMonth !== null && this.selectedMonth !== ''
      && this.selectedYear !== undefined && this.selectedYear !== null && this.selectedYear !== '') {
      this.generateClick();
    } else {
      this.selectedYear = localStorage.getItem('budgetYear');
      this.selectedMonth = localStorage.getItem('budgetMonth');
      if (this.selectedMonth !== undefined && this.selectedMonth !== null && this.selectedMonth !== ''
        && this.selectedYear !== undefined && this.selectedYear !== null && this.selectedYear !== '') {
        this.generateClick();
      }
    }
  }

  getAllCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.categories = [];

    if (sqliteCallbackModel.success) {
      sqliteCallbackModel.data.forEach((cat) => {
        this.categories.push({
          guidId: cat.guidId,
          categoryName: cat.categoryName,
          budget: cat.budget,
          expenseValue: 0,
          textColor: 'gray'
        });
      });
      this.generateClick();
    }
  }

  generateClick() {

    localStorage.setItem('category-group-report-year', this.selectedYear);
    localStorage.setItem('category-group-report-month', this.selectedMonth);

    this.showReport = true;

    this.categories.forEach((cat) => {
      cat.expenseValue = 0;
    });
    this.expenseFirebaseServiceProvider.getAllInPeriod(this.selectedYear, this.selectedMonth, (e) => this.getAllInPeriodCallback(e));
  }

  getAllInPeriodCallback(sqliteCallbackModel: SqliteCallbackModel) {

    this.categories.forEach((cat) => {
      cat.expenseValue = 0;
      cat.textColor = 'gray';
    });
    if (sqliteCallbackModel.success) {

      sqliteCallbackModel.data.forEach((rec) => {
        this.categories.forEach((cat) => {
          if (cat.guidId === rec.categoryGuidId) {
            // tslint:disable-next-line:radix
            cat.expenseValue = parseFloat(cat.expenseValue) + parseFloat(rec.expenseValue);

            if (cat.expenseValue > cat.budget) {
              cat.textColor = 'red';
            } else {
              cat.textColor = 'green';
            }
          }
        });
      });
    }

  }

  detailClick(item) {
    if (item.expenseValue === 0) {
      this._snackBarService.open('No expense to show', undefined, { duration: 3000 });
      return;
    }
    this._router.navigate(['/category-expense-report/' + item.guidId + '/' + this.selectedYear + '/' + this.selectedMonth]);
  }

  exportBackClick() {
    this.showExport = false;
  }
  exportReport() {
    this.showExport = true;

    this.exportReportLines = [];
    this.exportReportLines.push('Category,Budget,ExpenseValue');
    this.categories.forEach((categoryRec) => {
      this.exportReportLines.push(categoryRec.categoryName + ',' + categoryRec.budget + ',' + categoryRec.expenseValue);
    });
  }
}
