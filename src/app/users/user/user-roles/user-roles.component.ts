import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import {
  TdDataTableService,
  ITdDataTableColumn,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent,
  ITdDataTableSelectEvent,
  ITdDataTableSelectAllEvent,
  ITdDataTableRowClickEvent,
  TdLoadingService,
  TdMediaService
} from '@covalent/core';

import { UsersStore } from '../../../../stores';
import {
  UserModel,
  RoleModel,
  UserRoleModel,
  UpdateUserRolesModel
} from '../../../../models';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html'
})
export class UserRolesComponent implements OnInit,  OnDestroy, OnChanges {
  private subscriptions: any[] = [];
  private selectedRoles = [];
  private filteredRoles = [];

  private isBusy: boolean = false;
  private roles = [];
  private rolesTableConfig = {
    sortBy: 'name',
    sortOrder: TdDataTableSortingOrder.Ascending,
    columns: [
      { name: 'name', label: 'Role' },
      { name: 'description', label: 'Description' }
    ]
  };
  public rolesToAdd: number[] = [];
  public userRolesToRemove: number[] = [];

  @Input() user: UserModel = new UserModel();
  @Input() disabled: boolean = false;

  constructor(private _loadingService: TdLoadingService,
    public _usersStore: UsersStore,
    private _tdDataTableService: TdDataTableService) { }

  ngOnInit() {
    this.getRoles();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (let propName in changes) {
      if (propName === 'user') {
        this.configureSelectedRoles();
      }
    }
  }

  getRoles() {
    this._loadingService.register('roles.list');
    this.subscriptions.push(this._usersStore.getRoles(true).subscribe((response) => {
      this.roles = response;
      this.filterRoles();
      this.configureSelectedRoles();
      this._loadingService.resolve('roles.list');
    }, (error) => {
      this.roles = [];
      this._loadingService.resolve('roles.list');
    }));
  }

  configureSelectedRoles() {
    this.selectedRoles = [];
    this.rolesToAdd = [];
    this.userRolesToRemove = [];

    if (this.user && this.user.roles && this.roles.length > 0 && this.filteredRoles.length > 0) {
      this.filteredRoles.forEach((role: RoleModel) => {
        this.user.roles.forEach((userRole: UserRoleModel) => {
          if (role.id === userRole.role.id && userRole.role.isEnabled) {
            this.selectedRoles.push(role);
          }
        });
      });
    }
  }

  sortRoles(sortEvent: ITdDataTableSortChangeEvent): void {
    this.rolesTableConfig.sortBy = sortEvent.name;
    this.rolesTableConfig.sortOrder = sortEvent.order;
    this.filterRoles();
  }

  filterRoles() {
    this.filteredRoles = this._tdDataTableService.sortData(this.roles, this.rolesTableConfig.sortBy, this.rolesTableConfig.sortOrder);
  }

  roleRowSelectAll(event: ITdDataTableSelectAllEvent) {
    event.rows.forEach((row) => {
      this.roleRowSelect( {index: row.index, row: row, selected: event.selected} );
    });
  }

  roleRowSelect(event: ITdDataTableSelectEvent) {
    let userRole = this.user.roles.find((item) => {
      return item.role.id === event.row.id;
    });

    if (event.selected) {
      if (userRole) {
        let index = this.userRolesToRemove.indexOf(userRole.role.id);

        if (index > -1) {
          this.userRolesToRemove.splice(index, 1);
        }
      } else {
        this.rolesToAdd.push(event.row.id);
      }
    } else {
      if (userRole) {
        this.userRolesToRemove.push(userRole.role.id);
      } else {
        let index = this.rolesToAdd.indexOf(event.row.id);

        if (index > -1) {
          this.rolesToAdd.splice(index, 1);
        }
      }
    }
  }

  saveRoles() {
    this._loadingService.register('roles.list');

    let model: UpdateUserRolesModel = {
      userId: this.user.userId,
      rolesToAdd: this.rolesToAdd,
      userRolesToRemove: this.userRolesToRemove
    };

    this.subscriptions.push(this._usersStore.updateUserRoles(model).subscribe((response) => {
      this.user = response;
      this.filterRoles();
      this.configureSelectedRoles();
      this._loadingService.resolve('roles.list');
    }, (error) => {
      this._loadingService.resolve('roles.list');
    }));
  }

  resetUserRoles() {
    this.configureSelectedRoles();
  }
}
