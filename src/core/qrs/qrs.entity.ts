import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Account } from "../accounts/accounts.entity";


export abstract class BaseQR {
    @Column({ type: 'varchar', length: 10, nullable: true })
    licensePlate?: string | null;
}

@Entity('qrs')
export class QR extends BaseQR {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    _id: number;

    @Column({ type: 'varchar', length: 8, nullable: false, unique: true })
    code: string;

    @Column({ type: 'bigint', unsigned: true, nullable: true })
    accountId: number | null;

    @ManyToOne(() => Account)
    account: Account | null;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}