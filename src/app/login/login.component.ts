import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import { AuthStore } from '../../stores';
import { HttpErrorService, UserFirebaseServiceProvider } from '../../services';
import { SgNotificationService } from '../../components';
import { AngularFireAuth } from 'angularfire2/auth';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { AuthFirebaseServiceProvider } from '../../services/firebase/auth-firebase-service-provider';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../main/main.component.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {

    appTitle: string = environment.appTitle;
    email: string;
    password: string;

    constructor(
        private _router: Router,
        private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _notificationService: SgNotificationService,
        private _authStore: AuthStore,
        private userService: UserFirebaseServiceProvider,
        private _snackBarService: MatSnackBar,
        private _httpErrorService: HttpErrorService,
        private afAuth: AngularFireAuth,
        private authFirebaseService: AuthFirebaseServiceProvider
    ) {
    }

    login(): void {
       this.authFirebaseService.loginWithEmailPassword(this.email, this.password, (e) => this.loginWithEmailPasswordCallback(e));
    }

    loginWithEmailPasswordCallback(sqliteCallbackModel: SqliteCallbackModel) {
        if (sqliteCallbackModel.success) {
            this._notificationService.displayMessage('Logged in successfully');
            this.getUser(sqliteCallbackModel.data.uid);

            this._router.navigate(['/']);
        } else {
            this._notificationService.displayMessage(sqliteCallbackModel.data.message);
        }
    }

    getUser(authKey: string) {
        this.userService.getRecordFromAuthKey(authKey, (e) => this.getUserCallback(e));
    }

    getUserCallback(callbackModel: SqliteCallbackModel) {
        if (callbackModel.success) {

            localStorage.setItem('userGuidId', callbackModel.data[0].guidId);
            localStorage.setItem('shareToken', callbackModel.data[0].shareToken);
            localStorage.setItem('isAdmin', callbackModel.data[0].isAdmin);
            this._router.navigate(['/']);
        } else {
            this._notificationService.displayMessage(callbackModel.data[0].message);
        }
    }

    ngOnInit(): void {

        localStorage.removeItem('userGuidId');
        localStorage.removeItem('shareToken');
        localStorage.removeItem('isAdmin');

        this.authFirebaseService.logout((e) => this.logoutCallback(e));
        this._titleService.setTitle(this.appTitle + ' | ' + 'Login');
    }

    logoutCallback(sqliteCallbackModel: SqliteCallbackModel) {
        if (sqliteCallbackModel.success) {
            localStorage.removeItem('userGuidId');
            localStorage.removeItem('shareToken');
            localStorage.removeItem('isAdmin');
            this._notificationService.displayMessage('Logged out successfully');
            return;
        }
        this._notificationService.displayMessage('Logged in unsuccessfully');
    }

}
