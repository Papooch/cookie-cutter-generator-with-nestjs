import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User, UserAttrs } from './user.entity';

export interface CookieCutterAttrs {
    id: number;
    name: string;
    location: string;
    status: string;
    isPublic: boolean;
    userId: number;
    user?: UserAttrs;
}

@Table
export class CookieCutter
    extends Model<CookieCutterAttrs>
    implements CookieCutterAttrs
{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    location: string;

    @Default('INIT')
    @Column(DataType.STRING)
    status: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    isPublic: boolean;

    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
