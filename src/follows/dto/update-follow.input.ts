import { CreateFollowInput } from './create-follow.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFollowInput extends PartialType(CreateFollowInput) {
  @Field(() => String)
  id: string;
}
