import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity('reviews')
export class Review {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  rating: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @Field(() => Book)
  @ManyToOne(() => Book, book => book.reviews)
  book: Book;
}


