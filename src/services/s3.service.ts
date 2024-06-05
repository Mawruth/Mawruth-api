import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('aws.region'),
      credentials: {
        accessKeyId: this.configService.get('aws.accessKeyId'),
        secretAccessKey: this.configService.get('aws.secretAccessKey'),
      },
    });
  }
  async uploadFile(file: Express.Multer.File, type: string) {
    const name = `${type}-${uuid()}`;
    const data = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('aws.bucketName'),
        Key: name,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    console.log(data);
  }
}
