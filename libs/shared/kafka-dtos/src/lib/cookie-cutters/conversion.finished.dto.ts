import { IsString } from 'class-validator';
import { CookieCuttersBaseDto } from './base.dto';

export class CookieCuttersConversionFinishedDto extends CookieCuttersBaseDto {
    @IsString()
    location!: string;
}
