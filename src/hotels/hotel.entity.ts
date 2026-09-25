import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', nullable: true })
  contactPerson?: string

  @Column({ type: 'varchar', nullable: true })
  contactNumbers?: string

  @Column({ type: 'varchar' })
  region!: string

  @Column({ type: 'int', default: 0 })
  starRating!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
