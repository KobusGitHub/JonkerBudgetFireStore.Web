import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private _activatedRoute: ActivatedRoute) {
      // tslint:disable-next-line:radix
      this.selectedYear = localStorage.getItem('budgetYear');
      this.selectedMonth = localStorage.getItem('budgetMonth');
      this.income = parseFloat(localStorage.getItem('budgetIncome'));
      this.shareToken = localStorage.getItem('shareToken');
    }

  ngOnInit() {
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
    localStorage.setItem('budgetIncome', this.income.toString());
    localStorage.setItem('shareToken', this.shareToken);

    localStorage.setItem('category-group-report-month', this.selectedMonth);
    localStorage.setItem('category-group-report-year', this.selectedYear.toString());
    localStorage.setItem('expense-report-month', this.selectedMonth);
    localStorage.setItem('expense-report-year', this.selectedYear.toString());

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
