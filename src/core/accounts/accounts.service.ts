import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, BaseAccount, BaseContact } from './accounts.entity';
import { DeepPartial, Repository } from 'typeorm';
import { NotificationChannel } from '@car-qr-link/apis';

@Injectable()
export class AccountsService {
    private readonly logger = new Logger(AccountsService.name);

    constructor(
        @InjectRepository(Account)
        private readonly accounts: Repository<Account>
    ) { }

    async getOrCreate(account: BaseAccount, contacts: BaseContact[]): Promise<Account> {
        const phoneNumber = contacts.find(contact => contact.channel === NotificationChannel.Phone)?.value;
        if (!phoneNumber) {
            throw new BadRequestException("Не указан номер телефона");
        }

        const item = await this.accounts.findOne({ where: { phone: phoneNumber } });
        if (item) {
            return item;
        }

        return this.accounts.save({
            ...account,
            phone: phoneNumber,
            contacts,
        });
    }

    async getByPhone(phone: string): Promise<Account> {
        const item = await this.accounts.findOne({ where: { phone } });

        if (!item) {
            throw new NotFoundException("Аккаунт не найден");
        }

        return item;
    }
}
