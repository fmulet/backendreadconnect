
import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateFollowInput {
  @Field()
  @IsUUID()
  followerId: string;

  @Field()
  @IsUUID()
  followingId: string;
}

