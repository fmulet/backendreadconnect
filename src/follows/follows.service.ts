
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBErrors } from 'src/helpers/helpers';
import { Repository } from 'typeorm';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowsService {

  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>
  ) { }



  async create(createFollowInput: CreateFollowInput): Promise<Follow> {
    try {
      // Comprobar si ya existe una relación de seguimiento
      const existingFollow = await this.followsRepository.findOne({
        where: {
          follower: { id: createFollowInput.followerId },
          following: { id: createFollowInput.followingId }
        }
      });

      if (existingFollow) {
        throw new BadRequestException('Ya estás siguiendo a este usuario.');
      }
      if (createFollowInput.followerId === createFollowInput.followingId) {
        throw new BadRequestException('No puedes seguirte a ti mismo.');
      }


      const newFollow = this.followsRepository.create({
        follower: { id: createFollowInput.followerId },
        following: { id: createFollowInput.followingId }
      });
      await this.followsRepository.save(newFollow);
      return newFollow;

    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.followsRepository.find();
  }

  async findOneById(id: string): Promise<Follow> {
    try {
      return await this.followsRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }


  async findFollowers(userId: string): Promise<Follow[]> {
    return await this.followsRepository.find({
      where: {
        following: { id: userId },
      },
      relations: ['follower'],
    });
  }

  async findFollowing(userId: string): Promise<Follow[]> {
    return await this.followsRepository.find({
      where: {
        follower: { id: userId },
      },
      relations: ['following'],
    });
  }

  async update(id: string, updateFollowInput: UpdateFollowInput): Promise<Follow> {
    try {

      const follow = await this.followsRepository.findOneOrFail({ where: { id } });
      if (!follow) {
        throw new NotFoundException(`Follow with id ${id} not found`);
      }

      Object.assign(follow, updateFollowInput);
      return await this.followsRepository.save(follow);

    } catch (error) {
      handleDBErrors(error);
    }

  }

  async remove(id: string): Promise<void> {

    try {
      await this.followsRepository.delete(id);

    } catch (error) {
      handleDBErrors(error);
    }
  }



}

