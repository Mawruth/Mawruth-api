import { registerAs } from '@nestjs/config';

export default registerAs('azure', () => ({
  connectionString: process.env.AZURE_CONNECTION_STRING,
  containerName: process.env.AZURE_CONTAINER_NAME,
}));
