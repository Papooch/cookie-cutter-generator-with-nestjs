import { IsString } from 'class-validator';
import { CookieCuttersBaseDto } from './base.dto';

export class CookieCuttersUploadedDto extends CookieCuttersBaseDto {
    @IsString()
    svg!: string;
}
