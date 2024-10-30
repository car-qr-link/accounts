import { Controller, Get, Post, Put, Param, Query, Patch, Body, NotFoundException, ConflictException} from '@nestjs/common';
import { GetAccountResponse, EditAccountResponse, GetQrsResponse } from './interfaces/account.interface';
import { accounts } from '@car-qr-link/apis';
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
    async getAccountId(@Param() param: any, @Query() query: GetAccountResponse) {
        
        //Если в запрос были переданны параметры после ?, то сначала пробуем выполнить поиск по этим параметрам
        if (typeof(query) == 'object')
            {
                if (query.hasOwnProperty('value')
                    && query.hasOwnProperty('field')
                    && query.field != '')
                {
                    const result = await this.AccountsService.getAccount(query.value, query.field)
                    if (result == null) //Проверим - вернулся ли заполненный объект
                    {
                        throw new NotFoundException('Аккаунт не найден.', { cause: new Error(), description: 'Аккаунт не найден.' })
                    }
                    return result
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

    //Привязывает новый qr код к аккаунту
    @Patch('/qrs/:id')
    async bindQr (@Param() param: any, @Body() body: accounts.LinkQrRequest) {

        //Проверим, не был ли создан аккаунт ранее:
        let phoneNuber: string = ''
        for (let contact of body.account.contacts) {
            if (contact.channel == 'phone')
            {
                if (await this.AccountsService.getAccount(contact.address, 'phone') != null) {
                    throw new ConflictException('Аккаунт уже существует. Номер телефона: ' + contact.address, { cause: new Error(), description: 'Аккаунт уже существует.' })
                }
                if (phoneNuber = '') {
                    phoneNuber = contact.channel
                }
            }            
        }

        //Проверим был ли передан телефон в теле запроса:
        if (phoneNuber == '') {
            throw new ConflictException('В теле запроса не был передан номер телефона, создание аккаунта невозможно.', { cause: new Error(), description: 'В теле запроса не был передан номер телефона, создание аккаунта невозможно.' })
        }

        //Создаем новый аккаунт
        const account = await this.AccountsService.createAccount(body.account.name, phoneNuber)

        //Проверим не привязан ли пераданный код уже к какому то аккаунту:
        let qr = await this.AccountsService.getQr(body.qr.licensePlate)
        if (qr != null) {
            throw new ConflictException('Qr уже существует. Номер телефона: ' + qr.account.phone, { cause: new Error(), description: 'Qr уже существует.' })
        }
        //Сохраняем qr код:
         qr = await this.AccountsService.createQr(account, body.qr.licensePlate)

        //Сохраняем контактную информацию:        
    }          
    
}