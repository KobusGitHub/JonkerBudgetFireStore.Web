import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { TokenModel, Credentials } from '../models';
import { AuthService } from '../services';

@Injectable()
export class AuthStore {
    private _currentToken: TokenModel = new TokenModel();
    private _token: BehaviorSubject<TokenModel> = new BehaviorSubject(this.getToken());
    public readonly token: Observable<TokenModel> = this._token.asObservable();

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
        this._token.subscribe((res: TokenModel) => {
            this._currentToken = res;
        });

        this._token.next(this.getToken());
    }

    login(authData: Credentials): Observable<TokenModel> {

        const obs = this._authService.login(authData);

        obs.subscribe(
            (res) => {
                this.saveToken(res);
                this._router.navigate(['']);
                return res;
            }, (error) => {
                return Observable.throw(error);
            });

        return obs;
    }

    logout() {
        this.clearToken();
        this._router.navigate(['/login']);
        return;
    }

    clearToken() {
        localStorage.setItem('token', undefined);
        localStorage.setItem('expiresIn', undefined);
        localStorage.setItem('isAuth', 'false');

        this._token.next(this.getToken());
    }

    hasRoles(roles: string[]) {
        let result = true;

        if (roles && roles.length > 0) {
            let token = this._currentToken;

            for (let i = 0; i < roles.length; i++) {
                let role = roles[i];

                if (token.roles.indexOf(role) === -1) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    }

    public hasValidToken(): boolean {
        let token = this._currentToken;

        if (!token.result || token.result === 'undefined') {
            return false;
        }

        return !token.isExpired;
    }

    private getToken(): TokenModel {
        const token = new TokenModel();

        token.result = localStorage.getItem('token');
        token.expiresIn = parseInt(localStorage.getItem('expiresIn'), 0);
        token.isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;

        return token;
    }

    private saveToken(token: TokenModel) {
        localStorage.setItem('token', token.result);
        localStorage.setItem('expiresIn', token.expiresIn.toString());
        localStorage.setItem('isAuth', 'true');

        this._token.next(token);
    }
}
