// thread.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './user';
import { Replies } from './replies';
import { Likes } from './likes';

@Entity({ name: 'threads' })
export class Threads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  content: string;

  @Column({nullable: true})
  image: string;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.threads)
  createdById: Users;

  @OneToMany(() => Replies, (reply) => reply.threadId)
  replies: Replies[];

  @OneToMany(() => Likes, (like) => like.threadId)
  likes: Likes[];
}
