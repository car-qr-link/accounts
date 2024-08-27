import { Controller, Get, Post, Put, Param, Query} from '@nestjs/common';
import { SearchAccountParams } from './interfaces/account.interface';

@Controller()
export class AccountsController {

    //Поиск аккаунта 
    //Праметры: 1 значение поля поиска, 2 имя поля поиска
    @Get('accounts/:id')
    async getAccounts(@Param() id: string ,@Query() query: SearchAccountParams) {
        console.log(id)
        console.log(query)
    }

}