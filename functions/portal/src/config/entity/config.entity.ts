import { Column, Entity, PrimaryColumn } from "typeorm";
import { Audit } from "../../common/entity/audit.entity.ts";

@Entity("config")
export class Config extends Audit {
  @PrimaryColumn()
  type: string;

  @Column()
  value: string;
}
