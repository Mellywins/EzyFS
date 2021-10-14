import {SetMetadata} from '@nestjs/common';
import {UserRoleEnum} from '../../user/entities/user-role.enum';
export const ROLES_KEY = 'roles';
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);
