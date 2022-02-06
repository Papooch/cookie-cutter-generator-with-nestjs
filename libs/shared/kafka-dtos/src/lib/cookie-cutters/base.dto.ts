import { IsNumber } from 'class-validator';

export class CookieCuttersBaseDto {
    @IsNumber()
    id!: number;

    @IsNumber()
    userId!: number;
}
