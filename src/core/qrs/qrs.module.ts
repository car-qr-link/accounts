import { Module } from '@nestjs/common';
import { QrsService } from './qrs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QR } from './qrs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QR])],
  providers: [QrsService],
  exports: [QrsService],
})
export class QrsModule { }
