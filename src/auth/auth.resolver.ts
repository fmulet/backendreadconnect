import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse } from './types/auth-response.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Logininput, SignUpInput } from './dto/inputs';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignUpInput
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: Logininput
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }


  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  async revalidateToken(@CurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.revalidateToken(user);
  }


}
