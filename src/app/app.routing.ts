import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from './home/home.component';
import { RouteGuard } from '../guards/route.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CategoryAddModifyComponent } from './category-add-modify/category-add-modify.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { CategoryGroupReportComponent } from './category-group-report/category-group-report.component';
import { CategoryExpenseReportComponent } from './category-expense-report/category-expense-report.component';
import { ExpenseComponent } from './expense/expense.component';
import { ForecastComponent } from './forecast/forecast.component';
import { SetupComponent } from './setup/setup.component';
import { UsersComponent } from './users/users.component';
import { RegisterUserComponent } from './users/register-user/register-user.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { roles: [], url: '/login', title: 'Login', icon: 'exit_to_app', show: false, seq: 0 }
    },
    {
        path: '',
        component: MainComponent,
        // canActivate: [RouteGuard],
        children: [
            {
                path: '',
                component: HomeComponent,
                // canActivate: [],
                data: { roles: [], url: '/', title: 'Home', icon: 'home', show: true, seq: 1 }
            },
            {
                path: 'expense',
                component: ExpenseComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/expense', title: 'Expense', icon: 'attach_money', show: true, seq: 2 }
            },
            {
                path: 'forecast',
                component: ForecastComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/forecast', title: 'Forecast', icon: 'assistant_photo', show: true, seq: 3}
            },
            {
                path: 'expense-report',
                component: ExpenseReportComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/expense-report', title: 'Expense Report', icon: 'assignment', show: true, seq: 4 }
            },
            {
                path: 'category-group-report',
                component: CategoryGroupReportComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/category-group-report', title: 'Category Group Report', icon: 'assignment', show: true, seq: 5 }
            },
            {
                path: 'expense-detail/:expenseGuidId',
                component: ExpenseDetailComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '', title: 'Expense Detail', icon: 'assignment', show: false, seq: 6 }
            },
            {
                path: 'category-expense-report/:catGuidId/:year/:month',
                component: CategoryExpenseReportComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '', title: 'Category-Expense Report', icon: 'assignment', show: false, seq: 7 }
            },
            {
                path: 'category-add-modify/:expenseGuidId',
                component: CategoryAddModifyComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/category-add-modify', title: 'Category', icon: 'assignment', show: false, seq: 8 }
            },
            {
                path: 'setup',
                component: SetupComponent,
                // canActivate: [],
                data: { roles: [], url: '/setup', title: 'Budget Setup', icon: 'build', show: true, seq: 9 }
            },
            {
                path: 'categories',
                component: CategoriesComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/categories', title: 'Categories Setup', icon: 'tune', show: true, seq: 10 }
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/users', title: 'User Profiles', icon: 'person_outline', show: true, seq: 11 }
            },
            {
                path: 'users/:userGuidId',
                component: RegisterUserComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/users/register-user', title: 'Register User', icon: 'thumb_up', show: false, seq: 12 }
            }
            // {
            //     path: '',
            //     component: DynamicDashboardsContainerComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '/', title: 'Dashboards', icon: 'widgets', show: true, seq: 1 }
            // },
            // {
            //     path: 'widget-detail',
            //     component: DynamicWidgetDetailComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '', title: 'Widget Detail', icon: '', show: false, seq: 0 }
            // },
            // {
            //     path: 'users',
            //     component: UsersComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '/users', title: 'Users', icon: 'person', show: true, seq: 3 }
            // },
            // {
            //     path: 'users/:id',
            //     component: UserComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '', title: 'User', icon: 'person', show: false, seq: 0 }
            // },
            // {
            //     path: 'profile',
            //     component: ProfileComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '/profile', title: 'Profile', icon: 'account_circle', show: false, seq: 0 }
            // },
        ]
    },
    // {
    //     path: 'forgot-password',
    //     component: ForgotPasswordComponent,
    //     data: { roles: [], url: '/forgot-password', title: 'Forgot Password', icon: 'lock_outline', show: false, seq: 0 }
    // },
    // {
    //     path: 'reset-password/:userId/:token',
    //     component: ResetPasswordComponent,
    //     data: { roles: [], url: '/reset-password', title: 'Forgot Password', icon: 'lock_outline', show: false, seq: 0 }
    // },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }

export const routedComponents: any[] = [
    MainComponent,
    LoginComponent,
    PageNotFoundComponent
];
