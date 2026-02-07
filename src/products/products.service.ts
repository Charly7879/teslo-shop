import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  async findOne(id: string) {

    let product: Product | null;

    product = await this.productRepository.findOneBy({ id: id });

    if (!product)
      throw new InternalServerErrorException(`Product with id ${id} not found`);

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
