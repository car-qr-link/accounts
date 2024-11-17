import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { QrsModule as CoreQrsModule } from 'src/core/qrs/qrs.module';
import { AccountsModule as CoreAccountsModule } from 'src/core/accounts/accounts.module';

@Module({
  imports: [CoreQrsModule, CoreAccountsModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
