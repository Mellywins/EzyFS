import {applyDecorators, Logger, SetMetadata, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GqlAuthGuard} from '../guards/gql-auth-guard';
import {UserRoleEnum} from '@ezyfs/common/enums/user-role.enum';
import {RolesGuard} from '../guards/roles.guards';
require('dotenv').config();
export function Auth(...roles) {
  if (process.env.GUARDS == 'false') {
    return applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard));
  }
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GqlAuthGuard, RolesGuard),
  );
}
