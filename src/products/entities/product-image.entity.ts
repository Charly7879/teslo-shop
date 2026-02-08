
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
    })
    url: string;

    @ManyToOne(
        (type) => Product,
        (product) => product.images,
        {
            onDelete: 'CASCADE',
        }
    )
    product: Product;

}
