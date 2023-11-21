import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({
  name: 'urls',
})

export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  originalUrl: string

  @Column({ type: 'varchar' })
  newUrl: string

  @Column({ type: 'varchar' })
  ip: string

  @Column({ type: 'varchar' })
  user_id: number

  @Column({ type: 'varchar' })
  product_id: number

  @Column({ type: 'int' })
  redirect: number

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
