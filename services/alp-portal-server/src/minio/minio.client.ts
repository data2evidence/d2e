import * as Minio from 'minio'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import * as mime from 'mime'
import { createLogger } from '../logger'
import { env } from '../env'

export class MinioClient {
  private readonly logger = createLogger(this.constructor.name)
  private readonly client: Minio.Client

  constructor() {
    this.client = new Minio.Client({
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY
    })
  }

  async list(datasetId: string) {
    try {
      const bucketName = this.getBucketName(datasetId)
      await this.createBucket(bucketName)

      const stream = this.client.listObjectsV2(bucketName)
      const resources = []
      const streamPromise = new Promise((resolve, reject) => {
        stream.on('data', item => {
          resources.push(item)
        })
        stream.on('end', () => resolve(resources))
        stream.on('error', err => {
          this.logger.error(`Error occurred while reading stream from bucket ${bucketName}: ${err}`)
          return reject(err)
        })
      })
      await streamPromise

      return resources.map(r => {
        const nameArr = r.name.split('.')
        const fileType = nameArr[nameArr.length - 1].toUpperCase()
        return {
          name: r.name,
          size: this.formatBytes(r.size),
          type: fileType
        }
      })
    } catch (e) {
      this.logger.error(`${e}`)
      throw new InternalServerErrorException(`Error occurred in MinIO S3 objects retrieval: ${datasetId}`)
    }
  }

  async download(datasetId: string, fileName: string) {
    try {
      const bucketName = this.getBucketName(datasetId)
      await this.createBucket(bucketName)

      const readStream = await this.client.getObject(bucketName, fileName)

      const fileExtension = fileName.substring(fileName.lastIndexOf('.'))
      const contentType = mime.getType(fileExtension)
      return {
        readStream,
        contentType,
        contentDisposition: `attachment; filename="${fileName}"`
      }
    } catch (e) {
      if (e instanceof BadRequestException || e instanceof InternalServerErrorException) {
        throw e
      } else if (e.message === 'Not Found') {
        throw new BadRequestException(`Invalid file name: ${fileName}`)
      }
      this.logger.error(`${e}`)
      throw new InternalServerErrorException(`Error occurred in MinIO S3 object download: ${fileName}`)
    }
  }

  async upload(datasetId: string, file: Express.Multer.File) {
    const fileName = file.originalname
    try {
      const bucketName = this.getBucketName(datasetId)
      await this.createBucket(bucketName)

      const buffer = file.buffer
      await this.client.putObject(bucketName, fileName, buffer)
      this.logger.info(`MinIO S3 object ${fileName} successfully uploaded`)
      return {
        status: 'success'
      }
    } catch (e) {
      this.logger.error(`${e}`)
      throw new InternalServerErrorException(`Error occurred in MinIO S3 object upload: ${fileName}`)
    }
  }

  async delete(datasetId: string, fileName: string) {
    try {
      const bucketName = this.getBucketName(datasetId)

      await this.client.removeObject(bucketName, fileName)
      this.logger.info(`MinIO S3 object ${fileName} successfully deleted`)
      return {
        status: 'success'
      }
    } catch (e) {
      this.logger.error(`${e}`)
      throw new InternalServerErrorException(`Error occurred in MinIO S3 object deletion: ${fileName}`)
    }
  }

  async deleteDeployment(deploymentPath: string, bucketName: string) {
    try {
      const objectsStream = this.client.listObjectsV2(bucketName, deploymentPath, true)
      const objectsToDelete: string[] = []

      for await (const obj of objectsStream) {
        objectsToDelete.push(obj.name)
      }

      await this.client.removeObjects(bucketName, objectsToDelete)
      this.logger.info(`Deleted ${objectsToDelete.length} objects`)

      // Delete the folder itself
      await this.client.removeObject(bucketName, deploymentPath)
      this.logger.info(`Deleted folder: ${deploymentPath}`)
    } catch (error) {
      this.logger.error(`${error}`)
      throw new InternalServerErrorException(`Error occurred in MinIO S3 object deletion: ${deploymentPath}: ${error}`)
    }
  }

  async getFlowRunResults(filePath: string) {
    const flowBucketName = this.getFlowBucketName()
    this.logger.info(`Object path: ${flowBucketName}/${filePath}`)
    // TODO: replace hardcoded path
    try {
      const dataStream = await this.client.getObject(flowBucketName, filePath)
      const dataChunks = []

      return new Promise((resolve, reject) => {
        dataStream.on('data', chunk => {
          dataChunks.push(chunk)
        })

        dataStream.on('end', () => {
          const jsonStr = Buffer.concat(dataChunks).toString('utf8')
          try {
            const jsonData = JSON.parse(jsonStr)
            const dataStr = jsonData['data']
            // Parse again the double serialized data
            const parsedData = JSON.parse(dataStr)
            jsonData['data'] = parsedData
            resolve(parsedData)
          } catch (err) {
            console.error('Error parsing JSON:', err)
            reject(err)
          }
        })

        dataStream.on('error', err => {
          console.error('Error reading stream:', err)
          reject(err)
        })
      })
    } catch (err) {
      console.error('Error fetching object from MinIO:', err)
      throw err
    }
  }

  private getBucketName(datasetId: string) {
    return `portal-dataset-${datasetId}`
  }

  private getFlowBucketName() {
    return 'flows'
  }

  private async createBucket(bucketName: string) {
    const hasBucket = await this.client.bucketExists(bucketName)

    if (!hasBucket) {
      this.logger.info(`Bucket is not created yet. Creating bucket ${bucketName}...`)
      await this.client.makeBucket(bucketName, env.MINIO_REGION)
      this.logger.info(`Bucket ${bucketName} created successfully`)
    } else {
      this.logger.debug(`Bucket ${bucketName} is available`)
    }
  }

  private formatBytes(bytes, decimals = 1) {
    if (!+bytes) return '0 Byte'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }
}
