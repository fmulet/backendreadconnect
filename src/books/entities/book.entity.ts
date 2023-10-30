import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { UserBook } from 'src/user-books/entities/user-book.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'books' })
@ObjectType()
export class Book {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ default: '0000000000' })
  isbn: string;

  @Field()
  @Column()
  pageCount: number;

  @Field(() => Date)
  @Column({ type: 'datetime' })
  publishedDate: Date; // Consider using a more specific type if needed

  @Field()
  @Column({ default: 'https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson.jpg' })
  thumbnailUrl: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  longDescription?: string;

  @Field()
  @Column()
  status: string;

  @Field(() => [Author])
  @ManyToMany(() => Author, author => author.books)
  @JoinTable()  // This decorator is needed for owner side of ManyToMany relationship
  authors: Author[];

  @Field(() => [Category])
  @ManyToMany(() => Category, category => category.books)
  @JoinTable()
  categories: Category[];

  @Field(() => [Review])
  @OneToMany(() => Review, review => review.book)
  reviews: Review[];

  @OneToMany(() => UserBook, userBook => userBook.book)
  userBooks: UserBook[];
}


