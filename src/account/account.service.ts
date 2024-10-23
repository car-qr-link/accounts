import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { Account, Qr, Contact } from './schemas/accounts';
import { BaseAccount,  accounts, NotificationChannel } from '@car-qr-link/apis';



@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)        
        private accountsRepository: Repository<Account>,
        @InjectRepository(Qr)
        private qrsRepository: Repository<Qr>,
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>

      ) {}
    
    //Возвращает список всех аккаунтов:
    async getAccounts(): Promise<accounts.GetAccountsResponse> { 
        const result = {'accounts': new Array}
        result.accounts = await this.accountsRepository.find()
        return result
    }

    //Возвращает аккаунт по заданным параметрам:
    async getAccount(value: any, field: string): Promise<accounts.GetAccountResponse> {        
        
        const select = {}
        const result: accounts.GetAccountResponse = {
            account: {
                id: '',
                contacts: []
            },
            qrs: []
        }
        try {            
            if (field == 'phone') //при передачи символа + в параметре get запроса он заменяется на пробел:
            {
                if (value.substring(0, 1) == ' ')
                {
                    value = '+' + value.trim()
                }
            }
            
            //Получаем данные по аккаунту:
            select [field] = value
            const foundAccount   = await this.accountsRepository.findOneBy(select)
            result.account.id   = foundAccount.id.toString()
            result.account.name = foundAccount.name
            result.qrs = []
            
            //Получаем данные по контактной информации:
            select['account'] = foundAccount.id
            const foundContacts = await this.contactRepository.find(select)
            foundContacts.forEach((item, index, array) => {
                let chanel = NotificationChannel.Phone
                if (item.type == 'email') {chanel =  NotificationChannel.Email}
                if (item.type == 'telegram') {chanel =  NotificationChannel.Telegram}
                result.account.contacts.push({'channel': chanel, 'address': item.address}) 
            })  

            //Получаем данные по qr кодам:
            select['account'] = foundAccount.id
            const foundQrs = await this.qrsRepository.find(select)
            foundQrs.forEach((item, index, array) => {
                result.qrs.push({'id': item.id.toString(), 'licensePlate': item.code, 'accountId': result.account.id})
            })            

        } catch (error) {
            throw new InternalServerErrorException(`Возникла ошибка при поске в базе данных: ${error.title}. Описание ошибки: ${error.message}`);
        }
        if (result == null) //Проверим - вернулся ли заполненный объект
                {
                    throw new NotFoundException('Аккаунт не найден.', { cause: new Error(), description: 'Аккаунт не найден.' })
                }
            
            return result        
    }
    
    //Обновляет данные аккаунта:
    //async updateAccount(id: number, name: string, phone: string): Promise<Account> {
        //const acc = await this.getAccount(id, 'id')
        //acc.name  = name
        //acc.phone = phone
       // try {  
        //    return await this.accountsRepository.save(acc)
       // } catch (error) {
       //     throw new InternalServerErrorException(`Возникла ошибка при обновлении аккаунта в базе данных: ${error.title}. Описание ошибки: ${error.message}`);
       // }
    //}

    //Возвращает список всех qr кодов или одно по отбору
    async getQrs(id: Number): Promise<Qr[]> { 
        
        if (id != 0) //Если в get запрос был передан параметр отбор по id, то используем поиск по полю
        {   
            const select = {}
            select['account'] = id
            const qr:Qr = await this.qrsRepository.findOneBy(select)
            if (qr == null) //Проверим - вернулся ли заполненный объект
                {
                    throw new NotFoundException('Qr не найден.', { cause: new Error(), description: 'Qr не найден.' })
                }
            
            return [qr]
        }
        return await this.qrsRepository.find()
    }

    //Возвращает qr код по id:
    async getQr(id: Number): Promise<Qr> {         
        
        const select = {}
        select['id'] = id
        const qr:Qr = await this.qrsRepository.findOneBy(select)
        if (qr == null) //Проверим - вернулся ли заполненный объект
            {
                throw new NotFoundException('Qr не найден.', { cause: new Error(), description: 'Qr не найден.' })
            }
            
        return qr

    }

    //Сохранение данных пользователя в базе: (в процессе разработки)
    async create(firstName: string): Promise<void> {
        const acc = new Account();
        acc.name  = 'test';
        acc.phone = '+79297785827';
        const account = await this.accountsRepository.save(acc)
        //console.log(await this.qrsRepository.save({code: 'dfadsfd', account: account.id}))
    }

    //Проверка тела запроса  для создания аккаунта на предмет все ли поля переданы
    checkBody(body: accounts.LinkQrRequest)
    {
        if (typeof(body) == 'object') {
                if (body.hasOwnProperty('account')) {
                    if (typeof(body.account) == 'object') {
                        if (body.account.hasOwnProperty('name')) {
                            if (body.account.name == '') {
                                throw new NotFoundException('В account поле name не заполнено.', { cause: new Error()})
                            }                            
                        }
                        else {
                            throw new NotFoundException('В account отсутствует поле name.', { cause: new Error()})
                        }
                        if (body.account.hasOwnProperty('contacts')) {
                            for (let element of body.account.contacts) {
                                if (typeof(element) == 'object') {
                                    if (!element.hasOwnProperty('channel')) {
                                        throw new NotFoundException('В массиве contacts в объекте отсуствует поле channel.', { cause: new Error()})
                                    }
                                    if (element.hasOwnProperty('address')) {  
                                        if (element.address == '')
                                        {
                                            throw new NotFoundException('В массиве contacts в объекте поле address не заполнено.', { cause: new Error()})
                                        }
                                    }
                                    else {
                                        throw new NotFoundException('В массиве contacts в объекте отсуствует поле address.', { cause: new Error()})
                                    }
                                }
                                else {
                                    throw new NotFoundException('В массиве contacts должен быть объекты с полями: channel и address.', { cause: new Error()})
                                }
                            }                                
                        }
                        else {
                            throw new NotFoundException('В account отсутствует массив contacts.', { cause: new Error()})
                        }

                    }
                    else {
                        throw new NotFoundException('Поле account должно быть объектного типа.', { cause: new Error()})
                    }                                
                }
                else {
                    throw new NotFoundException('В теле запроса не переданно поле account.', { cause: new Error()})
                }
                if (body.hasOwnProperty('qr')) {
                    if (body.qr.hasOwnProperty('licensePlate')) {
                        if (body.qr.licensePlate == '') {
                            throw new NotFoundException('В объекте qr поле licensePlate не заполнено.', { cause: new Error()})
                        }
                    }
                    else {
                        throw new NotFoundException('В объекте qr отсуствует поле licensePlate.', { cause: new Error()})
                    }
                }
                else {
                    throw new NotFoundException('В теле запроса не переданно поле qr.', { cause: new Error()})
                }
            }
            else {
                throw new NotFoundException('Неверно передано тело запроса.', { cause: new Error()})
            }
    }
   
}

