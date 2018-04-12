import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import 'rxjs/add/operator/toPromise';

import { CreateUserComponent } from '../users/user-create/user-create.component';
import { UsersStore } from '../../stores';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
    subscriptions: any[] = [];
    filter = '';
    dialogRef: MatDialogRef<CreateUserComponent>;

    constructor(
        private _matDialog: MatDialog,
        private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private _snackBarService: MatSnackBar,
        private _changeDetectorRef: ChangeDetectorRef,
        public media: TdMediaService,
        public _usersStore: UsersStore
    ) {

    }

    ngOnDestroy(): void {
        // this.subscriptions.forEach((result) => {
        //     //result.unsubscribe();
        //     result = undefined;
        // });
    }

    ngOnInit(): void {
        this.subscriptions.push(this._usersStore.loadInitialUsers());
        this.subscriptions.push(this._usersStore.loadInitialRoles());
    }

    ngAfterViewInit(): void {
        setTimeout(() => { // workaround since MatSidenav has issues redrawing at the beginning
            this.media.broadcast();
            this._changeDetectorRef.detectChanges();
        });
    }

    filterUsers(displayName: string = ''): void {
        this.filter = displayName;
    }

    enableOrDisable(id: string, isActive: boolean): void {
        let prompt = '';
        if (isActive) {
            prompt = 'Are you sure you want to enable this user?';
        } else {
            prompt = 'Are you sure you want to disable this user?';
        }
        this._dialogService.openConfirm({ message: prompt })
            .afterClosed().toPromise().then((confirm: boolean) => {
                if (confirm) {
                    this._usersStore.enableOrDisableUser(id, isActive).subscribe((res) => {
                        this._usersStore.loadInitialUsers();
                    });
                }
            });
    }
    createUser(): void {
        this.subscriptions.push(this.dialogRef = this._matDialog.open(CreateUserComponent, { width: '400px' }));
    }

}
