import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Review)
@UseGuards(JwtAuthGuard)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Mutation(() => Review)
  createReview(@Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
  ) {
    return this.reviewsService.create(createReviewInput);
  }

  @Query(() => [Review], { name: 'reviews' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.reviewsService.findOneById(id);
  }

  @Mutation(() => Review)
  async updateReview(@Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User): Promise<Review> {
    {
      return this.reviewsService.update(updateReviewInput.id, updateReviewInput);
    }
  }

  @Mutation(() => Review)
  removeReview(@Args('id', { type: () => ID }) id: string) {
    return this.reviewsService.remove(id);
  }
}
