import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import { Credentials, TokenModel } from '../models';

@Injectable()
export class AuthService {

    headers: Headers = new Headers();

    constructor(private _http: Http) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }

    login(model: Credentials): Observable<TokenModel> {
        let credentials = 'username=' + model.userName + '&password=' + encodeURIComponent(model.password) + '&isDomainUser=false';

        return this._http
            .post(environment.webApiBaseAddress + 'Jwt', credentials, { headers: this.headers })
            .map((res) => {
                let jsonModel = res.json();
                let token = new TokenModel();

                token.result = jsonModel.token;
                token.expiresIn = jsonModel.expiresIn;

                return token;
            })
            .catch((error: any) => Observable.throw(error) || 'Server error')
            .share();
    }
}
