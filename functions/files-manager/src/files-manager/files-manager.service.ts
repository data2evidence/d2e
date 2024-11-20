import { Service } from "typedi";
import { UserDataRepository } from "./repository/user-data.repository";
import { BlobDataRepository } from "./repository/blob-data.repository";
@Service()
export class FilesManagerService {
  private readonly logger = console;

  constructor(
    private readonly userDataRepo: UserDataRepository,
    private readonly blobDataRepo: BlobDataRepository
  ) {}

  async get() {
    const result = await this.blobDataRepo.createQueryBuilder().getMany();
    console.log(result);
  }
}
