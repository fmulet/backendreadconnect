
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBErrors } from 'src/helpers/helpers';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';


@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOneById(id: number): Promise<Category> {
    try {
      return await this.categoryRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create(createCategoryInput);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Método para actualizar un autor.
  async update(id: number, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    try {

      const category = await this.categoryRepository.findOneOrFail({ where: { id } });
      if (!category) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      Object.assign(category, updateCategoryInput);
      return await this.categoryRepository.save(category);

    } catch (error) {
      handleDBErrors(error);
    }

  }

  // Método para eliminar un autor.
  async remove(id: number): Promise<void> {

    try {
      await this.categoryRepository.delete(id);

    } catch (error) {
      handleDBErrors(error);
    }
  }
}

