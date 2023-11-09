import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

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

  @CreateDateColumn() // 이 데코레이터를 사용하여 created_at 필드를 설정
  created_at: Date;

  @CreateDateColumn() // 이 데코레이터를 사용하여 created_at 필드를 설정
  updated_at: Date;
}
