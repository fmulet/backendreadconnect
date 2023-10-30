import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { BookStatus } from '../enum/status';


@Entity()
@ObjectType()
export class UserBook {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.userBooks)
  user: User;

  @Field(() => Book)
  @ManyToOne(() => Book, book => book.userBooks)
  book: Book;

  @Field()
  @Column({ type: 'enum', enum: BookStatus })
  status: BookStatus;
}
