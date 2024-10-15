import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AccountsModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account, Qr, Contact } from './account/schemas/accounts';

@Module({
  imports: [AccountsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'accounts',
      entities: [Account, Qr, Contact],
      synchronize: false,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
