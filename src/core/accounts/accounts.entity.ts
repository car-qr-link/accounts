import { NotificationChannel } from "@car-qr-link/apis";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseAccount {
    @Column({ type: 'varchar', length: 128, nullable: true })
    name?: string | null;
}

@Entity('accounts')
export class Account extends BaseAccount {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
    phone: string;

    @OneToMany(() => Contact, contact => contact.account)
    contacts: Contact[];

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}

export class BaseContact {
    @Column({ type: 'varchar', length: 16, nullable: false })
    channel: NotificationChannel;

    @Column({ type: 'varchar', length: 64, nullable: false })
    value: string;
}

@Entity('contacts')
@Index(['account', 'channel', 'value'], { unique: true })
export class Contact extends BaseContact {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    _id: number;

    @Column({ type: 'bigint', unsigned: true, nullable: false })
    accountId: number;

    @ManyToOne(() => Account, account => account.contacts, { nullable: false })
    account: Account;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}