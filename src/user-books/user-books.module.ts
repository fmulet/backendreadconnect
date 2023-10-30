import { Module } from '@nestjs/common';
import { UserBooksService } from './user-books.service';
import { UserBooksResolver } from './user-books.resolver';
import { UserBook } from './entities/user-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UserBooksResolver, UserBooksService],
  imports: [TypeOrmModule.forFeature([UserBook]),],
  exports: [UserBooksService, TypeOrmModule]
})
export class UserBooksModule { }
