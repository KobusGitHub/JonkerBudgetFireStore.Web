import { Component, OnInit, OnDestroy } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import { ExpenseFirebaseServiceProvider } from '../../services/firebase/expense-firebase-service-provider';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';

@Component({
  selector: 'app-category-expense-report',
  templateUrl: './category-expense-report.component.html',
  styleUrls: ['./category-expense-report.component.scss']
})
export class CategoryExpenseReportComponent implements OnInit, OnDestroy {
  private subscriptions: any[] = [];
  catGuidId: string;
  selectedMonth = '';
  selectedYear = '1900';
  records = [];
  categories = [];

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute,
    private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider,
    private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.catGuidId = params['catGuidId'];
      this.selectedYear = params['year'];
      this.selectedMonth = params['month'];
      if (this.catGuidId === '0') {
        this.catGuidId = '';
      }
      this.loadData();
      // alert(this.categoryGuidId);
    }));

  }

  loadData() {
    this.categoryFirebaseServiceProvider.getAll((e) => this.getAllCategoriesCallback(e));
    this.selectedYear = localStorage.getItem('category-group-report-year');
    this.selectedMonth = localStorage.getItem('category-group-report-month');
    if (this.selectedMonth !== undefined && this.selectedYear !== undefined) {
      this.generateClick();
    }
  }

  getAllCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel) {
    if (sqliteCallbackModel.success) {
      this.categories = sqliteCallbackModel.data;
      this.generateClick();
    }
  }

  generateClick() {
    this.expenseFirebaseServiceProvider.getAllInPeriod(this.selectedYear, this.selectedMonth, (e) => this.getAllInPeriodCallback(e));
  }

  getAllInPeriodCallback(sqliteCallbackModel: SqliteCallbackModel) {
    let recordsTemp = [];
    this.records = [];
    if (sqliteCallbackModel.success) {
      sqliteCallbackModel.data.forEach((rec) => {
          if (rec.categoryGuidId === this.catGuidId) {
            let catName = '';
            this.categories.forEach((cat) => {
              if (cat.guidId === rec.categoryGuidId) {
                catName = cat.categoryName;
              }
            });
            recordsTemp.push({
              expenseGuidId: rec.guidId,
              category: catName,
              expenseValue: rec.expenseValue,
              recordDate: rec.recordDate
            });
          }
      });

      this.records = recordsTemp.sort((a: any, b: any) => {
        return Date.parse(a.recordDate) - Date.parse(b.recordDate);
      });
    }
  }

  detailClick(item) {
    let obj = { expenseGuidId: item.expenseGuidId };
    this._router.navigate(['/expense-detail/' + item.expenseGuidId ]);

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  goBack() {
    window.history.back();
  }

}
