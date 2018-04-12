import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { RoleModel } from '../models';
import { HttpInterceptorService } from '@covalent/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RolesService {

    constructor(
        private _http: HttpInterceptorService
    ) {

    }

    getRoles(): Observable<RoleModel[]> {
        return this._http.get(`${environment.webApiBaseAddress}roles`)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error');
    }
}
