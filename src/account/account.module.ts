 import { Module } from '@nestjs/common';
 import { TypeOrmModule } from '@nestjs/typeorm';

 import { AccountController } from './account.controller';
 import { AccountService} from './account.service';
 import { Account, Qr, Contact } from './schemas/accounts';



 @Module({
     imports: [TypeOrmModule.forFeature([Account, Qr, Contact])],
     controllers: [AccountController],
     providers: [AccountService],
     exports: [AccountService]
 })

 export class AccountsModule {}