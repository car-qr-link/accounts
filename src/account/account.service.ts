import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Qr, Contact } from './schemas/accounts';


@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)        
        private AccountsRepository: Repository<Account>,
        @InjectRepository(Qr)
        private QrsRepository: Repository<Qr>

      ) {}
    
    //Возвращает список всех аккаунтов:
    async getAccounts(): Promise<Account[]> { 

        return await this.AccountsRepository.find()
    }

    //Возвращает аккаунт по заданным параметрам:
    async getAccount(value: any, field: string): Promise<Account> {        
        
        const select = {}
        let account = null
        try {            
            if (field == 'phone') //при передачи символа + в параметре get запроса он заменяется на пробел:
            {
                if (value.substring(0, 1) == ' ')
                {
                    value = '+' + value.trim()
                }
            }
            
            select [field] = value
            account = await this.AccountsRepository.findOneBy(select)

        } catch (error) {
            throw new ConflictException(`Возникла ошибка при поске в базе данных: ${error.title}. Описание ошибки: ${error.message}`);
        }
        if (account == null) //Проверим - вернулся ли заполненный объект
                {
                    throw new BadRequestException('Аккаунт не найден.', { cause: new Error(), description: 'Аккаунт не найден.' })
                }
            
            return account        
    }
    
    //Обновляет данные аккаунта:
    async updateAccount(id: number, name: string, phone: string): Promise<Account> {
        const acc = await this.getAccount(id, 'id')
        acc.name  = name
        acc.phone = phone
        try {  
            return await this.AccountsRepository.save(acc)
        } catch (error) {
            throw new ConflictException(`Возникла ошибка при обновлении аккаунта в базе данных: ${error.title}. Описание ошибки: ${error.message}`);
        }
    }

    //Возвращает список всех qr кодов или одно по отбору
    async getQrs(id: Number): Promise<Qr[]> { 
        
        if (id != 0) //Если в get запрос был передан параметр отбор по id, то используем поиск по полю
        {   
            const select = {}
            select['account'] = id
            const qr:Qr = await this.QrsRepository.findOneBy(select)
            if (qr == null) //Проверим - вернулся ли заполненный объект
                {
                    throw new BadRequestException('Qr не найден.', { cause: new Error(), description: 'Qr не найден.' })
                }
            
            return [qr]
        }
        return await this.QrsRepository.find()
    }

    //Возвращает qr код по id:
    async getQr(id: Number): Promise<Qr> {         
        
        const select = {}
        select['id'] = id
        const qr:Qr = await this.QrsRepository.findOneBy(select)
        if (qr == null) //Проверим - вернулся ли заполненный объект
            {
                throw new BadRequestException('Qr не найден.', { cause: new Error(), description: 'Qr не найден.' })
            }
            
        return qr

    }

    //Сохранение данных пользователя в базе: (в процессе разработки)
    async create(id: number, firstName: string): Promise<void> {
        const acc = new Account();
        acc.name  = 'test';
        acc.phone = '+79297785827';
        const account = await this.AccountsRepository.save(acc)
        console.log(await this.QrsRepository.save({code: 'dfadsfd', account: account.id}))
    }

   
}

