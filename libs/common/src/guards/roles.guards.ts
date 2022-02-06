/* eslint-disable @typescript-eslint/no-var-requires */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  // Logger,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {GqlExecutionContext} from '@nestjs/graphql';
import {Observable} from 'rxjs';
import {UserRoleEnum} from '../enums/user-role.enum';
import {ROLES_KEY} from '../decorators/roles.decorator';

require('dotenv').config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // if the required roles are undefined we return true so we don't activate the guard

    if (!requiredRoles || process.env.GUARDS === 'false') {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const {user} = ctx.getContext().req;
    // if the required role is admin
    if (requiredRoles.indexOf(UserRoleEnum.ADMIN) > -1) {
      // if the user role is also admin we return true
      if (user.roles.indexOf(UserRoleEnum.ADMIN) > -1) {
        return true;
      }
      // else we activate the guard
      return false;
    }
    // if the required role is USER it actually means that we won't activate the guard
    return true;
  }
}
