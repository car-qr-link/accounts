import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Contact } from './accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Contact])],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
