
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBErrors } from 'src/helpers/helpers';
import { Repository } from 'typeorm';
import { CreateUserBookInput } from './dto/create-user-book.input';
import { UpdateUserBookInput } from './dto/update-user-book.input';
import { UserBook } from './entities/user-book.entity';

@Injectable()
export class UserBooksService {

  constructor(
    @InjectRepository(UserBook)
    private userBookRepository: Repository<UserBook>,
  ) { }

  async create(createUserBookInput: CreateUserBookInput): Promise<UserBook> {
    const newUserBook = this.userBookRepository.create(createUserBookInput);
    return await this.userBookRepository.save(newUserBook);
  }

  async findAll(): Promise<UserBook[]> {
    return await this.userBookRepository.find();
  }

  async findOne(id: string): Promise<UserBook> {
    try {
      return await this.userBookRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }

  }

  async update(id: string, updateUserBookInput: UpdateUserBookInput): Promise<UserBook> {
    await this.userBookRepository.update(id, updateUserBookInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {

    try {
      await this.userBookRepository.delete(id);

    } catch (error) {
      handleDBErrors(error);
    }
  }


}

