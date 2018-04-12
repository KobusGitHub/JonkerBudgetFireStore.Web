import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';

export class TokenModel {
    private _result: string = '';
    private _decodedToken: any;

    jwtHelper: JwtHelper = new JwtHelper();
    expiresIn: number;
    isAuth: boolean = true; // TODO: make a getter that checks against the expiry

    get result(): string {
        return this._result;
    }
    set result(value: string) {
        this._result = value;
        if (value && value !== 'undefined') {
            this._decodedToken = this.jwtHelper.decodeToken(value);
        } else {
            this._decodedToken = undefined;
        }
    }

    get username(): string {
        if (!this._decodedToken) {
            return '';
        }
        return this._decodedToken.sub;
    }

    get firstName(): string {
        if (!this._decodedToken) {
            return '';
        }
        return this._decodedToken.firstName;
    }

    get surname(): string {
        if (!this._decodedToken) {
            return '';
        }
        return this._decodedToken.surname;
    }

    get roles(): string[] {
        if (!this._decodedToken) {
            return [];
        }
        return this._decodedToken.roles;
    }

    get shortUiName(): string {
        if (!this._decodedToken) {
            return 'Anonymous User';
        }
        if (this._decodedToken.firstName) {
            return this._decodedToken.firstName;
        } else {
            return this._decodedToken.username;
        }
    }

    get fullUiName(): string {
        if (!this._decodedToken) {
            return 'Anonymous User';
        }
        if (this._decodedToken.firstName) {
            return this._decodedToken.firstName + ' ' + this._decodedToken.surname;
        } else {
            return this._decodedToken.username;
        }
    }

    get isExpired(): boolean {
        if (!this._decodedToken) {
            return true;
        }

        return this.jwtHelper.isTokenExpired(this._result);
    }
}
