import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { HttpInterceptorService } from '@covalent/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserModel, PasswordResetRequestModel, ResetPasswordModel,
    UpdateUserStateModel, CreateDomainUserModel, UpdateUserDetailsModel, UpdateUserRolesModel } from '../models';

@Injectable()
export class UsersService {

    constructor(
        private _http: HttpInterceptorService
    ) {

    }

    getUsers(): Observable<UserModel[]> {
        return this._http.get(`${environment.webApiBaseAddress}users/GetUsersWithEnabledRoles`)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error').share();
    }

    updateUserDetails(model: UpdateUserDetailsModel): Observable<UserModel> {
        return this._http.post(`${environment.webApiBaseAddress}users/UpdateUserDetails`, model)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error').share();
    }

    updateUserRoles(model: UpdateUserRolesModel): Observable<UserModel> {
        return this._http.post(`${environment.webApiBaseAddress}users/UpdateUserRoles`, model)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error').share();
    }

    requestPasswordReset(model: PasswordResetRequestModel): Observable<any> {
        return this._http.post(`${environment.webApiBaseAddress}users/RequestPasswordReset`, model)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error');
    }

    resetPassword(model: ResetPasswordModel): Observable<any> {
        return this._http.post(`${environment.webApiBaseAddress}users/ResetPassword`, model)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error');
    }

    createDomainUser(model: CreateDomainUserModel): Observable<UserModel> {
        return this._http.post(`${environment.webApiBaseAddress}users/Domain`, model)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error').share();
    }

    enableUser(model: UpdateUserStateModel) {
        return this._http.post(`${environment.webApiBaseAddress}users/EnableUser`, model)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error').share();
    }

    disableUser(model: UpdateUserStateModel) {
        return this._http.post(`${environment.webApiBaseAddress}users/DisableUser`, model)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error) || 'Server error').share();
    }
}
