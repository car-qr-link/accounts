import { Controller, Get, Post, Put, Param, Query} from '@nestjs/common';
import { SearchAccountParams } from './interfaces/account.interface';
import { AccountsService } from './account.service';

@Controller()
export class AccountsController {

    constructor(
        private readonly AccountsService: AccountsService
    ) {}

    //Возвращает список аккаунтов
    @Get('accounts')
    async getAccounts () {
        return await this.AccountsService.getAccounts()      
    }

    //Поиск аккаунта 
    //Праметры: 1 значение поля поиска, 2 имя поля поиска
    @Get('accounts/:id')
    async getAccountsId(@Param() param: any ,@Query() query: SearchAccountParams) {
        
        //Если в запрос были переданны параметры после ?, то сначала пробуем выполнить поиск по этим параметрам
        if (typeof(query) == 'object')
            {
                if (query.hasOwnProperty('value')
                    && query.hasOwnProperty('field')
                    && query.field != '')
                {
                    return await this.AccountsService.getAccount(query.value, query.field)
                }
            }
        //Если параметры после ? не были переданны, то используем id которые указывается в пути get запроса
        if (typeof(param) == 'object')
            {
            if (param.hasOwnProperty('id')
                && param.id != '')
                {
                return await this.AccountsService.getAccount(param.id, 'id') 
                }
            }        
      
    }

}