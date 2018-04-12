import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { appRouterTransition } from '../animations';
import { AppStore } from '../stores/app.store';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [appRouterTransition]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    // themeClass: string;

    constructor(
        public _overlayContainer: OverlayContainer,
        public _appStore: AppStore,
        private _iconRegistry: MatIconRegistry,
        private _domSanitizer: DomSanitizer
    ) {
        this._iconRegistry.addSvgIconInNamespace('assets', 'teradata',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'github',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent-mark.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-ux.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'appcenter',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/appcenter.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'listener',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/listener.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'querygrid',
            this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/querygrid.svg'));
    }

    ngOnInit(): void {
        // this.themeClass = 'dark-theme';
        // this._overlayContainer.themeClass = 'dark-theme';
        // this._overlayContainer.getContainerElement().classList.add('dark-theme');
    }
}
