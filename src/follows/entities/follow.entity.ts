
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'follows' })
@ObjectType()
export class Follow {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'followingId' })
  following: User;
}

