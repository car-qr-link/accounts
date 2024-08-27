 import { Module } from '@nestjs/common';
 import { AccountsController } from './account.controller';
 import { AccountsService, AccountsService1} from './account.service';



 @Module({
     imports: [AccountsService1],
     controllers: [AccountsController],
     providers: [AccountsService],
     exports: [AccountsService]
 })

 export class AccountsModule {}