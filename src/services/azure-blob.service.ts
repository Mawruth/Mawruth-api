import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AzureBlobService {
  private containerClient: ContainerClient;
  private blobServiceClient: BlobServiceClient;
  constructor(private readonly configService: ConfigService) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.configService.get('azure.connectionString'),
    );

    this.containerClient = this.blobServiceClient.getContainerClient(
      this.configService.get('azure.containerName'),
    );
  }

  async uploadFile(file: Express.Multer.File, type: string): Promise<string> {
    const name = `${type}-${uuid()}-${Date.now()}`;
    const blockBlobClient = this.containerClient.getBlockBlobClient(name);

    try {
      await blockBlobClient.uploadData(file.buffer);
      return name;
    } catch (error) {
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadStream(
    streamFile: StreamableFile,
    type: string,
  ): Promise<string> {
    const name = `${type}-${uuid()}-${Date.now()}`;
    const blockBlobClient = this.containerClient.getBlockBlobClient(name);

    try {
      await blockBlobClient.uploadStream(
        streamFile.getStream(),
        4 * 1024 * 1024,
        20,
        {
          onProgress: (progress) =>
            console.log(`Progress: ${progress.loadedBytes} bytes uploaded`),
        },
      );

      return blockBlobClient.name;
    } catch (error) {
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBlobClient(blobName: string) {
    return this.containerClient.getBlobClient(blobName);
  }

  getBlobUrl(blobName: string): string {
    return this.containerClient.getBlockBlobClient(blobName).url;
  }
}
