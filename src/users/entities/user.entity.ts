import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Follow } from "src/follows/entities/follow.entity";
import { Review } from "src/reviews/entities/review.entity";
import { UserBook } from "src/user-books/entities/user-book.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column('varchar', { unique: true })
  email: string;

  // Nota: No exponemos la contraseña en GraphQL
  @Column('varchar')
  password: string;

  @Field()
  @Column('boolean', { default: true })
  isActive: boolean;

  @Field(() => [String])
  @Column({
    type: "simple-array",
  })
  roles: string[];

  @OneToMany(() => Review, review => review.user)
  @Field(() => [Review], { nullable: true })
  reviews: Review[];

  @OneToMany(() => UserBook, userBook => userBook.user, { lazy: true })
  @Field(() => [UserBook], { nullable: true })
  userBooks: UserBook[];

  // Usuarios que siguen a este usuario
  @OneToMany(() => Follow, follow => follow.follower)
  @Field(() => [Follow], { nullable: true })
  followedBy: Follow[];

  // Usuarios a los que este usuario sigue
  @OneToMany(() => Follow, follow => follow.following)
  @Field(() => [Follow], { nullable: true })
  follows: Follow[];

  @Field(() => Date)
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
