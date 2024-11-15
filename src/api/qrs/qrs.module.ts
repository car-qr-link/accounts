import { Module } from '@nestjs/common';
import { QrsController } from './qrs.controller';

@Module({
  controllers: [QrsController]
})
export class QrsModule {}
