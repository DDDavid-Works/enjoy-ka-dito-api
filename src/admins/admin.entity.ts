import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type AdminRole = 'admin'

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', unique: true })
  email!: string

  @Column({ type: 'varchar' })
  passwordHash!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', default: 'admin' })
  role!: AdminRole

  @Column({ type: 'boolean', default: true })
  active!: boolean

  @CreateDateColumn()
  createdAt!: Date
}
