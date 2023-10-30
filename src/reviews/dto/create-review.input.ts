
import { InputType, Field, Int } from '@nestjs/graphql';
import { Min, Max, IsString, IsInt } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field()
  @IsString()
  content: string;

  @Field()
  @Min(1)
  @Max(5)
  rating: number;  // Suponiendo que el rating va del 1 al 5

  @Field()
  userId: string;  // Suponiendo que usas UUIDs para los usuarios

  @Field(() => Int)
  @IsInt()
  bookId: number;  // Ya que es un valor entero incremental
}

