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
import { AuthService, HttpErrorService, UserFirebaseServiceProvider, CommonService } from '../services';
import { AppStore, AuthStore } from '../stores';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { DynamicDashboardsModule } from '@sgits/dynamic-dashboards';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { CategoryFirebaseServiceProvider } from '../services/firebase/category-firebase-service-provider';
import { CategoryAddModifyComponent } from './category-add-modify/category-add-modify.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { CurrencyFormatterComponent } from './currency-formatter/currency-formatter';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { ExpenseFirebaseServiceProvider } from '../services/firebase/expense-firebase-service-provider';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { CategoryGroupReportComponent } from './category-group-report/category-group-report.component';
import { CategoryExpenseReportComponent } from './category-expense-report/category-expense-report.component';
import { ExpenseComponent } from './expense/expense.component';
import { TrackBudgetComponent } from './track-budget/track-budget';
import { ForecastComponent } from './forecast/forecast.component';
import { SetupComponent } from './setup/setup.component';
import { AuthFirebaseServiceProvider } from '../services/firebase/auth-firebase-service-provider';
import { UsersComponent } from './users/users.component';
import { RegisterUserComponent } from './users/register-user/register-user.component';
import { LocalStorageModule } from '@ngx-pwa/local-storage';

const httpInterceptorProviders: Type<any>[] = [
    RequestInterceptor
];

@NgModule({
    declarations: [
        AppComponent,
        routedComponents,
        HomeComponent,
        CategoriesComponent,
        CategoryAddModifyComponent,
        CurrencyFormatterComponent,
        TrackBudgetComponent,
        ExpenseReportComponent,
        ExpenseDetailComponent,
        CategoryGroupReportComponent,
        CategoryExpenseReportComponent,
        ExpenseComponent,
        ForecastComponent,
        SetupComponent,
        UsersComponent,
        RegisterUserComponent
    ],
    imports: [
        MatGridListModule,
        AngularFireModule.initializeApp(environment.firebase),
        // AngularFireModule.initializeApp(environment.firebaseDemo),
        AngularFirestoreModule.enablePersistence(),
        // AngularFirestoreModule,
        AngularFireAuthModule,
        AppRoutingModule,
        BrowserModule,
        LocalStorageModule,
        BrowserAnimationsModule,
        SharedModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
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
        CategoryFirebaseServiceProvider,
        ExpenseFirebaseServiceProvider,
        AuthFirebaseServiceProvider,
        UserFirebaseServiceProvider,
        CommonService
    ],
    exports: [
    ],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule { }
