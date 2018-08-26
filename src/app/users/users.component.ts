import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UserFirebaseServiceProvider, AuthFirebaseServiceProvider } from '../../services';
import { UserModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { TdDialogService } from '../../../node_modules/@covalent/core';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { LocalStorage } from '../../../node_modules/@ngx-pwa/local-storage';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: UserModel[] = [];
  reRegisteredUser: UserModel = undefined;
  public currentUserShareToken: string = '';
  public isAdmin: boolean = false;
  public showAdmin: boolean = false;

  constructor(private _snackBarService: MatSnackBar, private _router: Router, private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef, protected secureLocalStorage: LocalStorage,
    private authFirebaseService: AuthFirebaseServiceProvider,
    private userFirebaseServiceProvider: UserFirebaseServiceProvider) { }

  ngOnInit() {
    this.currentUserShareToken = localStorage.getItem('shareToken');

    this.secureLocalStorage.getItem('isAdmin').subscribe((res) => {
      if (res === true) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

      this.loadData();
    });
  }

  loadData() {
    if (this.showAdmin) {
      this.userFirebaseServiceProvider.getAllAdmin((e) => this.getAllCallback(e));

      return;
    }
    this.userFirebaseServiceProvider.getAll((e) => this.getAllCallback(e));
  }

  getAllCallback(callbackModel: SqliteCallbackModel) {
    this.users = [];
    if (callbackModel.success) {

      if (this.isAdmin) {
        this.users = callbackModel.data;
        return;
      }

      callbackModel.data.forEach((userModel) => {
        if (userModel.guidId === localStorage.getItem('userGuidId')) {
          this.users.push(userModel);
          return;
        }
      });
      return;
    }

    this._snackBarService.open('Error getting users', '', {
      duration: 2000
    });
  }

  detailClick(userModel: UserModel) {
    this._router.navigate(['/users/' + userModel.guidId]);
  }

  resetPasswordClick(userModel: UserModel) {
    this.resetPassword(userModel.email);
  }

  resetPassword(email) {
    this.authFirebaseService.sendPasswordResetEmail(email, (e) => this.resetPasswordCallback(e));

  }

  resetPasswordCallback(callback: SqliteCallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Error sending reset password', '', {
        duration: 2000
      });
    }

    this._snackBarService.open('Reset email send', '', {
      duration: 2000
    });
  }

  UpdateEmailClick(userModel: UserModel) {
    this.reRegisteredUser = userModel;
    this.openConfirm();
  }

  openConfirm(): void {
    this._dialogService.openConfirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to update your email?. This will update your login email asswell.',
      disableClose: true, // defaults to false
      viewContainerRef: this._viewContainerRef, // OPTIONAL
      title: 'Confirm', // OPTIONAL, hides if not provided
      cancelButton: 'Cancel', // OPTIONAL, defaults to 'CANCEL'
      acceptButton: 'OK', // OPTIONAL, defaults to 'ACCEPT'
      width: '500px' // OPTIONAL, defaults to 400px
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // DO SOMETHING
        this.openPrompt();
      } else {
        this.reRegisteredUser = undefined;
        // DO SOMETHING ELSE
      }
    });
  }

  openPrompt(): void {
    this._dialogService.openPrompt({
      message: 'Please provide your new email',
      disableClose: true, // defaults to false
      viewContainerRef: this._viewContainerRef, // OPTIONAL
      title: 'Prompt', // OPTIONAL, hides if not provided
      value: '', // OPTIONAL
      acceptButton: 'Ok', // OPTIONAL, defaults to 'ACCEPT'
      width: '400px' // OPTIONAL, defaults to 400px
    }).afterClosed().subscribe((newValue: string) => {
      if (newValue) {
        // DO SOMETHING
        this.updateEmail(newValue);
      } else {
        this.reRegisteredUser = undefined;
        // DO SOMETHING ELSE
      }
    });
  }

  updateEmail(email: string) {
    this.reRegisteredUser.email = email;
    this.authFirebaseService.updateUserEmail(email, (e) => this.updateEmailCallback(e));
  }

  updateEmailCallback(callback: SqliteCallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong registering you!', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('Login updated successfully', '', {
      duration: 2000
    });

    this.userFirebaseServiceProvider.updateRecord(this.reRegisteredUser, (e) => this.updateLoginEmailCallback(e));

  }

  updateLoginEmailCallback(callback: SqliteCallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong updating user! Please contact your Administrator', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('Email updated successfully', '', {
      duration: 2000
    });
  }
}
