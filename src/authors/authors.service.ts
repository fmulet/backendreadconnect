import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBErrors } from 'src/helpers/helpers';
import { Repository } from 'typeorm';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {

  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) { }


  async findAll(): Promise<Author[]> {
    return await this.authorRepository.find({
      relations: ["books"]
    });
  }


  async findOneById(id: number): Promise<Author> {
    try {
      return await this.authorRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async create(createAuthorInput: CreateAuthorInput): Promise<Author> {
    try {
      const newAuthor = this.authorRepository.create(createAuthorInput);
      return await this.authorRepository.save(newAuthor);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Método para actualizar un autor.
  async update(id: number, updateAuthorInput: UpdateAuthorInput): Promise<Author> {
    try {

      const author = await this.authorRepository.findOneOrFail({ where: { id } });
      if (!author) {
        throw new NotFoundException(`Author with id ${id} not found`);
      }

      Object.assign(author, updateAuthorInput);
      return await this.authorRepository.save(author);

    } catch (error) {
      handleDBErrors(error);
    }

  }

  // Método para eliminar un autor.
  async remove(id: number): Promise<void> {

    try {
      await this.authorRepository.delete(id);

    } catch (error) {
      handleDBErrors(error);
    }
  }




}
