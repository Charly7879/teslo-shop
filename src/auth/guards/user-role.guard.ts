/**
 * UserRoleGuard:
 * Custom Guard encargado de ver el usuario y sí tienes los roles para acceder a un route.
 */
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  // Obtener meta data de SetMetadata()
  constructor(
    private reflector: Reflector,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Data del decorator SetMetadata()
    const validRoels: string[] = this.reflector.get('roles', context.getHandler());

    // Comprobar sí está SetMetaData
    if (!validRoels) return true;

    if (validRoels.length === 0) return true;

    // Request
    const req = context.switchToHttp().getRequest();

    // User
    const user: User = req.user;

    //console.log(validRoels)

    if (!user)
      throw new BadRequestException('User not found');

    //console.log({ userRoles: user.roles })

    // Validar user por los roles
    for (const role of user.roles) {
      if (validRoels.includes(role))
        return true;
    }

    throw new ForbiddenException(`User ${user.fullName} need valid roles`);
  }
}
