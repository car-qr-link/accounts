 import { Module } from '@nestjs/common';
 import { TypeOrmModule } from '@nestjs/typeorm';

 import { AccountsController } from './account.controller';
 import { AccountsService} from './account.service';
 import { Account, Qr, Contact } from './schemas/accounts';



 @Module({
     imports: [TypeOrmModule.forFeature([Account, Qr, Contact])],
     controllers: [AccountsController],
     providers: [AccountsService],
     exports: [AccountsService]
 })

 export class AccountsModule {}