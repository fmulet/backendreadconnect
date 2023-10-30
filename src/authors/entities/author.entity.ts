
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';

@ObjectType()  // Indica que 'Author' es un tipo que puede ser usado en el esquema GraphQL
@Entity('authors')
export class Author {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Book])
  @ManyToMany(() => Book, book => book.authors)
  books: Book[];



}

