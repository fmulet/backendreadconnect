import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { AuthorsService } from 'src/authors/authors.service';  // Asume que tienes un servicio para autores
import { CategoriesService } from 'src/categories/categories.service';  // Asume que tienes un servicio para categor’as
import { Book } from 'src/books/entities/book.entity';
import { EntityManager, Repository } from 'typeorm';
import { SEED_BOOKS } from './data/books';
import { SEED_AUTHORS } from './data/authors';  // Importando el archivo de autores
import { SEED_CATEGORIES } from './data/categories';  // Importando el archivo de categor’as
import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import { UserBook } from 'src/user-books/entities/user-book.entity';
import { User } from 'src/users/entities/user.entity';
import { SEED_USERS } from './data/users';
import { AuthService } from 'src/auth/auth.service';
import { FollowsService } from 'src/follows/follows.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { BookStatus } from 'src/user-books/enum/status';
import { UserBooksService } from 'src/user-books/user-books.service';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserBook)
    private readonly userBookRepository: Repository<UserBook>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService,  // Inyecta el servicio de autores
    private readonly categoriesService: CategoriesService,  // Inyecta el servicio de categor’as
    private readonly manager: EntityManager,
    private readonly authService: AuthService,
    private readonly followsService: FollowsService,
    private readonly reviewsService: ReviewsService,
    private readonly userBookService: UserBooksService
  ) { }


  async executeSeed() {
    await this.clearData();
    await this.loadUsers();
    await this.loadAuthors();
    await this.loadCategories();
    await this.loadBooks();
    await this.loadReviewsBasedOnDb();
    await this.loadFollowsBasedOnDb();
    await this.loadUserBooksBasedOnDb();
    return true;
  }

  async loadUsers(): Promise<void> {
    for (const user of SEED_USERS) {
      try {
        await this.authService.signup(user);
      } catch (error) {
        console.error(`Error al procesar el user con nombre: ${user.name}`, error);
      }
    }
  }

  async loadFollowsBasedOnDb(): Promise<void> {


    // 2. Obtiene los UUIDs de los usuarios insertados
    const users = await this.userRepository.find();
    const userUuids = users.map(user => user.id);

    // 3. Genera relaciones aleatorias de "follows"
    const follows = [];
    for (let i = 0; i < userUuids.length; i++) {
      const followerId = userUuids[i];
      const followingIds = userUuids.filter(id => id !== followerId);
      for (let j = 0; j < followingIds.length; j++) {
        if (Math.random() > 0.5) {  // 50% de probabilidad de seguir a otro usuario
          follows.push({
            followerId: followerId,
            followingId: followingIds[j]
          });
        }
      }
    }

    // 4. Inserta las relaciones de "follows"
    for (const follow of follows) {
      try {
        await this.followsService.create(follow);
      } catch (error) {
        console.error(`Error al procesar el follow del usuario con ID: ${follow.followerId} al usuario con ID: ${follow.followingId}`, error);
      }
    }
  }

  async loadAuthors(): Promise<void> {
    for (const author of SEED_AUTHORS) {
      try {
        await this.authorsService.create(author);
      } catch (error) {
        console.error(`Error al procesar el autor con nombre: ${author.name}`, error);
      }
    }
  }

  async loadCategories(): Promise<void> {
    for (const category of SEED_CATEGORIES) {
      try {
        await this.categoriesService.create(category);
      } catch (error) {
        console.error(`Error al procesar la categoría con nombre: ${category.name}`, error);
      }
    }
  }

  async loadBooks(): Promise<void> {
    const booksPromises = [];

    for (const book of SEED_BOOKS) {
      try {
        const mappedBook = {
          ...book,
          authors: book.authors,  // Los autores ya están en el formato correcto
          categories: book.categories,  // Las categorías ya están en el formato correcto
          publishedDate: book.publishedDate && book.publishedDate.$date
            ? new Date(book.publishedDate.$date)
            : new Date('1900-01-01')  // Asignar fecha predeterminada si no hay fecha de publicación
        };
        booksPromises.push(this.booksService.create(mappedBook));
      } catch (error) {
        console.error(`Error procesando el libro con ISBN: ${book.isbn}`, error);
      }
    }

    await Promise.all(booksPromises);
  }

  async clearData(): Promise<void> {

    await this.manager.query('SET foreign_key_checks = 0');

    // Limpiar las tablas en orden inverso debido a las relaciones
    await this.manager.query('TRUNCATE TABLE books_authors_authors');
    await this.manager.query('TRUNCATE TABLE books_categories_categories');

    await this.reviewRepository.clear();

    await this.followRepository.clear();
    await this.userBookRepository.clear();

    // Si tienes repositorios para autores y categorÃ­as, tambiÃ©n deberÃ­as limpiar esas tablas.
    // Por ejemplo:
    await this.authorRepository.clear();
    await this.categoryRepository.clear();
    await this.bookRepository.clear();
    await this.userRepository.clear();

    await this.manager.query('SET foreign_key_checks = 1');

  }

  async loadReviewsBasedOnDb(): Promise<void> {
    // 1. Inserta usuarios (si aún no lo has hecho)


    // 2. Obtiene los UUIDs de los usuarios insertados
    const users = await this.userRepository.find();
    const userUuids = users.map(user => user.id);

    // 3. Obtiene los IDs (enteros) de los libros
    const books = await this.bookRepository.find();
    const bookIds = books.map(book => book.id);

    // 4. Genera reseñas aleatorias
    const reviews = [];
    for (let i = 0; i < userUuids.length; i++) {
      const userId = userUuids[i];
      const bookId = bookIds[Math.floor(Math.random() * bookIds.length)];  // Selecciona un libro aleatoriamente
      const content = `This is a review by user ${i}`;  // Genera contenido aleatorio para la reseña
      const rating = Math.floor(Math.random() * 5) + 1;  // Genera una calificación aleatoria entre 1 y 5
      reviews.push({
        content: content,
        rating: rating,
        userId: userId,
        bookId: bookId
      });
    }

    // 5. Inserta las reseñas
    for (const review of reviews) {
      try {
        await this.reviewsService.create(review);
      } catch (error) {
        console.error(`Error al procesar la reseña del usuario con ID: ${review.userId} para el libro con ID: ${review.bookId}`, error);
      }
    }
  }

  async loadUserBooksBasedOnDb(): Promise<void> {
    // 1. Obtener todos los usuarios y todos los libros
    const users = await this.userRepository.find();
    const books = await this.bookRepository.find();

    // 2. Generar relaciones aleatorias User-Book
    const userBooks = [];
    for (let user of users) {
      const userBookIds = new Set<number>();

      const numberOfBooks = Math.floor(Math.random() * books.length); // Cantidad aleatoria de libros por usuario

      for (let i = 0; i < numberOfBooks; i++) {
        let book;
        do {
          book = books[Math.floor(Math.random() * books.length)];
        } while (userBookIds.has(book.id));

        userBookIds.add(book.id);

        const status = Math.random() > 0.5 ? BookStatus.WANTED : BookStatus.READ;

        userBooks.push({
          user: user,
          book: book,
          status: status
        });
      }
    }

    // 3. Insertar las relaciones en la base de datos
    for (const userBook of userBooks) {
      try {
        // Suponiendo que tienes un método `createUserBook` en `UserBookService` o un método similar.
        await this.userBookService.create(userBook);
      } catch (error) {
        console.error(`Error al procesar el UserBook del usuario con ID: ${userBook.user.id} para el libro con ID: ${userBook.book.id}`, error);
      }
    }
  }


}
