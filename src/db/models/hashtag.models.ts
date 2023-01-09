import {
    Column,
    CreatedAt,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
    HasMany,
    AutoIncrement,
    AllowNull
} from "sequelize-typescript";
import {GroupHashtag} from "./groupHahtag.models";

@Table({
    modelName: 'Hashtag',
    freezeTableName: true,
    timestamps: true,
})
export class Hashtag extends Model {
    @HasMany(()=> GroupHashtag)
    groupHashtag: GroupHashtag[];

    @PrimaryKey
    @AutoIncrement
    @Column
    hashtagId: number;

    @Column
    @AllowNull(false)
    title: string

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

}
