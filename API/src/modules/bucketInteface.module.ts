import {App} from "~/server";
import {Logger} from "pino";
import * as Minio from 'minio'
import {API_Error} from "~/types/errors";

export class BucketInterfaceModule {


  App: App
  logger: Logger
  minioClient: Minio.Client

  constructor(mainClass: App) {
    this.App = mainClass
    this.logger = this.App.AppLogger.createChildLogger(this.constructor.name)

    this.logger.info("Connecting to MinIO server")
    this.connectToBucket()
    this.checkMinIO()
  }

  connectToBucket() {
      this.minioClient = new Minio.Client({
        endPoint: this.App.config.bucket.host,
        port: this.App.config.bucket.port,
        useSSL: false,
        accessKey: this.App.config.bucket.username,
        secretKey: this.App.config.bucket.password,
      })
  }

  async checkMinIO() {
    let check = false
    try {
      check = await this.minioClient.bucketExists(this.App.config.bucket.bucketName)
    }  catch (e) {
      this.logger.error("Une erreur est survenue lors de la connexion au bucket. Probablement hôte injoignable...")
    }
    if (!check) {
      this.logger.error("Main bucket not available on the bucket server")
    } else {
      this.logger.info(`Bucket ${this.App.config.bucket.bucketName} is available on the MinIO server`)
    }
  }

  generatePresignedUrl(fileName: string) {
    try {
      return this.minioClient.presignedPutObject(this.App.config.bucket.bucketName, fileName, 12 * 60 * 60)
    } catch (e) {
      throw new API_Error('COULD_NOT_CONNECT', 'Impossible de se connecter au bucket afin de générer une URL...')
    }
  }


}
