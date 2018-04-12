import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthStore } from '../stores/auth.store';

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(private _router: Router,
        private _authStore: AuthStore,
        private _mdSnackBar: MatSnackBar) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : boolean {

        return true;
        // let roles: string[] = route.data.roles;
        // if (!this._authStore.hasValidToken()) {
        //     this._mdSnackBar.open('Session Expired! Please Login Again.', 'Close', { duration: 5000, panelClass: ['bgc-red-700', 'text-white'] });
        //     this._authStore.logout();
        //     return false;
        // }

        // if (this._authStore.hasRoles(roles)) {
        //     return true;
        // }

        // this._mdSnackBar.open('Access Unauthorised!', 'Close', { duration: 5000, panelClass: ['bgc-red-700', 'text-white'] });
        // this._authStore.logout();
        // return false;
    }
}
