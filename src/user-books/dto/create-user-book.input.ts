
import { InputType, Field } from '@nestjs/graphql';
import { BookStatus } from '../enum/status';

@InputType()
export class CreateUserBookInput {
  @Field()
  userId: string;

  @Field()
  bookId: string;

  @Field(() => BookStatus)
  status: BookStatus;
}

