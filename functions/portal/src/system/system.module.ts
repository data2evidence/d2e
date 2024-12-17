import { Module } from '@danet/core';
import { DatabaseModule } from "../database/module.ts";
import { SystemController } from './system.controller.ts';
import { SystemService } from './system.service.ts';

@Module({
  controllers: [SystemController],
  injectables: [SystemService],
  imports: [DatabaseModule]
})
export class SystemModule { }
