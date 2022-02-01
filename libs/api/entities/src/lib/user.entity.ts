import {
    AutoIncrement,
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { CookieCutter } from './cookie-cutter.entity';

export interface UserAttrs {
    id: number;
    name: string;
    password?: string;
    cookieCutters?: CookieCutter[];
}

@Table
export class User extends Model<UserAttrs> implements UserAttrs {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Unique
    @Column(DataType.STRING)
    name: string;

    @Column({
        type: DataType.STRING,
        set(value: string) {
            this.setDataValue('password', bcrypt.hashSync(value, 12));
        },
    })
    password: string;

    @HasMany(() => CookieCutter)
    cookieCutters?: CookieCutter[];

    verifyPassword(password: string) {
        return bcrypt.compareSync(password, this.getDataValue('password'));
    }

    toJSON() {
        const data = super.toJSON();
        delete data.password;
        return data;
    }
}
