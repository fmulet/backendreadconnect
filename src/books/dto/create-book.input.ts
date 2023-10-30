

import { IsNotEmpty, IsString, IsInt, Min, IsDate, IsOptional, IsArray, ArrayMinSize, Max } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsString()
  @IsOptional()
  isbn?: string;

  @Field(() => [Int])
  @IsArray()
  @IsInt({ each: true }) authors: number[];

  @Field(() => [Int])
  @IsArray()
  @IsInt({ each: true })
  categories: number[];

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  pageCount: number;

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  publishedDate: Date;


  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(0)
  offset?: number;

}




