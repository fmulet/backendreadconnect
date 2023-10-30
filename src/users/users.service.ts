import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRoles } from './../auth/enums/valid-roles.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from 'src/auth/dto/inputs';
import { handleDBErrors } from 'src/helpers/helpers';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }


  async create(signupInput: SignUpInput): Promise<User> {

    try {

      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });

      return await this.usersRepository.save(newUser);

    } catch (error) {
      handleDBErrors(error);
    }

  }


  async findAll(roles: ValidRoles[]): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    roles.forEach((role, index) => {
      query.orWhere('FIND_IN_SET(:role' + index + ', user.roles) > 0')
        .setParameter('role' + index, role);
    });

    return query.getMany();
  }


  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);

    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput
  ): Promise<User> {

    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id
      });

      return await this.usersRepository.save(user);

    } catch (error) {
      handleDBErrors(error);
    }


  }

  async block(id: string): Promise<User> {

    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;

    return await this.usersRepository.save(userToBlock);

  }
}
