import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Inquiry } from '../inquiries/inquiry.entity.js'
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

  // Who the quotation is for.
  @Column({ type: 'varchar', default: '' })
  customerName!: string

  // Calendar date (YYYY-MM-DD); no time zone involved.
  @Column({ type: 'date', nullable: true })
  quoteDate?: string | null

  @Column({ type: 'text', default: '' })
  remarks!: string

  // The package this quotation was started from, if any. Informational only.
  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  package?: Package | null

  // The inquiry this quotation was created from, if any.
  @ManyToOne(() => Inquiry, (inquiry) => inquiry.quotations, { nullable: true, onDelete: 'SET NULL' })
  inquiry?: Inquiry | null

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
