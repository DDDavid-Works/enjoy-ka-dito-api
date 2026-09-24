import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Package } from '../packages/package.entity.js'

export type InquiryStatus = 'new' | 'contacted' | 'closed'

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar' })
  email!: string

  @Column({ type: 'varchar', nullable: true })
  destination?: string

  @Column({ type: 'text' })
  message!: string

  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  package?: Package | null

  @Column({ type: 'varchar', default: 'new' })
  status!: InquiryStatus

  @CreateDateColumn()
  createdAt!: Date
}
