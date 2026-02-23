import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { Product } from 'src/products/entities';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ) { }

  async runSeed() {
    await this.insertNewProducts();
    return `Seed executed!`;
  }

  private async insertNewProducts() {

    // Vacias tabla products e productImages
    await this.productsService.deleteAllProducts();

    // Seed products
    const produtcs = initialData.products;

    // Promesas por cada inserción
    const insertPromises: any[] = [];

    produtcs.forEach(product => {
      //insertPromises.push(this.productsService.create(product));
    });

    // Insertar productos
    await Promise.all(insertPromises);

  }

}
