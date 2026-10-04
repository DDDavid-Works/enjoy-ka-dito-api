import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Package } from '../packages/package.entity.js'
import { Quotation } from '../quotations/quotation.entity.js'

export type InquiryStatus = 'new' | 'contacted' | 'closed'
// 'quote' = a request for a quote; 'general' = a plain question from the Contact Us form.
export type InquiryType = 'quote' | 'general'
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

  // Quotations created from this inquiry (loaded as just id and title on the list).
  @OneToMany(() => Quotation, (quotation) => quotation.inquiry)
  quotations?: Quotation[]

  @Column({ type: 'varchar', default: 'quote' })
  type!: InquiryType

  @Column({ type: 'varchar', default: 'new' })
  status!: InquiryStatus

  @CreateDateColumn()
  createdAt!: Date
}
