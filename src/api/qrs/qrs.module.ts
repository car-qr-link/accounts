import { Module } from '@nestjs/common';
import { QrsController } from './qrs.controller';
import { QrsModule as CoreQrsModule } from 'src/core/qrs/qrs.module';
import { AccountsModule as CoreAccountsModule } from 'src/core/accounts/accounts.module';

@Module({
  imports: [CoreQrsModule, CoreAccountsModule],
  controllers: [QrsController]
})
export class QrsModule { }
