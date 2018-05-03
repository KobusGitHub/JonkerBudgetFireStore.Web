import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService } from '@covalent/core';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss']
})
export class ExpenseReportComponent implements OnInit {

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'];

  selectedMonth = '';
  selectedYear = '1900';
  showReport = false;

  categories = undefined;
  records = [];

  constructor(private _router: Router,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider,
    private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.categoryFirebaseServiceProvider.getAllActive((e) => this.getAllCategoriesCallback(e));

    this.selectedYear = localStorage.getItem('expense-report-year');
    this.selectedMonth = localStorage.getItem('expense-report-month');

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
    if (sqliteCallbackModel.success) {
      this.categories = sqliteCallbackModel.data;
    }
  }

  generateClick() {
    localStorage.setItem('expense-report-year', this.selectedYear);
    localStorage.setItem('expense-report-month', this.selectedMonth);

    this.showReport = true;

    this.expenseFirebaseServiceProvider.getAllInPeriod(this.selectedYear, this.selectedMonth, (e) => this.getAllInPeriodCallback(e));

  }

  getAllInPeriodCallback(sqliteCallbackModel: SqliteCallbackModel) {
    let recordsTemp = [];
    this.records = [];
    if (sqliteCallbackModel.success) {
      let catName = '';

      sqliteCallbackModel.data.forEach((rec) => {
        this.categories.forEach((cat) => {
          if (cat.guidId === rec.categoryGuidId) {
            catName = cat.categoryName;
          }
        });

        if (catName === '') {
          // Category got deleted
          return;
        }

        let dt = new Date(rec.recordDate);

        recordsTemp.push({
          expenseGuidId: rec.guidId,
          category: catName,
          expenseValue: rec.expenseValue,
          recordDate: rec.recordDate,
          recordDateFormatted: dt.getDate() + ' ' + this.monthNames[(dt.getMonth())] + ' ' + dt.getFullYear()
        });
      });

      this.records = recordsTemp.sort((a: any, b: any) => {
        return Date.parse(a.recordDate) - Date.parse(b.recordDate);
      });
    }
  }

  detailClick(item) {
    let obj = { expenseGuidId: item.expenseGuidId };
    this._router.navigate(['/expense-detail/' + item.expenseGuidId]);
  }
}
