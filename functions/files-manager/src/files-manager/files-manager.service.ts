import { Service } from "typedi";
import { UserDataRepository } from "./repository/user-data.repository";
import { BlobDataRepository } from "./repository/blob-data.repository";
import crypto from "crypto";
import { Buffer } from "buffer";

@Service()
export class FilesManagerService {
  private readonly logger = console;

  constructor(
    private readonly userDataRepo: UserDataRepository,
    private readonly blobDataRepo: BlobDataRepository
  ) {}

  async get() {
    console.log("get");
    const result = await this.blobDataRepo.createQueryBuilder().getMany();
    console.log(result);

    // const res = await this.userDataRepo.createQueryBuilder().getMany();
    // console.log(res);
  }

  async saveFile(username: string, dataKey: string, file: Express.Multer.File) {
    this.logger.info("saving file");

    const filename = file.originalname;
    const hash = crypto.createHash("md5").update(file.buffer).digest("hex");

    // const byAllParameters = await this.userDataRepo.findOneBy({
    //   hash: hash,
    //   username: username,
    //   dataKey: dataKey,
    //   fileName: filename,
    // });

    // if byAllParameter is not null, return the data

    console.log("creating blob 2");
    const blobData = await this.userDataRepo
      .findOneBy({
        hash: hash,
      })
      .then(async (db) => {
        if (db) {
          return db.blob_data;
        } else {
          console.log("blob does not exist, save here");
          const hexString = file.buffer.toString("hex");

          const query = `INSERT INTO "files_manager"."blob_data"("data") VALUES (lo_from_bytea(0, $1)) RETURNING "id"`;

          const result = await this.blobDataRepo.query(query, [hexString]);
          console.log(result);
          // return this.blobDataRepo.save(entity);
        }

        return;
      });

    console.log("done");
    console.log(blobData);
    // console.log("creating userdata");
    // console.log(blobData);
    // // return id, username, dataKey and filename
    // const userData = this.userDataRepo.create({
    //   dataKey: dataKey,
    //   username: username,
    //   file_name: filename,
    //   hash: hash,
    //   blobData: blobData,
    // });
    // console.log("??");
    // return this.userDataRepo.save(userData);
  }
}
