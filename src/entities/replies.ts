// reply.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './user';
import { Threads } from './threads';

@Entity({ name: 'replies' })
export class Replies {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.replies)
  userId: Users;

  @ManyToOne(() => Threads, (thread) => thread.replies)
  threadId: Threads;

  @Column()
  image: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;
}
