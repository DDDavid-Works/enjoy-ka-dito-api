import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

// Single-row table: the company's public contact details, editable from the admin.
@Entity('company_details')
export class CompanyDetails {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // The first of `emails`, kept so older clients that only know about one address keep working.
  @Column({ type: 'varchar', default: '' })
  email!: string

  @Column({ type: 'jsonb', default: [] })
  emails!: string[]

  @Column({ type: 'text', default: '' })
  address!: string

  @Column({ type: 'jsonb', default: [] })
  contactNumbers!: string[]

  @UpdateDateColumn()
  updatedAt!: Date
}
