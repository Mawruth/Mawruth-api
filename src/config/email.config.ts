import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 465,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
}));
