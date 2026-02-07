import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  // Logger Nest
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      // Crear producto
      const product = this.productRepository.create(createProductDto);

      // Guardar producto en base de datos
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO: Relaciones
    });
  }

  async findOne(term: string) {

    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {

      const queryBuilder = this.productRepository.createQueryBuilder();

      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        .getOne();
    }


    if (!product)
      throw new InternalServerErrorException(`Product with term ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {

      // Prepare
      let product = await this.productRepository.preload({
        id: id,
        ...updateProductDto,
      });

      if (!product)
        throw new NotFoundException(`Product with id "${id}" not found`);

      // Update data
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {

      let product = await this.findOne(id);

      let { affected } = await this.productRepository.delete({ id: product.id });

      if (affected !== 0) {
        throw new BadRequestException(`Product with id "${id}" not found`);
      }

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
