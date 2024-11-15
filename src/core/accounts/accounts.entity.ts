import { NotificationChannel } from "@car-qr-link/apis";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
    phone: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    name: string | null;

    @OneToMany(() => Contact, contact => contact.account)
    contacts: Contact[];

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}

@Entity('contacts')
@Index(['account', 'type', 'value'], { unique: true })
export class Contact {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    _id: number;

    @Column({ type: 'bigint', unsigned: true, nullable: false })
    accountId: number;

    @ManyToOne(() => Account, account => account.contacts, { nullable: false })
    // @JoinColumn()
    account: Account;

    @Column({ type: 'varchar', length: 16, nullable: false })
    type: NotificationChannel;

    @Column({ type: 'varchar', length: 64, nullable: false })
    value: string;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}