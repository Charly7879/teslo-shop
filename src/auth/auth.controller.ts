import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, GetRawHeaders, Auth } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRout(
    @Req() request: Express.Request, // Retorna todo el Request
    @GetUser() user: User,
    @GetUser('email') email: string,
    @GetRawHeaders() reawHeaders: [],
  ) {

    console.log(request);

    return {
      user,
      email,
      reawHeaders,
    }
  }

  @Get('private-2')
  //@SetMetadata('roles', ['admin', 'super-admin']) // Añade datos extra al request
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivateRout2(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user,
    }
  }

  @Get('private-3')
  @Auth(ValidRoles.admin)
  testPrivateRout3(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user,
    }
  }

}
