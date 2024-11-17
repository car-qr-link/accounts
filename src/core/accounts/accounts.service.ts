import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, BaseAccount, BaseContact, Contact } from './accounts.entity';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import { NotificationChannel } from '@car-qr-link/apis';

@Injectable()
export class AccountsService {
    private readonly logger = new Logger(AccountsService.name);

    constructor(
        @InjectRepository(Account)
        private readonly accounts: Repository<Account>,
        private readonly dataSource: DataSource
    ) { }

    async select(): Promise<Account[]> {
        return this.accounts.find();
    }

    async getOrCreate(account: BaseAccount, contacts: BaseContact[]): Promise<Account> {
        const phoneNumber = contacts.find(contact => contact.channel === NotificationChannel.Phone)?.address;
        if (!phoneNumber) {
            throw new BadRequestException("Не указан номер телефона");
        }

        const item = await this.accounts.findOne({ where: { phone: phoneNumber } });
        if (item) {
            return item;
        }

        await this.dataSource.transaction(async manager => {
            const accountResult = await manager.insert(Account, {
                ...account,
                phone: phoneNumber
            });
            const accountId = accountResult.identifiers[0].id;

            await manager.insert(Contact, contacts.map(contact => ({ ...contact, accountId })));
        });

        return this.getBy({ phone: phoneNumber });
    }

    async getBy({ id, phone }: { id?: string, phone?: string }): Promise<Account> {
        if (!id && !phone) {
            throw new BadRequestException("Не указан критерий поиска");
        }

        const filter: FindOptionsWhere<Account> = {};
        if (id) {
            filter.id = parseInt(id);
        }
        if (phone) {
            filter.phone = phone;
        }

        const item = await this.accounts.findOne({ where: filter, relations: ['contacts'], relationLoadStrategy: 'query' });
        if (!item) {
            throw new NotFoundException();
        }
        return item;
    }

    async update(id: string, account: BaseAccount, contacts: BaseContact[]): Promise<Account> {
        if (!await this.accounts.existsBy({ id: parseInt(id) })) {
            throw new NotFoundException('Аккаунт не найден');
        }

        await this.dataSource.transaction(async manager => {
            await manager.update(
                Account,
                { id: parseInt(id) },
                account
            );
            await manager.delete(
                Contact,
                {
                    accountId: parseInt(id),
                    channel: In(contacts.map(contact => contact.channel))
                }
            );
            await manager.insert(
                Contact,
                contacts
                    .filter(contact => contact.address)
                    .map(contact => ({ ...contact, accountId: parseInt(id) }))
            );
        });

        return this.getBy({ id });
    }
}
