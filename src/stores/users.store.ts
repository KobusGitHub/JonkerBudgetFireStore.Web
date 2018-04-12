import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {
    UserModel,
    RoleModel,
    UserSideMenu,
    UpdateUserDetailsModel,
    UpdateUserStateModel,
    UpdateUserRolesModel,
    CreateDomainUserModel
} from '../models';
import {
    UsersService,
    RolesService,
    HttpErrorService
} from '../services';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UsersStore {

    private currentFilter: string = '';
    private editUserId: string = '';
    private _users: BehaviorSubject<UserModel[]> = new BehaviorSubject([]);
    private _filteredUsers: BehaviorSubject<UserModel[]> = new BehaviorSubject([]);
    private _roles: BehaviorSubject<RoleModel[]> = new BehaviorSubject([]);
    private _userSideMenu: BehaviorSubject<UserSideMenu[]> = new BehaviorSubject([]);
    private _userSideMenuSelected: BehaviorSubject<UserSideMenu> = new BehaviorSubject(new UserSideMenu());
    private _editUser: BehaviorSubject<UserModel> = new BehaviorSubject(new UserModel());
    private _isBusy: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly users: Observable<UserModel[]> = this._users.asObservable();
    public readonly filteredUsers: Observable<UserModel[]> = this._filteredUsers.asObservable();
    public readonly roles: Observable<RoleModel[]> = this._roles.asObservable();
    public readonly userSideMenu: Observable<UserSideMenu[]> = this._userSideMenu.asObservable();
    public readonly userSideMenuSelected: Observable<UserSideMenu> = this._userSideMenuSelected.asObservable();
    public readonly editUser: Observable<UserModel> = this._editUser.asObservable();
    public readonly isBusy: Observable<boolean> = this._isBusy.asObservable();

    constructor(
        private _usersService: UsersService,
        private _rolesService: RolesService,
        private _httpErrorService: HttpErrorService,
        private _matSnackBar: MatSnackBar,
        private _loadingService: TdLoadingService
    ) {
        this.loadInitialUsers();
        this.loadInitialRoles();
    }

    initUserSideMenu(): void {

        const currentRoles = this._roles.getValue();
        const menu = [];

        menu.push({
            name: 'All Users',
            description: 'All Users',
            icon: 'account_circle',
            selected: true,
            generatedByRole: false
        });

        currentRoles.forEach((role) => {
            menu.push({
                name: role.name,
                description: role.description,
                icon: 'group_work',
                selected: false,
                generatedByRole: true
            });
        });

        menu.push({
            name: 'Disabled',
            description: 'Disabled Users',
            icon: 'remove_circle',
            selected: false,
            generatedByRole: false
        });

        this._userSideMenu.next(menu);
        this._userSideMenuSelected.next(menu[0]);
    }

    selectUserSideMenu(selectedMenu: UserSideMenu): void {

        const currentUserSideMenu = this._userSideMenu.getValue();

        currentUserSideMenu.forEach((menu) => {
            if (selectedMenu.name === menu.name) {
                menu.selected = true;
                this._userSideMenuSelected.next(menu);
            } else {
                menu.selected = false;
            }
        });

        this.getFilteredUsers(this.currentFilter);
        this._userSideMenu.next(currentUserSideMenu);
    }

    getUserForEdit(id: string, useCache: boolean = true): Observable<UserModel> {
        this.editUserId = id;

        this.getUsers(useCache).subscribe((res) => {
            let editUserValue = res.find((item: UserModel) => {
                return item.userId === this.editUserId;
            });
            this._editUser.next(editUserValue);
        });

        return this.editUser;
    }

    enableOrDisableUser(userId: string, isActive: boolean): Observable<boolean> {
        let model = new UpdateUserStateModel();
        model.userId = userId;

        if (isActive) {
            const obs = this._usersService.enableUser(model);
            obs.subscribe(
                (res) => {
                    let result = res;
                },
                (error) => {
                    this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                }
            );
            return obs;
        } else {
            const obs = this._usersService.disableUser(model);
            obs.subscribe(
                (res) => {
                    let result = res;
                },
                (error) => {
                    this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                }
            );
            return obs;
        }
    }

    getUsers(useCache: boolean): Observable<UserModel[]> {
        if (useCache && this._users.getValue().length > 0) {
            return this._users.asObservable();
        }
        this._loadingService.register('users.details');

        const obs = this._usersService.getUsers();

        obs.subscribe(
            (res) => {

                res.forEach((user) => {
                    user.roleCount = user.roles.length;
                });

                this._users.next(res);
                this.getFilteredUsers(this.currentFilter);
                this._loadingService.resolve('users.details');
            },
            (error) => {
                this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                this._loadingService.resolve('users.details');
            }
        );

        return obs;
    }

    getRoles(useCache: boolean): Observable<RoleModel[]> {
        if (useCache && this._roles.getValue().length > 0) {
            return this._roles.asObservable();
        }

        const obs: Observable<RoleModel[]> = this._rolesService.getRoles();

        obs.subscribe(
            (res) => {
                this._roles.next(res);
                this.initUserSideMenu();
            },
            (error) => {
                this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
            }
        );

        return obs;
    }

    loadInitialUsers(): Observable<UserModel[]> {

        const obs: Observable<UserModel[]> = this._usersService.getUsers();

        this._loadingService.register('users.list');

        obs.subscribe(
            (res) => {

                res.forEach((user) => {
                    user.roleCount = user.roles.filter((userRole) => userRole.role.isEnabled).length;
                });

                this._users.next(res);
                this._loadingService.resolve('users.list');
            },
            (error) => {
                this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                this._loadingService.resolve('users.list');
            }
        );

        return obs;
    }

    loadInitialRoles(): Observable<RoleModel[]> {

        const obs: Observable<RoleModel[]> = this._rolesService.getRoles();

        this._loadingService.register('roles.list');

        obs.subscribe(
            (res) => {
                this._roles.next(res);
                this.initUserSideMenu();
                this._loadingService.resolve('roles.list');
            },
            (error) => {
                this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                this._loadingService.resolve('roles.list');
            }
        );

        return obs;
    }

    sortUsers(): void {
        const currentUsers = this._users.getValue();
        currentUsers.reverse();
        this._users.next(currentUsers);
        this.getFilteredUsers(this.currentFilter);
    }

    getFilteredUsers(filter: string): Observable<UserModel[]> {

        let result = this.users;
        const selectedMenu = this._userSideMenu.getValue().find((role) => role.selected);

        if (!(filter === '' || filter === undefined)) {
            result = result.map((users) =>
                users.filter((user) =>
                    user.firstname.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
                    user.surname.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
                    user.username.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
                    (user.firstname + ' ' + user.surname).toLowerCase().indexOf(filter.toLowerCase()) >= 0
                )
            );
        }

        if (selectedMenu) {

            if (selectedMenu.generatedByRole) {
                result = result.map((users) =>
                    users.filter((user) =>
                        (user.roles.findIndex((role) => role.role.name === selectedMenu.name && role.role.isEnabled) > -1)
                    )
                );
            }

            if (selectedMenu.name === 'Disabled') {
                result = result.map((users) =>
                    users.filter((user) =>
                        !user.isActive
                    )
                );
            }
        }

        return result;
    }

    updateUserDetails(model: UpdateUserDetailsModel): Observable<UserModel> {
        this._isBusy.next(true);
        let obs = this._usersService.updateUserDetails(model);

        obs.subscribe(
            (res) => {
                let users = this._users.getValue();
                let index = users.findIndex((item: UserModel) => {
                    return item.userId === res.userId;
                });

                if (index > -1) {
                    users.splice(index, 1);
                }

                users.push(res);
                this._users.next(users);
                this.getUserForEdit(model.userId, true);

                this.getFilteredUsers(this.currentFilter);
                this._isBusy.next(false);
            },
            (error) => {
                this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                this._isBusy.next(false);
            }
        );

        return obs;
    }

    updateUserRoles(model: UpdateUserRolesModel): Observable<UserModel> {
        this._isBusy.next(true);
        let obs = this._usersService.updateUserRoles(model);

        obs.subscribe(
            (res) => {
                let users = this._users.getValue();
                let index = users.findIndex((item: UserModel) => {
                    return item.userId === res.userId;
                });

                if (index > -1) {
                    users.splice(index, 1);
                }

                users.push(res);
                this._users.next(users);
                this.getUserForEdit(model.userId, true);

                this.getFilteredUsers(this.currentFilter);
                this._isBusy.next(false);
            },
            (error) => {
                this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                this._isBusy.next(false);
            }
        );

        return obs;
    }

    createDomainUser(model: CreateDomainUserModel): Observable<UserModel> {
        this._isBusy.next(true);
        let obs = this._usersService.createDomainUser(model);

        obs.subscribe(
            (res) => {
                let users = this._users.getValue();
                users.push(res);
                this._users.next(users);

                this.getFilteredUsers(this.currentFilter);
                this._isBusy.next(false);
            },
            (error) => {
                this._matSnackBar.open(this._httpErrorService.handleHttpError(error), 'Close', { duration: 5000, extraClasses: ['bgc-red-700'] });
                this._isBusy.next(false);
            }
        );

        return obs;
    }
}
