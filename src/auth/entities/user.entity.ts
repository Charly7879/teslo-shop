import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 250,
        unique: true,
    })
    email: string;

    @Column({
        type: 'text',
        select: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 250,
    })
    fullName: string;

    @Column({
        type: 'bool',
        default: true,
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user'],
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
        { eager: false }
    )
    products: Product[];


    @BeforeInsert()
    checkFieldInsert() {
        this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()
    checkFieldUpdate() {
        this.email = this.email.toLowerCase();
    }

}
