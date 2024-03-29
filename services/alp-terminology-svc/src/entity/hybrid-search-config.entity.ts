import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hybrid_search_config')
export class HybridSearchConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_enabled' })
  isEnabled: boolean;

  @Column('real', { name: 'semantic_ratio' })
  semanticRatio: number;

  @Column({ name: 'model' })
  model: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by' })
  modifiedBy: string;

  @UpdateDateColumn({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;
}
