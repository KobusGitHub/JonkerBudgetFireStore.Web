import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import { AuthStore } from '../../stores';
import { HttpErrorService } from '../../services';
import { SgNotificationService } from '../../components';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../main/main.component.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {

    appTitle: string = environment.appTitle;
    username: string;
    password: string;

    constructor(
        private _router: Router,
        private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _notificationService: SgNotificationService,
        private _authStore: AuthStore,
        private _snackBarService: MatSnackBar,
        private _httpErrorService: HttpErrorService) {
        localStorage.setItem('user', '');

    }

    login(): void {

        if (this.username === 'admin' &&
            this.password === 'Walle55') {
            localStorage.setItem('user', 'admin');
            this._router.navigate(['/']);
        } else if (this.username === 'guest' &&
            this.password === 'guest@123') {
            localStorage.setItem('user', 'guest');
            this._router.navigate(['/']);
        } else {
            this._notificationService.displayMessage('Invalid login!');

        }

    }
    ngOnInit(): void {
        this._titleService.setTitle(this.appTitle + ' | ' + 'Login');
    }

    isSetupDone(): boolean {
        let selectedYear = localStorage.getItem('budgetYear');
        let selectedMonth = localStorage.getItem('budgetMonth');
        let income = parseFloat(localStorage.getItem('budgetIncome'));
        let shareToken = localStorage.getItem('shareToken');

        if (!selectedYear || selectedYear.toString() === '') {
            return false;
        }

        if (!selectedMonth || selectedMonth.toString() === '') {
            return false;
        }

        if (!income || income.toString() === '') {
            return false;
        }

        if (!shareToken || shareToken.toString() === '') {
            return false;
        }
        return true;

    }
}
