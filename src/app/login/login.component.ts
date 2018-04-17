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
    }

    login(): void {
        if (this.username === 'jacobusjonker@gmail.com' &&
            this.password === 'walle55') {
                this._router.navigate(['/']);
        }

        if (this.username === 'guest@crazyjonker.com' &&
            this.password === 'guest@123') {
                this._router.navigate(['/']);
        }
    }
    ngOnInit(): void {
        this._titleService.setTitle(this.appTitle + ' | ' + 'Login');
    }
}
