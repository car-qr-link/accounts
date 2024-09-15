import { Controller, Get, Post, Put, Param, Query, Patch, Body} from '@nestjs/common';
import { GetAccountResponse, EditAccountResponse, GetQrsResponse } from './interfaces/account.interface';
import { AccountService } from './account.service';

@Controller()
export class AccountController {

    constructor(
        private readonly AccountsService: AccountService
    ) {}

    //Возвращает список аккаунтов
    @Get('accounts')
    async getAccounts () {
        return await this.AccountsService.getAccounts()
    }

    //Возвращает аккаунт по найденым полям аккаунта 
    //Праметры: param - объект с полем id, query - объект с двумя полями: value - значение поля поиска, field - имя поля поиска
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
    //Праметры: param - объект с полем id, body - объект EditAccountResponse
    @Patch('accounts/:id')
    async updateAccount(@Param() param: any ,@Body() body: EditAccountResponse) {
        if (typeof(param) == 'object')
            {
            if (param.hasOwnProperty('id')
                && param.id != '')
                {
                return await this.AccountsService.updateAccount(param.id, body.name, body.phone)
                }
            }
    }   

    //Возвращает список qr кодов
    @Get('qrs')
    async getQrs (@Query() query: GetQrsResponse) {
        
         //Если в запрос были переданны параметры после ?, то сначала пробуем выполнить поиск по этим параметрам
        if (typeof(query) == 'object')
            {
                if (query.hasOwnProperty('id')
                    && query.id > 0)
                {
                    return await this.AccountsService.getQrs(query.id)
                }
            }
        return await this.AccountsService.getQrs(0)
    }

    //Возвращает qr код по id
    @Get('qrs/:id')
    async getQr (@Param() param: any) {
        if (typeof(param) == 'object')
            {
            if (param.hasOwnProperty('id')
                && param.id != '')
                {
                    return await this.AccountsService.getQr(param.id)
                }
        
            }
    }

}