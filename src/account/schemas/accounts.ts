import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'

@Entity('Accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 128, nullable: false })
  name: string;

  @Index({ unique: true })
  @Column("varchar", { length: 16, nullable: false})
  phone: string;

  @CreateDateColumn({ type: "datetime", nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime", nullable: false })
  updated_at: Date;

  @OneToMany(() => Qr, (qr) => qr.account)
  qrs: Qr[]
  
  @OneToMany(() => Contact, (contact) => contact.account)
  contacts: Contact[]
}

@Entity('Contacts')
export class Contact {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne((type) => Account)
  @JoinColumn()
  account: Account

  @Column("varchar", { length: 8, nullable: false })
  type: string;

  @Column("varchar", { length: 128, nullable: false })
  address: string

  @CreateDateColumn({ type: "datetime", nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime", nullable: false })
  updated_at: Date;
}

@Entity('Qrs')
export class Qr {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column("varchar", { length: 8, nullable: false })
  code: string;

  @Index()
  @ManyToOne((type) => Account)
  @JoinColumn()
  account: Account

  @CreateDateColumn({ type: "datetime", nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime", nullable: false })
  updated_at: Date;

}