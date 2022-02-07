import { IsString } from 'class-validator';

export class CreateCookieCutterDto {
    @IsString()
    name: string;

    @IsString()
    svg: string;
}
