import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { HybridSearchConfig } from 'src/entity';

export default class HybridSearchConfigSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(HybridSearchConfig);

    // Only run seeder if hybrid_search_config table is empty
    const result = await repository.createQueryBuilder().getOne();
    if (result) {
      return;
    }

    const entities = repository.create([
      {
        isEnabled: false,
        semanticRatio: 0.5,
        source: 'huggingFace',
        model: 'neuml/pubmedbert-base-embeddings',
        createdBy: 'system',
        modifiedBy: 'system',
      },
    ]);
    await repository.save(entities);
  }
}
