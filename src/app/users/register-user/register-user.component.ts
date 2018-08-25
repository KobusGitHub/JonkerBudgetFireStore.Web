import { Component, OnInit } from '@angular/core';
import { AuthFirebaseServiceProvider, UserFirebaseServiceProvider, CommonService } from '../../../services';
import { UserModel } from '../../../models';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { SqliteCallbackModel } from '../../../models/sqlite-callback-model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  private subscriptions: any[] = [];
  public userGuidId: string = '';
  public userModel: UserModel = new UserModel();
  public password: string = '';
  public email: string = '';
  public loggedInAdmin = false;

  frmUser: FormGroup;

  constructor(private _snackBarService: MatSnackBar, private _router: Router, private commonSevice: CommonService,
    public builder: FormBuilder,
    private _activatedRoute: ActivatedRoute, private userFirebaseService: UserFirebaseServiceProvider,
    private authFirebaseService: AuthFirebaseServiceProvider) {
    this.frmUser = builder.group({
      // 'email': [{ value: '' }, Validators.required],
      'isAdmin': [{ value: '' }],
      'name': [{ value: '' }, Validators.required],
      'surname': [{ value: '' }, Validators.required]
      // 'password': [{ value: '' }, Validators.required]
    });

    this.loggedInAdmin = false;
    if (localStorage.getItem('isAdmin') === 'true') {
      this.loggedInAdmin = true;
    }
  }

  ngOnInit() {

    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.userGuidId = params['userGuidId'];
      if (this.userGuidId === '0') {
        this.userGuidId = '';
      }

      this.loadData();
    }));
  }

  canSave() {
    if (!this.frmUser.valid) {
      return false;
    }

    if (this.userGuidId === '' && this.password === '') {
      return false;
    }

    if (this.userGuidId === '' && this.email === '') {
      return false;
    }

    return true;
  }

  loadData() {
    if (this.userGuidId === '') {
      this.userModel = new UserModel();
      this.userModel.isAdmin = false;
      this.frmUser.reset(this.userModel);
      return;
    }
    this.userFirebaseService.getRecord(this.userGuidId, (e) => this.getRecordCallback(e));

  }

  getRecordCallback(callback: SqliteCallbackModel) {
    if (callback.success) {
      this.userModel = callback.data;
      this.email = this.userModel.email;
      this.frmUser.reset(this.userModel);
      return;
    }

    this._snackBarService.open('Error getting user', '', {
      duration: 2000
    });
  }

  saveClick() {

    if (this.userGuidId === '') {
      // Add new
      this.authFirebaseService.createUserWithEmailPassword(this.email, this.password, (e) => this.createFirebaseUserCallback(e));
      return;
    }

    // Update
    let userCreateModel: UserModel = {
      guidId: this.userGuidId,
      shareToken: this.userModel.shareToken,
      email: this.email,
      isAdmin: this.frmUser.value.isAdmin,
      name: this.frmUser.value.name,
      surname: this.frmUser.value.surname
    };
    this.userFirebaseService.updateRecord(userCreateModel, (e) => this.updateUserCallback(e));
  }

  createFirebaseUserCallback(callback: SqliteCallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong registering you!', '', {
        duration: 2000
      });
      return;
    }

    let userModel: UserModel = {
      guidId: this.commonSevice.getNewGuid(),
      shareToken: callback.data.uid,
      email: this.email,
      isAdmin: this.frmUser.value.isAdmin,
      name: this.frmUser.value.name,
      surname: this.frmUser.value.surname
    };

    this.userFirebaseService.insertRecord(userModel, (e) => this.insertUserCallback(e));
  }

  insertUserCallback(callback: SqliteCallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong registering you! Please contact your Administrator', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('User created successfully', '', {
      duration: 2000
    });

    this.cancelClick();
  }

  updateUserCallback(callback: SqliteCallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong updating user! Please contact your Administrator', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('User updated successfully', '', {
      duration: 2000
    });

    this.cancelClick();
  }

  cancelClick() {
    this._router.navigate(['/users']);

  }

}
