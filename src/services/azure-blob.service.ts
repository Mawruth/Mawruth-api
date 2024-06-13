import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AzureBlobService {
  private containerClient: ContainerClient;
  constructor(private readonly configService: ConfigService) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.configService.get('azure.connectionString'),
    );

    this.containerClient = blobServiceClient.getContainerClient(
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

  getBlobUrl(blobName: string): string {
    return this.containerClient.getBlockBlobClient(blobName).url;
  }
}
