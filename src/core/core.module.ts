import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { QrsModule } from './qrs/qrs.module';

@Module({
  imports: [AccountsModule, QrsModule]
})
export class CoreModule {}
