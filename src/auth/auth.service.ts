import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  private logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      // Prepare
      const user = this.userRepository.create(createUserDto);

      // Save
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.logger.error(error);
      this.handleExceptions(error);
    }
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
