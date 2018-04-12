import { Component, OnInit } from '@angular/core';
import { AppStore } from '../../stores';
import { IThemeModel } from '../../models';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: [
        '../main/main.component.scss',
        './profile.component.scss'
    ]
})
export class ProfileComponent implements OnInit {

    selectedThemeClass: string;
    themes: IThemeModel[];

    constructor(
        public _appStore: AppStore
    ) {
        this.themes = environment.themes;
    }

    ngOnInit(): void {
        this._appStore.themeClass.subscribe((themeClass) => this.selectedThemeClass = themeClass);
    }
}
