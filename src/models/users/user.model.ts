import { UserRoleModel } from './user-role.model';

export class UserModel {

    userId: string;
    firstname: string;
    email: string;
    username: string;
    surname: string;
    isActiveDirectoryUser: boolean;
    isActive: boolean;
    createdDateUtc: Date;
    createdBy: string;
    roleCount: number;
    roles: UserRoleModel[];
}
