
import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { JwtAuthGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums';
import { CurrentUser } from 'src/auth/decorators';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) { }

  @Mutation(() => Book, { name: 'createBook' })
  @UseGuards(JwtAuthGuard)
  async createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User

  ): Promise<Book> {
    return this.booksService.create(createBookInput);
  }


  @Query(() => [Book], { name: 'allBooks' })
  async findAll(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Book[]> {
    return this.booksService.findAll(limit, offset);
  }


  @Query(() => Book, { name: 'book' })
  @UseGuards(JwtAuthGuard)
  async findOneById(
    @Args('id', { type: () => ID }) id: number,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User): Promise<Book> {
    return this.booksService.findOneById(id);
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async updateBook(
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ): Promise<Book> {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async removeBook(@Args('id', { type: () => Int }) id: number,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User) {
    await this.booksService.remove(id);
  }
}
