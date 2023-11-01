import { Entity, PrimaryGeneratedColumn, Column, OneToMany,JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Replies } from './replies';
import { Threads } from './threads';
import { Likes } from './likes';
import { Follow } from './following';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  photo_profile: string;

  @Column({nullable: true})
  bio: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Replies, (reply) => reply.userId)
  replies: Replies[];

  @OneToMany(() => Threads, (thread) => thread.createdById)
  threads: Threads[];

  @OneToMany(() => Likes, (like) => like.threadId)
  likes: Likes[];

	// @OneToMany(() => Follow, (follow) => follow.followers, {
	// 	onUpdate: "CASCADE",
	// 	onDelete: "CASCADE",
	// })
	// @JoinColumn()
	// followers: Follow[];

	// @OneToMany(() => Follow, (follow) => follow.following, {
	// 	onUpdate: "CASCADE",
	// 	onDelete: "CASCADE",
	// })
	// @JoinColumn()
	// following: Follow[];
  @ManyToMany(() => Users, (user) => user.following)
  @JoinTable({
    name: "followers",
    joinColumn: {
      name: "follower_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "following_id",
      referencedColumnName: "id",
    },
  })
  followers: Users[];

  @ManyToMany(() => Users, (user) => user.followers)
  following: Users[];
}
