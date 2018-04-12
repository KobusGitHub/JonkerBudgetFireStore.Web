import { Component, OnInit, OnChanges, SimpleChange, Input } from '@angular/core';
import {
  TdLoadingService,
  TdMediaService
} from '@covalent/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsersStore } from '../../../../stores';
import {
  UserModel,
  UpdateUserDetailsModel
} from '../../../../models';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit, OnChanges {
  private subscriptions: any[] = [];
  detailForm: FormGroup;

  @Input() user: UserModel = new UserModel();
  @Input() disabled: boolean = false;

  constructor(private _loadingService: TdLoadingService,
    private _formBuilder: FormBuilder,
    private _usersStore: UsersStore, ) {
    this.createForms();
  }

  ngOnInit() {
    this.detailForm.reset(this.user);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (let propName in changes) {
      if (propName === 'user') {
        // this.detailForm.patchValue(this.user);
        this.detailForm.reset(this.user);
      }
    }
  }

  createForms() {
    this.detailForm = this._formBuilder.group({
      firstname: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      surname: ['', Validators.required],
      isActive: [false, Validators.required]
    });
  }

  resetUserDetails() {
    this.detailForm.reset(this.user);
  }

  saveUserDetails() {
    this._loadingService.register('users.details');

    let model: UpdateUserDetailsModel = {
      email: this.detailForm.value.email,
      firstName: this.detailForm.value.firstname,
      isActive: this.detailForm.value.isActive,
      lastName: this.detailForm.value.surname,
      userId: this.user.userId
    };

    this.subscriptions.push(this._usersStore.updateUserDetails(model).subscribe((response) => {
      this._loadingService.resolve('users.details');
      this.user = response;
    }, (error) => {
      this._loadingService.resolve('users.details');
    }));
  }
}
