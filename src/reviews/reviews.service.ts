import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { handleDBErrors } from 'src/helpers/helpers';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }



  async create(createReviewInput: CreateReviewInput): Promise<Review> {
    try {
      // Obtiene las entidades User y Book basadas en los IDs proporcionados
      const user = await this.userRepository.findOneByOrFail({ id: createReviewInput.userId });
      const book = await this.bookRepository.findOneByOrFail({ id: createReviewInput.bookId });

      // Verifica que ambos, el usuario y el libro, existan
      if (!user || !book) {
        throw new NotFoundException('User or Book not found');
      }

      // Crea la reseña con las relaciones establecidas
      const newReview = this.reviewRepository.create({
        ...createReviewInput,
        user: user,
        book: book
      });

      // Guarda y devuelve la reseña
      return await this.reviewRepository.save(newReview);
    } catch (error) {
      handleDBErrors(error);
    }
  }


  async findAll() {
    return await this.reviewRepository.find();
  }

  async findOneById(id: string): Promise<Review> {
    try {
      return await this.reviewRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }


  async update(id: string, updateReviewInput: UpdateReviewInput): Promise<Review> {
    try {

      const review = await this.reviewRepository.findOneOrFail({ where: { id } });
      if (!review) {
        throw new NotFoundException(`Review with id ${id} not found`);
      }

      Object.assign(review, updateReviewInput);
      return await this.reviewRepository.save(review);

    } catch (error) {
      handleDBErrors(error);
    }

  }

  async remove(id: string): Promise<void> {

    try {
      await this.reviewRepository.delete(id);

    } catch (error) {
      handleDBErrors(error);
    }
  }
}
