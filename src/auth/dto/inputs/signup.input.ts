import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ValidRoles } from "src/auth/enums";

@InputType()
export class SignUpInput {

  @Field(() => String)
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

  @Field(() => [ValidRoles], { nullable: true, defaultValue: [ValidRoles.user] })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];



}
