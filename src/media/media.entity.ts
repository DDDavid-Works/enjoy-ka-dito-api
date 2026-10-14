import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

// An uploaded, already resized image. Stored in the database (Railway's API service has no persistent disk)
// and served by GET /media/:id.
@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  contentType!: string

  @Column({ type: 'int' })
  width!: number

  @Column({ type: 'int' })
  height!: number

  @Column({ type: 'bytea' })
  data!: Buffer

  @Column({ type: 'varchar', nullable: true })
  originalName?: string

  @CreateDateColumn()
  createdAt!: Date
}
