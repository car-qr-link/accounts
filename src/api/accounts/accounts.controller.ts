import { accounts } from '@car-qr-link/apis';
import { Body, Controller, Get, Logger, NotFoundException, Param, Patch, Query } from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
    private readonly logger = new Logger(AccountsController.name);

    @Get()
    async select(): Promise<accounts.GetAccountsResponse> {
        return { accounts: [] };
    }

    @Get(':value')
    async get(
        @Param('value') value: string,
        @Query('field') field: accounts.GetAccountFieldParam = accounts.GetAccountFieldParam.ID
    ): Promise<accounts.GetAccountResponse> {
        this.logger.log({ value, field });

        throw new NotFoundException();
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() body: accounts.EditAccountRequest
    ): Promise<accounts.EditAccountResponse> {
        this.logger.log({ id, body });

        throw new NotFoundException();
    }
}
