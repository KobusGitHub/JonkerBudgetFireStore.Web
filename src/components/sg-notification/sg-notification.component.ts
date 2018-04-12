import { Component, Input, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  templateUrl: './sg-notification.component.html',
  styleUrls: ['./sg-notification.component.scss']
})

export class SgNotificationComponent {
  message: string;
  icon: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              private _ref: MatSnackBarRef<SgNotificationComponent>) {
    this.message = data.message;
    this.icon = data.icon;
  }

  close() {
    this._ref.dismiss();
  }
}
