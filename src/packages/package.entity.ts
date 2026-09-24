import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export type PackageCategory = 'Local Tours' | 'International' | 'Corporate / Group'
export type PackageStatus = 'draft' | 'published'

export type ItineraryDay = {
  label: string
  description: string
}

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  title!: string

  @Column({ type: 'varchar', unique: true })
  slug!: string

  @Column({ type: 'varchar', nullable: true })
  location?: string

  @Column({ type: 'varchar', nullable: true })
  duration?: string

  @Column({ type: 'varchar' })
  category!: PackageCategory

  @Column({ type: 'varchar', nullable: true })
  price?: string

  @Column({ type: 'varchar', nullable: true })
  pax?: string

  @Column({ type: 'text', nullable: true })
  summary?: string

  @Column({ type: 'jsonb', default: [] })
  itinerary!: ItineraryDay[]

  @Column({ type: 'jsonb', default: [] })
  inclusions!: string[]

  @Column({ type: 'jsonb', default: [] })
  exclusions!: string[]

  @Column({ type: 'text', nullable: true })
  termsAndConditions?: string

  @Column({ type: 'varchar', nullable: true })
  mainImage?: string

  @Column({ type: 'varchar', nullable: true })
  poster?: string

  @Column({ type: 'jsonb', default: [] })
  gallery!: string[]

  @Column({ type: 'varchar', default: 'draft' })
  status!: PackageStatus

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
