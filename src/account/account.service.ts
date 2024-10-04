import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { Account, Qr, Contact } from './schemas/accounts';
import { BaseAccount,  accounts } from '@car-qr-link/apis';



@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)        
        private accountsRepository: Repository<Account>,
        @InjectRepository(Qr)
        private qrsRepository: Repository<Qr>

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
            
            select [field] = value
            const findAccount   = await this.accountsRepository.findOneBy(select)
            result.account.id   = findAccount.id.toString()
            result.account.name = findAccount.name

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
    async updateAccount(id: number, name: string, phone: string): Promise<Account> {
        const acc = await this.getAccount(id, 'id')
        acc.name  = name
        acc.phone = phone
        try {  
            return await this.accountsRepository.save(acc)
        } catch (error) {
            throw new InternalServerErrorException(`Возникла ошибка при обновлении аккаунта в базе данных: ${error.title}. Описание ошибки: ${error.message}`);
        }
    }

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
    async create(id: number, firstName: string): Promise<void> {
        const acc = new Account();
        acc.name  = 'test';
        acc.phone = '+79297785827';
        const account = await this.accountsRepository.save(acc)
        console.log(await this.qrsRepository.save({code: 'dfadsfd', account: account.id}))
    }

   
}

