import { Binary } from '@medplum/fhirtypes';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { resolve, sep } from 'path';
import { Readable, pipeline } from 'stream';

/**
 * Binary input type.
 *
 * This represents a possible input to the writeBinary function.
 *
 * Node.js pipeline types:
 * type PipelineSource<T> = Iterable<T> | AsyncIterable<T> | NodeJS.ReadableStream | PipelineSourceFunction<T>;
 *
 * S3 input types:
 * export type NodeJsRuntimeStreamingBlobPayloadInputTypes = string | Uint8Array | Buffer | Readable;
 *
 * node-fetch body types:
 * Note that while the Fetch Standard requires the property to always be a WHATWG ReadableStream, in node-fetch it is a Node.js Readable stream.
 */
export type BinarySource = Readable | string;

let binaryStorage: BinaryStorage | undefined = undefined;

export function initBinaryStorage(type?: string): void {
    if (type?.startsWith('file:')) {
    binaryStorage = new FileSystemStorage(type.replace('file:', ''));
  } else {
    binaryStorage = undefined;
  }
}

export function getBinaryStorage(): BinaryStorage {
  if (!binaryStorage) {
    throw new Error('Binary storage not initialized');
  }
  return binaryStorage;
}

/**
 * The BinaryStorage interface represents a method of reading and writing binary blobs.
 */
export interface BinaryStorage {
  writeBinary(
    binary: Binary,
    filename: string | undefined,
    contentType: string | undefined,
    stream: BinarySource
  ): Promise<void>;

  writeFile(key: string, contentType: string | undefined, stream: BinarySource): Promise<void>;

//   readBinary(binary: Binary): Promise<Readable>;

//   copyBinary(sourceBinary: Binary, destinationBinary: Binary): Promise<void>;

//   copyFile(sourceKey: string, destinationKey: string): Promise<void>;

//   getPresignedUrl(binary: Binary): string;
}

/**
 * The FileSystemStorage class stores binary blobs on the file system.
 * Files are stored in <baseDir>/binary.id/binary.meta.versionId.
 */
class FileSystemStorage implements BinaryStorage {
  private readonly baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    if (!existsSync(resolve(baseDir))) {
      mkdirSync(resolve(baseDir));
    }
  }

  writeBinary(
    binary: Binary,
    filename: string | undefined,
    contentType: string | undefined,
    stream: BinarySource
  ): Promise<void> {
    return this.writeFile(this.getKey(binary), contentType, stream);
  }

  async writeFile(key: string, _contentType: string | undefined, input: BinarySource): Promise<void> {
    const fullPath = resolve(this.baseDir, key);
    const dir = fullPath.substring(0, fullPath.lastIndexOf(sep));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const writeStream = createWriteStream(fullPath, { flags: 'w' });
    return new Promise((resolve, reject) => {
      pipeline(input, writeStream, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

//   async readBinary(binary: Binary): Promise<Readable> {
//     const filePath = this.getPath(binary);
//     if (!existsSync(filePath)) {
//       throw new Error('File not found');
//     }
//     return createReadStream(filePath);
//   }

//   async copyBinary(sourceBinary: Binary, destinationBinary: Binary): Promise<void> {
//     await this.copyFile(this.getKey(sourceBinary), this.getKey(destinationBinary));
//   }

//   async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
//     const fullDestinationPath = resolve(this.baseDir, destinationKey);
//     const destDir = fullDestinationPath.substring(0, fullDestinationPath.lastIndexOf(sep));
//     if (!existsSync(destDir)) {
//       mkdirSync(destDir, { recursive: true });
//     }
//     copyFileSync(resolve(this.baseDir, sourceKey), resolve(this.baseDir, destinationKey));
//   }

//   getPresignedUrl(binary: Binary): string {
//     const config = getConfig();
//     const storageBaseUrl = config.storageBaseUrl;
//     const result = new URL(`${storageBaseUrl}${binary.id}/${binary.meta?.versionId}`);

//     const dateLessThan = new Date();
//     dateLessThan.setHours(dateLessThan.getHours() + 1);
//     result.searchParams.set('Expires', dateLessThan.getTime().toString());

//     const privateKey = { key: config.signingKey, passphrase: config.signingKeyPassphrase };
//     const signature = createSign('sha256').update(result.toString()).sign(privateKey, 'base64');
//     result.searchParams.set('Signature', signature);

//     return result.toString();
//   }

  private getKey(binary: Binary): string {
    return binary.id + sep + binary.meta?.versionId;
  }

//   private getPath(binary: Binary): string {
//     return resolve(this.baseDir, this.getKey(binary));
//   }
}