import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({
  name: 'users',
})

export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar' })
  nickname: string

  @Column({ type: 'varchar' })
  phone: string

  @Column({ type: 'varchar' })
  ip: string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}