import { accounts } from '@car-qr-link/apis';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QrsService } from 'src/core/qrs/qrs.service';
import { accountToDto, qrToDto } from '../api.converter';
import { AccountsService } from 'src/core/accounts/accounts.service';

@Controller('qrs')
export class QrsController {
  private readonly logger = new Logger(QrsController.name);

  constructor(
    private readonly qrsService: QrsService,
    private readonly accountsService: AccountsService,
  ) {}

  @Get()
  async select(
    @Query() query: accounts.GetQrsParams,
  ): Promise<accounts.GetQrsResponse> {
    return {
      qrs: await this.qrsService
        .select(query.accountId)
        .then((items) => items.map(qrToDto)),
    };
  }

  @Get(':code')
  async get(@Param('code') code: string): Promise<accounts.GetQrResponse> {
    const item = await this.qrsService.get(code);

    return { qr: qrToDto(item), account: accountToDto(item.account) };
  }

  @Post('emit')
  async emit(
    @Body() body: accounts.EmitQrsRequest,
  ): Promise<accounts.EmitQrsResponse> {
    const items = await this.qrsService.emit(body.count, body.length);

    return { qrs: items.map(qrToDto) };
  }

  @Patch(':code')
  async link(
    @Param('code') code: string,
    @Body() body: accounts.LinkQrRequest,
  ): Promise<accounts.LinkQrResponse> {
    // TODO: transaction
    const account = await this.accountsService.getOrCreate(
      body.account,
      body.account.contacts,
    );

    const item = await this.qrsService.link(
      code,
      account.id.toString(),
      body.qr,
    );

    return { qr: qrToDto(item), account: accountToDto(item.account) };
  }
}
