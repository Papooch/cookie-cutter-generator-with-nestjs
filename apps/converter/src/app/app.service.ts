import { Injectable } from '@nestjs/common';

@Injectable()
export class ConverterAppService {
    getData(): { message: string } {
        return { message: 'Welcome to converter!' };
    }
}
