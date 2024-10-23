import { Module } from '@nestjs/common'
import { SystemController } from './system.controller'
import { SystemService } from './system.service'
import { PluginsModule } from 'src/plugins/plugins.provider'

@Module({
  imports: [PluginsModule],
  controllers: [SystemController],
  providers: [SystemService]
})
export class SystemModule {}
