import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSourceOptions } from 'typeorm';
import { dataSourceOptions } from './db';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        // install 'pino-pretty' package in order to use the following option
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () =>
        ({
          ...dataSourceOptions,
          type: new URL(
            process.env.DATABASE_URL || dataSourceOptions.url,
          ).protocol.replaceAll(':', ''),
          url: process.env.DATABASE_URL,

          synchronize: process.env.NODE_ENV !== 'production',
          migrationsRun: process.env.NODE_ENV === 'production',

          logging: process.env.NODE_ENV === 'production' ? ["error"] : ["query", "error"],
        }) as unknown as DataSourceOptions,
    }),
    ApiModule,
    CoreModule,
  ],
})
export class AppModule { }
