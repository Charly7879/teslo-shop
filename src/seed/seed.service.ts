import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async runSeed() {
    await this.deleteTables();
    const admin = await this.insertUsers();
    await this.insertNewProducts(admin);
    return `Seed executed!`;
  }

  /**
   * Borrar tablase por orden
   */
  private async deleteTables() {
    // Borar productos
    await this.productsService.deleteAllProducts();

    // Borrar usuarios
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {

    // Vacias tabla products e productImages
    await this.productsService.deleteAllProducts();

    // Seed products
    const produtcs = initialData.products;

    // Promesas por cada inserción
    const insertPromises: any[] = [];

    produtcs.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    });

    // Insertar productos
    await Promise.all(insertPromises);

  }

}
