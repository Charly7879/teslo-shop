import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

/**
 * GetUer (decorator)
 * Recupera el usuario por medio del "request", en las rutas
 */
export const GetUser = createParamDecorator(

    /**
     * @param data Parámetro/s en el decorator
     * @param ctx Context en dónde se ejecuta el decorator
     * @returns 
     */
    (data: string, ctx: ExecutionContext) => {

        // Request
        const req = ctx.switchToHttp().getRequest();

        // User
        const user = req.user;

        if (!user)
            throw new InternalServerErrorException('User not foun (request)');

        return (!data)
            ? user
            : user[data];
    }
);