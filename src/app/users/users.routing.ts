// import { ModuleWithProviders } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { UsersComponent } from './users.component';
// import { UserComponent } from './user/user.component';
// import { RouteGuard } from '../../guards/route.guard';

// const routes: Routes = [{
//     path: 'users',
//     children: [{
//         path: '',
//         component: UsersComponent,
//         canActivate: [RouteGuard],
//         data: { roles: [], url: '/users', title: 'Users', icon: 'supervisor_account', show: true, seq: 2 }
//     }, {
//         path: 'edit/:id',
//         component: UserComponent,
//         canActivate: [RouteGuard],
//         data: { roles: [], url: '', title: 'Dashboards', icon: 'dashboard', show: false, seq: 3 }
//     }]
// }];

// export const userRoutes: ModuleWithProviders = RouterModule.forChild(routes);
