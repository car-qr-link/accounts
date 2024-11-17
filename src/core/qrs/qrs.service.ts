import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BaseQR, QR } from './qrs.entity';
import { accounts, Qr } from '@car-qr-link/apis';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QrsService {
    private readonly logger = new Logger(QrsService.name);

    constructor(
        @InjectRepository(QR)
        private readonly qrs: Repository<QR>
    ) { }

    async select(accountId?: string | null): Promise<QR[]> {
        const filter: FindOptionsWhere<QR> = { accountId: accountId ? parseInt(accountId) : IsNull() };

        return this.qrs.find({ where: accountId === undefined ? undefined : filter });
    }

    async get(code: string): Promise<QR> {
        const item = await this.qrs.findOne({ where: { code }, relations: ['account', 'account.contacts'], relationLoadStrategy: 'query' });

        if (!item) {
            throw new NotFoundException();
        }

        return item;
    }

    async emit(count, length: number): Promise<QR[]> {
        const items = Array.from({ length: count }).map(() => ({
            code: this.makeRandomCode(length),
        }));

        return this.qrs.save(items);;
    }

    async link(code: string, accountId: string, fields: BaseQR): Promise<QR> {
        if (!await this.qrs.existsBy({ code })) {
            throw new NotFoundException();
        }

        const updateResult = await this.qrs.update({ code, accountId: IsNull() }, { ...fields, accountId: parseInt(accountId) });
        if (updateResult.affected === 0) {
            throw new ConflictException("QR уже связан с аккаунтом");
        }

        return this.get(code);
    }

    private makeRandomCode(length: number): string {
        return Array.from({ length }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    }
}
