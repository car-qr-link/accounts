import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AccountsModule } from './account/account.module';

import { AppService } from './app.service';

@Module({
  imports: [AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
