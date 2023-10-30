import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from 'src/authors/authors.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  providers: [BooksResolver, BooksService],
  imports: [AuthorsModule, CategoriesModule,
    TypeOrmModule.forFeature([Book]),
  ],
  exports: [
    BooksService,
    TypeOrmModule,
  ]
})
export class BooksModule { }
