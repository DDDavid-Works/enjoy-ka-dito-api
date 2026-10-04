import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

// Single-row table: the company's public contact details, editable from the admin.
@Entity('company_details')
export class CompanyDetails {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', default: '' })
  email!: string

  @Column({ type: 'text', default: '' })
  address!: string

  @Column({ type: 'jsonb', default: [] })
  contactNumbers!: string[]

  @UpdateDateColumn()
  updatedAt!: Date
}
