import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService } from '@covalent/core';

import { environment } from '../../environments/environment';
import { UserModel, PasswordResetRequestModel, ResetPasswordModel } from '../../models';
import { HttpErrorService } from '../../services';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  userId: string = '';
  token: string = '';
  subscription: any;
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  appTitle: string = environment.appTitle;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _titleService: Title,
    private _loadingService: TdLoadingService,
    private _snackBarService: MatSnackBar,
    private _httpErrorService: HttpErrorService,
    private _usersService: UsersService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.userId = params.userId;
      this.token = params.token;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  submit(): void {
    if (!this.token || !this.userId) {
      this._snackBarService.open('Invalid Password Reset URL - Token/UserID is missing!', 'Close',
        { duration: 7500, panelClass: ['bgc-red-700', 'text-white'] });
      return;
    }

    if (!this.password || !this.confirmPassword) {
      this._snackBarService.open('Password and Confirm Password are required!', 'Close',
        { duration: 7500, panelClass: ['bgc-red-700', 'text-white'] });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this._snackBarService.open('Password and Confirm Password are not the same!', 'Close',
        { duration: 7500, panelClass: ['bgc-red-700', 'text-white'] });
      return;
    }

    this._loadingService.register('reset-password');
    this.loading = true;

    this._usersService.resetPassword({ token: this.token, password: this.password, userId: this.userId }).subscribe(
      (response) => {
        this._loadingService.resolve('reset-password');
        this.loading = false;
        this._snackBarService.open(
          'Password has been successfully reset for account ' + response.username + '.', 'Close', { duration: 5000 }
        );
      },
      (error) => {
        this._loadingService.resolve('reset-password');
        this.loading = false;
        let errorMessage = this._httpErrorService.handleHttpError(error);
        this._snackBarService.open(errorMessage, 'Close', { duration: 7500, panelClass: ['bgc-red-700', 'text-white'] });
      }
    );
  }

  back() {
    this._router.navigate(['/login']);
  }
}
