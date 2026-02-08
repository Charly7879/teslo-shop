import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  // Logger Nest
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...restProperties } = createProductDto;

      // Crear producto
      const product = this.productRepository.create({
        ...restProperties,
        images: images.map((image) => this.productImageRepository.create({ url: image })),
      });

      // Guardar producto en base de datos
      await this.productRepository.save(product);

      return {
        ...product,
        images,
      };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map((product) => ({
      ...product,
      images: product.images?.map(img => img.url),
    }));
  }

  async findOne(term: string) {

    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {

      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }


    if (!product)
      throw new InternalServerErrorException(`Product with term ${term} not found`);

    return product;
  }

  // Aplanar producto
  async findOnePlane(term: string) {
    const { images, ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images?.map(image => image.url),
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...rest } = updateProductDto;

    // Prepare
    let product = await this.productRepository.preload({ id, ...rest });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    // 1. Create query runner
    const queryRunner = this.dataSource.createQueryRunner();

    // 2. Conectar para realizar la transaction
    await queryRunner.connect();

    // 3. Inicializar transaction
    await queryRunner.startTransaction();

    try {

      if (images) {
        // 4. Borrar imágenes
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        // 5. Crear nuevas imágenes
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      }

      await queryRunner.manager.save(product);


      // 6. Update data
      await queryRunner.commitTransaction();

      // 7. Desconectar query runner
      await queryRunner.release();

      // Update data
      // await this.productRepository.save(product);

      return this.findOnePlane(id);
    } catch (error) {

      // Re hacer cambios
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  /**
   * Vacias tabla prodcts
   * @returns void
   */
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * Mostrar errores
   * @param error any
   */
  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
