import { Controller, Get, Post, Put, Param, Query, Patch, Body} from '@nestjs/common';
import { GetAccountResponse, EditAccountResponse } from './interfaces/account.interface';
import { AccountService } from './account.service';

@Controller()
export class AccountController {

    constructor(
        private readonly AccountsService: AccountService
    ) {}

    //Возвращает список аккаунтов
    @Get('accounts')
    async getAccount () {
        return await this.AccountsService.getAccounts()
    }

    //Поиск аккаунта 
    //Праметры: 1 значение поля поиска, 2 имя поля поиска
    @Get('accounts/:id')
    async getAccountId(@Param() param: any ,@Query() query: GetAccountResponse) {
        
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

    //Изменение аккаунта
    @Patch('accounts/:id')
    async updateAccount(@Param() param: any ,@Body() body: any) {
        if (typeof(param) == 'object')
            {
            if (param.hasOwnProperty('id')
                && param.id != '')
                console.log(param.id)
                console.log(body)
                return await this.AccountsService.updateAccount(param.id, body.name, body.phone)
            }
    }   

}