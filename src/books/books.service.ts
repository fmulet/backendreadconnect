import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { handleDBErrors } from 'src/helpers/helpers';
import { In, Repository } from 'typeorm';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)  // Asegúrate de importar Author y AuthorRepository
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Category)  // Asegúrate de importar Category y CategoryRepository
    private readonly categoryRepository: Repository<Category>
  ) { }

  // Método para crear un libro.

  async create(createBookInput: CreateBookInput): Promise<Book> {
    try {

      const authors = await this.authorRepository.find({
        where: {
          id: In(createBookInput.authors)
        }
      });

      const categories = await this.categoryRepository.find({
        where: {
          id: In(createBookInput.categories)
        }
      });

      const bookData = {
        ...createBookInput,
        authors,
        categories,
      };

      const newBook = this.bookRepository.create(bookData);
      return await this.bookRepository.save(newBook);
    } catch (error) {
      handleDBErrors(error);
    }
  }


  // Método para obtener todos los libros.

  async findAll(limit: number = 10, offset: number = 0): Promise<Book[]> {
    return await this.bookRepository.find({
      take: limit,
      skip: offset,
      relations: ['authors', 'categories']
    });
  }


  // Método para obtener un libro específico.
  async findOneById(id: number): Promise<Book> {
    try {
      return await this.bookRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  // Método para actualizar un libro.
  async update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    try {

      const book = await this.bookRepository.findOneOrFail({ where: { id } });
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }

      Object.assign(book, updateBookInput);
      return await this.bookRepository.save(book);

    } catch (error) {
      handleDBErrors(error);
    }

  }

  // Método para eliminar un libro.
  async remove(id: number): Promise<void> {

    try {
      await this.bookRepository.delete(id);

    } catch (error) {
      handleDBErrors(error);
    }
  }

}
