import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {
  Package,
  type QuotationAccommodation,
  type QuotationInclusion,
  type QuotationOptionalTour,
} from '../packages/package.entity.js'

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  title!: string

  // The package this quotation was started from, if any. Informational only.
  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  package?: Package | null

  @Column({ type: 'jsonb', default: [] })
  inclusions!: QuotationInclusion[]

  @Column({ type: 'jsonb', default: [] })
  accommodations!: QuotationAccommodation[]

  @Column({ type: 'jsonb', default: [] })
  exclusions!: string[]

  @Column({ type: 'jsonb', default: [] })
  optionalTours!: QuotationOptionalTour[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
