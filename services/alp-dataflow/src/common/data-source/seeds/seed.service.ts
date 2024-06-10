import { OnApplicationBootstrap, Injectable } from '@nestjs/common'
import { runSeeders } from 'typeorm-extension'
import dataSource from '../data-source'

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    dataSource.initialize().then(async () => {
      await runSeeders(dataSource)
    })
  }
}
