import { ConceptSetConcept } from '../utils/types';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('concept_set')
export class ConceptSet {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ nullable: true, default: false })
  shared: boolean;

  @Column({ type: 'jsonb', array: false })
  concepts: ConceptSetConcept[];

  @Column({ name: 'created_by' })
  createdBy!: string;

  @Column({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate!: Date;

  @Column({ name: 'modified_by' })
  modifiedBy!: string;

  @Column({
    name: 'modified_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  modifiedDate!: Date;
}
