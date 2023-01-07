import {Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt,HasMany} from "sequelize-typescript";
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
    @Column
    hashtagId: number;

    @Column
    title: string

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

}
