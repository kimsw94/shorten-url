import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({
  name: 'URLS',
})

export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  url: string

  @Column({ type: 'varchar' })
  newUrl: string

  @Column({ type: 'varchar' })
  ip: string

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
