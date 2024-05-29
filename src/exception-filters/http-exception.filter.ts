import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { HttpStatusText } from './../utils/http-status.utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus() || 500;

    const errorResponse = {
      status: `${statusCode}`.startsWith('4')
        ? HttpStatusText.FAIL
        : HttpStatusText.ERROR,
      message: exception.message,
      path: request.url,
    };

    if (exception instanceof BadRequestException) {
      errorResponse['message'] =
        exception.getResponse()['message'] || 'Bad Request';
    }

    response.status(statusCode).json(errorResponse);
  }
}
