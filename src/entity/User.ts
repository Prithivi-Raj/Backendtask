// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
// import { ObjectType, Field, ID } from "type-graphql";

// @ObjectType()
// @Entity()
// export class User extends BaseEntity {
//   @Field(() => ID)
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field()
//   @Column()
//   userName: string;

//   @Field()
//   @Column("simple-array",{array:true,nullable:true})
//   post: string;

//   @Field()
//   @Column("text", { unique: true })
//   email: string;


//   @Column()
//   password: string;
// }

// @Entity()
// export class Posts extends BaseEntity {
  
//   @Field()
//   @Column()
//   title: string;

//   @Field()
//   @PrimaryGeneratedColumn()
//   By: User;
// }

import { Field, ID, ObjectType} from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  // JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Field()
  @Column({nullable:true})
  username: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => [Post], {
    nullable: true,
  })
  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];

  @Column('boolean', {
    default: false,
  })
  confirmed: boolean;
}