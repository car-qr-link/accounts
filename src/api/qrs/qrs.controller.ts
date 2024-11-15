import { accounts } from '@car-qr-link/apis';
import { Body, Controller, Get, Logger, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('qrs')
export class QrsController {
    private readonly logger = new Logger(QrsController.name);

    @Get()
    async select(
        @Query() query: accounts.GetQrsParams
    ): Promise<accounts.GetQrsResponse> {
        this.logger.log({ query });

        return { qrs: [] };
    }

    @Get(':code')
    async get(
        @Param('code') code: string
    ): Promise<accounts.GetQrResponse> {
        this.logger.log({ code });

        throw new NotFoundException();
    }

    @Post('emit')
    async emit(
        @Body() body: accounts.EmitQrsRequest
    ): Promise<accounts.EmitQrsResponse> {
        this.logger.log({ body });

        return { qrs: [] };
    }

    @Patch(':code')
    async link(
        @Param('code') code: string,
        @Body() body: accounts.LinkQrRequest
    ): Promise<accounts.LinkQrResponse> {
        this.logger.log({ code, body });

        throw new NotFoundException();
    }
}
