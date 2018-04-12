import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UsersStore } from '../../../stores';
import {
  UserModel
} from '../../../models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: any[] = [];
  private userId: string;

  constructor(private _titleService: Title,
    private _loadingService: TdLoadingService,
    private _dialogService: TdDialogService,
    private _snackBarService: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public _usersStore: UsersStore,
    public media: TdMediaService
  ) {

  }

  ngOnInit(): void {
    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.userId = params['id'];
      this.getUser(this.userId);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }
  getUser(id: string) {
    this._usersStore.getUserForEdit(id, true);
  }

  back() {
    this._router.navigate(['users']);
  }

  refresh() {
    this.getUser(this.userId);
  }
}
