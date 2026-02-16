import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @BeforeInsert()
    checkFieldInsert() {
        this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()
    checkFieldUpdate() {
        this.email = this.email.toLowerCase();
    }

}
