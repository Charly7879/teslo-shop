import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * getRawHeaders
 * Decorator que retorna los rawHeaders de request.
 */
export const GetRawHeaders = createParamDecorator(

    (data: string, ctx: ExecutionContext) => {

        // Request
        const req = ctx.switchToHttp().getRequest();

        // Raw Headers
        const rawHeaders = req.rawHeaders;

        return rawHeaders;
    }

);