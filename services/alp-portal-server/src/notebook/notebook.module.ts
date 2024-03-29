import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notebook } from './entity'
import { NotebookController } from './notebook.controller'
import { NotebookService } from './notebook.service'

const imports: Array<Type<any> | DynamicModule> = [TypeOrmModule.forFeature([Notebook])]
const providers: Provider[] = [NotebookService]
@Module({
  imports,
  controllers: [NotebookController],
  providers
})
export class NotebookModule {}
