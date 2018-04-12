import { Component, OnInit, OnDestroy } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { UsersStore } from '../../../stores';
import {
    UserModel,
    CreateDomainUserModel
} from '../../../models';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html'

})
export class CreateUserComponent implements OnInit, OnDestroy {
    private subscriptions: any[] = [];
    createUserForm: FormGroup;

    constructor(public _dialogRef: MatDialogRef<CreateUserComponent>,
        private _loadingService: TdLoadingService,
        private _formBuilder: FormBuilder,
        public _usersStore: UsersStore, ) {
        this.createForm();
    }

    ngOnInit() {
        this.createUserForm.reset();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    createForm() {
        this.createUserForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            email: ['', Validators.required],
            username: ['', Validators.required],
            lastName: ['', Validators.required],
            jobTitle: ['']
        });
    }

    resetUserDetails() {
        this.createUserForm.reset();
    }

    saveUserDetails() {
        this._loadingService.register('add.user');

        let model: CreateDomainUserModel = {
            email: this.createUserForm.value.email,
            firstName: this.createUserForm.value.firstName,
            lastName: this.createUserForm.value.lastName,
            username: this.createUserForm.value.username,
            employerId: this.createUserForm.value.employerId,
            jobTitle: this.createUserForm.value.jobTitle
        };

        this._usersStore.createDomainUser(model).subscribe((response) => {
            this._loadingService.resolve('add.user');
            this._dialogRef.close();
        }, (error) => {
            this._loadingService.resolve('add.user');
        });
    }

    close() {
        this._dialogRef.close();
    }
}
