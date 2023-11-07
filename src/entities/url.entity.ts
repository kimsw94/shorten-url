import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'URLS',
})

export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  url: string

  @Column({ type: 'varchar' })
  shorten_url: string

  @Column({ type: 'varchar' })
  ip_log: string
}
