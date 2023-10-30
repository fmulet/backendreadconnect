import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('categories')
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Book])
  @ManyToMany(() => Book, book => book.categories)
  books: Book[];
}

