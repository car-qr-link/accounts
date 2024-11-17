import { accounts } from '@car-qr-link/apis';
import { Body, Controller, Get, Logger, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { accountToDto, qrToDto } from '../api.converter';
import { QrsService } from 'src/core/qrs/qrs.service';

@Controller('accounts')
export class AccountsController {
    private readonly logger = new Logger(AccountsController.name);

    constructor(
        private readonly accountsService: AccountsService,
        private readonly qrsService: QrsService,
    ) { }

    @Get()
    async select(): Promise<accounts.GetAccountsResponse> {
        const items = await this.accountsService.select();
        return { accounts: items.map(account => accountToDto(account)) };
    }

    @Get(':value')
    async get(
        @Param('value') value: string,
        @Query('field') field: accounts.GetAccountFieldParam = accounts.GetAccountFieldParam.ID
    ): Promise<accounts.GetAccountResponse> {
        const item = await this.accountsService.getBy({ [field]: value });
        const qrs = await this.qrsService.select(item.id.toString());

        return { account: accountToDto(item), qrs: qrs.map(qr => qrToDto(qr)) };
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() body: accounts.EditAccountRequest
    ): Promise<accounts.EditAccountResponse> {
        const { contacts, ...account } = body.account;
        const item = await this.accountsService.update(id, account, contacts);
        const qrs = await this.qrsService.select(item.id.toString());

        return { account: accountToDto(item), qrs: qrs.map(qr => qrToDto(qr)) };
    }
}
