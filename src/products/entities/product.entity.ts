import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '34eb5fa3-dec1-44e1-86a6-6c30469806d1',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shit Teslo',
        description: 'Product title',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column({
        type: 'float',
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: 'This is an example product descritpion',
        description: 'Product description',
    })
    @Column({
        type: 'text',
        default: null,
    })
    description: string;

    @ApiProperty({
        example: 'my-product-example',
        description: 'Product slug',
        uniqueItems: true,
    })
    @Column({
        type: 'text',
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 0,
        description: 'Product stock',
    })
    @Column({
        type: 'int',
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ['SM', 'M', 'L', 'XL'],
        description: 'Product sizes',
    })
    @Column({
        type: 'text',
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product genders',
    })
    @Column({
        type: 'text',
    })
    gender: string;

    @ApiProperty({
        example: 'shirt',
        description: 'Product tags',
    })
    @Column({
        type: 'text',
        array: true,
        default: [],
    })
    tags: string[];

    @ApiProperty({
        example: [
            "1740290-00-A_0_2000.jpg",
            "1740290-00-A_1.jpg"
        ],
        description: 'Product images',
    })
    @OneToMany(
        (type) => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true, // Relacionar en find*
        }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.products,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlogInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlogUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

}
