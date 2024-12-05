import { Service } from "typedi";
import { Buffer } from "buffer";
import crypto from "crypto";
import { UserDataRepository } from "./repository/user-data.repository";
import { BlobDataRepository } from "./repository/blob-data.repository";
import { FileSaveResponse } from "../types";

@Service()
export class FilesManagerService {
  private readonly logger = console;

  constructor(
    private readonly userDataRepo: UserDataRepository,
    private readonly blobDataRepo: BlobDataRepository
  ) {}

  async getFile(userDataId: string) {
    const userData = await this.userDataRepo.findOne({
      where: {
        id: userDataId,
      },
      relations: ["blobData"],
    });

    if (!userData) {
      throw new Error(`User ${userDataId} does not exist`);
    }

    const blobId = userData.blobData.data;
    const query = `SELECT convert_from(lo_get($1)::bytea, 'UTF8') AS data FROM "files_manager"."blob_data"`;
    const result = await this.blobDataRepo.query(query, [blobId]);

    if (result && result.length > 0) {
      return Buffer.from(result[0].data, "hex");
    } else {
      throw new Error(`No data found for userid ${userDataId}`);
    }
  }

  async saveFile(
    username: string,
    dataKey: string,
    file: Express.Multer.File
  ): Promise<FileSaveResponse> {
    this.logger.info("saving file");

    const filename = file.originalname;
    const hash = crypto.createHash("md5").update(file.buffer).digest("hex");

    // return file response if data exists in the user repository
    const byAllParameters = await this.userDataRepo.findOne({
      select: {
        id: true,
        username: true,
        dataKey: true,
        fileName: true,
      },
      where: {
        hash: hash,
        username: username,
        dataKey: dataKey,
        fileName: filename,
      },
    });

    if (byAllParameters) {
      console.log("called here");
      return {
        id: byAllParameters.id,
        username: byAllParameters.username,
        dataKey: byAllParameters.dataKey,
        fileName: byAllParameters.fileName,
      };
    }

    // return blobId if file already exists, else create new blob
    const blobData = await this.userDataRepo
      .findOne({
        where: {
          hash: hash,
        },
        relations: ["blobData"],
      })
      .then(async (db) => {
        if (db) {
          return db.blob_data;
        } else {
          const hexString = file.buffer.toString("hex");
          const query = `INSERT INTO "files_manager"."blob_data"("data") VALUES (lo_from_bytea(0, $1)) RETURNING "id"`;
          return await this.blobDataRepo.query(query, [hexString]);
        }
      });

    // finally insert into user
    const entity = this.userDataRepo.create({
      hash: hash,
      username: username,
      dataKey: dataKey,
      fileName: filename,
      blobId: blobData[0].id,
    });

    await this.userDataRepo.save(entity);

    const fileSaveResponse: FileSaveResponse = {
      id: entity.id,
      username: username,
      dataKey: dataKey,
      fileName: file.originalname,
    };
    return fileSaveResponse;
  }
}
