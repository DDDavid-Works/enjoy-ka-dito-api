import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ALL_MODULES, type AppModule } from '../auth/modules.js'

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

  @Column({ type: 'varchar', nullable: true })
  contactNumber?: string | null

  // Existing users get every module when this column is first added, so nobody is locked out.
  @Column({
    type: 'text',
    array: true,
    default: () => `ARRAY[${ALL_MODULES.map((m) => `'${m}'`).join(',')}]::text[]`,
  })
  modules!: AppModule[]

  @Column({ type: 'varchar', default: 'admin' })
  role!: AdminRole

  @Column({ type: 'boolean', default: true })
  active!: boolean

  @CreateDateColumn()
  createdAt!: Date
}
