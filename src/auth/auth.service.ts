import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  private logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      // Prepare
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      // Save
      await this.userRepository.save(user);

      // Quitar contraseña
      //delete user.password;

      return user;
      // TODO: Retornar JWT de acceso

    } catch (error) {
      this.logger.error(error);
      this.handleExceptions(error);
    }
  }


  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // Prepare
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
      }
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return user;
    // TODO: Retornar JWT de acceso
  }


  /**
   * Mostrar errores
   * @param error any
  */
  private handleExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
