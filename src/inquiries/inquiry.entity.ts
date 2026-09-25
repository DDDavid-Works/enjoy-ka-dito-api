import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Package } from '../packages/package.entity.js'

export type InquiryStatus = 'new' | 'contacted' | 'closed'
export type TravelerType = 'Corporate Group' | 'Family' | 'Senior Group' | 'Solo Foreigner'

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', nullable: true })
  companyName?: string

  @Column({ type: 'varchar', nullable: true })
  designation?: string

  @Column({ type: 'varchar' })
  email!: string

  @Column({ type: 'varchar', nullable: true })
  phone?: string

  @Column({ type: 'varchar', nullable: true })
  budgetBracket?: string

  @Column({ type: 'varchar', nullable: true })
  travelerType?: TravelerType

  @Column({ type: 'varchar', nullable: true })
  destination?: string

  @Column({ type: 'varchar', nullable: true })
  travelerCount?: string

  @Column({ type: 'varchar', nullable: true })
  travelDates?: string

  @Column({ type: 'varchar', nullable: true })
  countryOfResidence?: string

  @Column({ type: 'varchar', nullable: true })
  groupType?: string

  @Column({ type: 'varchar', nullable: true })
  travelingWithSeniorsOrChildren?: string

  @Column({ type: 'varchar', nullable: true })
  flightsBooked?: string

  @Column({ type: 'varchar', nullable: true })
  desiredDestinations?: string

  @Column({ type: 'varchar', nullable: true })
  tripDuration?: string

  @Column({ type: 'text', nullable: true })
  message?: string

  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  package?: Package | null

  @Column({ type: 'varchar', default: 'new' })
  status!: InquiryStatus

  @CreateDateColumn()
  createdAt!: Date
}
