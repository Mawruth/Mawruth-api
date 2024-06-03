import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';
import { IMailOptions } from 'src/interfaces/mailOptions.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  private transport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      auth: {
        user: this.configService.get<string>('email.auth.user'),
        pass: this.configService.get<string>('email.auth.pass'),
      },
    });

    return transporter;
  }

  private async send(mailOptions: IMailOptions): Promise<boolean> {
    try {
      await this.transport().sendMail(mailOptions);
    } catch (error) {
      this.logger.error(error, error.stack);
      return false;
    }

    return true;
  }
  async sendActiveOtp(email: string, otp: string): Promise<boolean> {
    const mailOptions: IMailOptions = {
      from: this.configService.get<string>('email.auth.user'),
      to: email,
      subject: 'Email Verification',
      text: `Your OTP is ${otp}, this otp is valid for 30 minutes`,
    };
    return await this.send(mailOptions);
  }

  async sendForgotPasswordOtp(email: string, otp: string): Promise<boolean> {
    const mailOptions: IMailOptions = {
      from: this.configService.get<string>('email.auth.user'),
      to: email,
      subject: 'Password Reset',
      text: `Your OTP is ${otp} for resetting password, this otp is valid for 30 minutes`,
    };
    return await this.send(mailOptions);
  }
}
