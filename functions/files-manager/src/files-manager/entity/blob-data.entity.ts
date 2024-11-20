import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserData } from "./user-data.entity";

@Entity({ name: "blob_data" })
export class BlobData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;

  @OneToMany(() => UserData, (userData) => userData.blob_data)
  userData: UserData[];
}
