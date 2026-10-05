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

export type QuotationSubDetail = {
  text: string
  price?: number
}

export type QuotationDetail = {
  text: string
  price?: number
  details: QuotationSubDetail[]
}

export type QuotationInclusion = {
  text: string
  price?: number
  details: QuotationDetail[]
}

export type QuotationAccommodation = {
  hotelId: string
  nights: number
  remarks?: string
  ratePerHead?: number
}

export type QuotationOptionalTour = {
  text: string
  details: string[]
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

  // Internal, used for quotations only. Never exposed on the public website API.
  @Column({ type: 'jsonb', default: [] })
  quotationInclusions!: QuotationInclusion[]

  @Column({ type: 'jsonb', default: [] })
  quotationAccommodations!: QuotationAccommodation[]

  // Free-text notes printed under the inclusions on a quotation (e.g. a tour note).
  @Column({ type: 'text', default: '' })
  quotationInclusionNotes!: string

  @Column({ type: 'jsonb', default: [] })
  quotationExclusions!: string[]

  @Column({ type: 'jsonb', default: [] })
  quotationOptionalTours!: QuotationOptionalTour[]

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
