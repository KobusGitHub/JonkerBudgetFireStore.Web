import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AppStore {
    private _themeClass: BehaviorSubject<string> = new BehaviorSubject('');
    public readonly themeClass: Observable<string> = this._themeClass.asObservable();

    constructor(
    ) {
        let currentThemeClass = localStorage.getItem('themeClass');

        // set default theme if none is set
        // tslint:disable-next-line:no-null-keyword
        if (currentThemeClass === null) {
            localStorage.setItem('themeClass', 'light-theme');
            this._themeClass.next('light-theme');
        } else {
            this._themeClass.next(currentThemeClass);
        }
    }

    setThemeClass(themeClass: string): void {
        localStorage.setItem('themeClass', themeClass);
        this._themeClass.next(themeClass);
    }
}
