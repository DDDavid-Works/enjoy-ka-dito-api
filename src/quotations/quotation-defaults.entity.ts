import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

// Single-row table: the notes new quotations start with. Admin-only (holds bank details).
@Entity('quotation_defaults')
export class QuotationDefaults {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text', default: '' })
  inclusionNotes!: string

  @Column({ type: 'text', default: '' })
  paymentNotes!: string

  @Column({ type: 'text', default: '' })
  importantNotes!: string

  @UpdateDateColumn()
  updatedAt!: Date
}
