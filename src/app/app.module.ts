import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Type } from '@angular/core';
import 'hammerjs';
import { CommonModule, } from '@angular/common';
import { CovalentHttpModule } from '@covalent/http';
import { AppComponent } from './app.component';
import { RequestInterceptor } from './app.interceptor';
import { routedComponents, AppRoutingModule } from './app.routing';
import { SharedModule, CustomModule } from '../modules';
import { RouteGuard } from '../guards/route.guard';
import { AuthService, HttpErrorService, RolesService, UsersService } from '../services';
import { AppStore, AuthStore, UsersStore } from '../stores';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { DynamicDashboardsModule } from '@sgits/dynamic-dashboards';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { CreateUserComponent, UserDetailComponent, UserRolesComponent } from './users';
import { CategoriesComponent } from './categories/categories.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { CategoryFirebaseServiceProvider } from '../services/firebase/category-firebase-service-provider';
import { CategoryAddModifyComponent } from './category-add-modify/category-add-modify.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { CurrencyFormatterComponent } from './currency-formatter/currency-formatter';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { ExpenseFirebaseServiceProvider } from '../services/firebase/expense-firebase-service-provider';

const httpInterceptorProviders: Type<any>[] = [
    RequestInterceptor
];

@NgModule({
    declarations: [
        AppComponent,
        routedComponents,
        HomeComponent,
        CreateUserComponent,
        UserDetailComponent,
        UserRolesComponent,
        CategoriesComponent,
        CategoryAddModifyComponent,
        CurrencyFormatterComponent,
        ExpenseReportComponent,
    ],
    imports: [
        MatGridListModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        // DynamicDashboardsModule.forRoot(environment.webApiBaseAddress),
        CommonModule,
        InfiniteScrollModule,
        CustomModule,
        CovalentHttpModule.forRoot({
            interceptors: [{
                interceptor: RequestInterceptor, paths: ['**']
            }]
        })
    ],
    providers: [
        httpInterceptorProviders,
        Title,
        RouteGuard,
        AuthService,
        HttpErrorService,
        AppStore,
        AuthStore,
        RolesService,
        UsersService,
        UsersStore,
        CategoryFirebaseServiceProvider,
        ExpenseFirebaseServiceProvider
    ],
    exports: [
    ],
    bootstrap: [AppComponent],
    entryComponents: [CreateUserComponent]
})
export class AppModule { }
