import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthStore } from '../stores/auth.store';
import { LocalStorage } from '../../node_modules/@ngx-pwa/local-storage';
import { Observable } from '../../node_modules/rxjs';

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(private _router: Router, protected secureLocalStorage: LocalStorage,
        private _authStore: AuthStore,
        private _mdSnackBar: MatSnackBar) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        // return true;

        return this.secureLocalStorage.getItem('shareToken').map((res) => {
            if (res === null || res === undefined || res === '') {
                this._authStore.logout();
                return false;
            }

            // let isIncomeSetup = localStorage.getItem('isIncomeSetup');
            // if (!isIncomeSetup || isIncomeSetup.toString() !== 'true') {
            //     this._mdSnackBar.open('Need Setup!', 'Close', { duration: 5000, panelClass: ['bgc-red-700', 'text-white'] });
            //     // this._router.navigate(['/setup']);
            //     return false;
            // }
            return true;
        }, (err) => {
            this._authStore.logout();
            return false;
        });

    }
}
