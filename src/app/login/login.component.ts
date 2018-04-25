import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import { AuthStore } from '../../stores';
import { HttpErrorService } from '../../services';
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
        private _snackBarService: MatSnackBar,
        private _httpErrorService: HttpErrorService,
        private afAuth: AngularFireAuth,
        private authFirebaseService: AuthFirebaseServiceProvider
    ) {
    }

    // login(): void {
    //     const promise = this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
    //     promise.then((res) => {
    //         this._notificationService.displayMessage('Logged in successfully');
    //         localStorage.setItem('shareToken', res.uid);
    //         this._router.navigate(['/']);
    //     });
    //     promise.catch((e) => {
    //         this._notificationService.displayMessage(e.message);
    //     });
    // }

    login(): void {
       this.authFirebaseService.loginWithEmailPassword(this.email, this.password, (e) => this.loginWithEmailPasswordCallback(e));
    }

    loginWithEmailPasswordCallback(sqliteCallbackModel: SqliteCallbackModel) {
        if (sqliteCallbackModel.success) {
            this._notificationService.displayMessage('Logged in successfully');
            localStorage.setItem('shareToken', sqliteCallbackModel.data.uid);
            this._router.navigate(['/']);
        } else {
            this._notificationService.displayMessage(sqliteCallbackModel.data.message);
        }
    }

    // createUser(): void {
    //     const promise = this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password);
    //     promise.then((res) => {
    //         this._notificationService.displayMessage('Logged in successfully');
    //         // console.log(res);
    //         // console.log(res.uid);
    //         localStorage.setItem('shareToken', res.uid);
    //         this._router.navigate(['/']);
    //     });
    //     promise.catch((e) => {
    //         // console.log(e.message);
    //         this._notificationService.displayMessage(e.message);
    //     });
    // }

    ngOnInit(): void {
        localStorage.setItem('shareToken', '');
        this.authFirebaseService.logout((e) => this.logoutCallback(e));
        this._titleService.setTitle(this.appTitle + ' | ' + 'Login');
    }

    logoutCallback(sqliteCallbackModel: SqliteCallbackModel) {
        // console.log(sqliteCallbackModel.data);
    }

}
