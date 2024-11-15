import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Module({
  imports: [],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
