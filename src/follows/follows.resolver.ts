import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { FollowsService } from './follows.service';
import { Follow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import { JwtAuthGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Follow)
@UseGuards(JwtAuthGuard)
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) { }

  @Mutation(() => Follow)
  createFollow(@Args('createFollowInput') createFollowInput: CreateFollowInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.followsService.create(createFollowInput);
  }

  @Query(() => [Follow], { name: 'follows' })
  findAll(@CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.followsService.findAll();
  }

  // src/follows/follows.resolver.ts

  @Query(() => [Follow], { name: 'followers' })
  findFollowers(
    @Args('userId', { type: () => ID }) userId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.followsService.findFollowers(userId);
  }

  @Query(() => [Follow], { name: 'following' })
  findFollowing(
    @Args('userId', { type: () => ID }) userId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.followsService.findFollowing(userId);
  }


  @Query(() => Follow, { name: 'follow' })
  findOne(@Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.followsService.findOneById(id);
  }

  @Mutation(() => Follow)
  updateFollow(
    @Args('updateFollowInput') updateFollowInput: UpdateFollowInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.followsService.update(updateFollowInput.id, updateFollowInput);
  }

  @Mutation(() => Follow)
  removeFollow(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.followsService.remove(id);
  }
}
