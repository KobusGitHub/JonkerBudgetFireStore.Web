import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute, Routes, Route } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TokenModel } from '../../models';
import { AuthStore, AppStore } from '../../stores';
import { environment } from '../../environments/environment';
import { mainRouterTransition } from '../../animations';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    animations: [mainRouterTransition],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
    currentRoute: string;
    currentRouteIcon: string;
    token: TokenModel = new TokenModel();
    appTitle: string = environment.appTitle;
    pageTitle: string;
    mainMenuRoutes: Routes = [];
    userRoutes: Routes;

    constructor(
        private _router: Router,
        private _titleService: Title,
        private _authStore: AuthStore,
        public _appStore: AppStore,
        private _currentRoute: ActivatedRoute) {
        _router.events.subscribe((event: Event) => this.routeChangedEvent(event));

        this._authStore.token.subscribe((res: TokenModel) => {
            this.token = res;
        });
    }

    ngOnInit(): void {
        this.initMainMenuRoutes(this._router.config);
        this.mainMenuRoutes.sort((a, b) => a.data.seq - b.data.seq);
    }

    initMainMenuRoutes(routes: Route[]) {
        routes.forEach((route) => {

            if (route.data && route.data.show) {
                this.mainMenuRoutes.push(route);
            }

            if (route.children) {
                this.initMainMenuRoutes(route.children);
            }
        });
    }

    routeChangedEvent(event: Event): void {
        if (event instanceof NavigationEnd) {
            let routeData: any = this._currentRoute.snapshot.children[0].data;
            this._titleService.setTitle(environment.appTitle + ' | ' + routeData.title);
            this.pageTitle = routeData.title;
            this.currentRoute = routeData.url;
            this.currentRouteIcon = routeData.icon;
        }
    }

    logout(): void {
        this._authStore.logout();
    }
}
