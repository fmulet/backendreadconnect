import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './types/auth-response.types';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Logininput, SignUpInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignUpInput): Promise<AuthResponse> {

    const user = await this.usersService.create(signupInput)

    const token = this.getJwtToken(user.id);

    return { token, user }

  }


  async login(loginInput: Logininput): Promise<AuthResponse> {

    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email / Password do not match');
    }

    const token = this.getJwtToken(user.id);

    return {
      token,
      user
    }
  }

  async validateUser(id: string): Promise<User> {

    const user = await this.usersService.findOneById(id);

    if (!user.isActive) {
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }

    delete user.password;

    return user;
  }

  async revalidateToken(user: User): Promise<AuthResponse> {

    const token = this.getJwtToken(user.id);

    return { token, user }

  }





}
