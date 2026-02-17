/**
 * UserRoleGuard:
 * Custom Guard encargado de ver el usuario y sí tienes los roles para acceder a un route.
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {

  // Obtener meta data de SetMetadata()
  constructor(
    private reflector: Reflector,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log('UserRoleGuard');

    // Data del decorator SetMetadata()
    const validRoels: string[] = this.reflector.get('roles', context.getHandler());

    console.log(validRoels)

    return true;
  }
}
