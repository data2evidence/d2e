import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SystemPortalAPI } from './portal-api';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [SystemPortalAPI],
  exports: [SystemPortalAPI],
})
export class APIModule {}
