import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsResolver } from './seeds.resolver';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from 'src/books/books.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { FollowsModule } from 'src/follows/follows.module';
import { UserBooksModule } from 'src/user-books/user-books.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SeedsResolver, SeedsService],
  imports: [ConfigModule, BooksModule, AuthorsModule, CategoriesModule, ReviewsModule, FollowsModule, UserBooksModule, UsersModule, AuthModule],
})
export class SeedsModule {

}
