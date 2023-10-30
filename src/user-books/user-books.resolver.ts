import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserBooksService } from './user-books.service';
import { UserBook } from './entities/user-book.entity';
import { CreateUserBookInput } from './dto/create-user-book.input';
import { UpdateUserBookInput } from './dto/update-user-book.input';
import { ValidRoles } from 'src/auth/enums';
import { CurrentUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => UserBook)
export class UserBooksResolver {
  constructor(private readonly userBooksService: UserBooksService) { }

  @Mutation(() => UserBook)
  async createUserBook(
    @Args('createUserBookInput') createUserBookInput: CreateUserBookInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ): Promise<UserBook> {
    // Asegurar que el usuario actual es el que está asociando el libro.
    createUserBookInput.userId = user.id;

    return await this.userBooksService.create(createUserBookInput);
  }

  @Query(() => [UserBook], { name: 'userBooks' })
  async findAll(): Promise<UserBook[]> {
    return await this.userBooksService.findAll();
  } @Query(() => UserBook, { name: 'userBook' })


  @Query(() => UserBook, { name: 'userBook' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<UserBook> {
    return await this.userBooksService.findOne(id);
  }

  @Mutation(() => UserBook)
  async updateUserBook(
    @Args('updateUserBookInput') updateUserBookInput: UpdateUserBookInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ): Promise<UserBook> {
    return await this.userBooksService.update(updateUserBookInput.id, updateUserBookInput);
  }

  @Mutation(() => UserBook)
  async removeUserBook(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ): Promise<void> {
    return await this.userBooksService.remove(id);
  }
}
