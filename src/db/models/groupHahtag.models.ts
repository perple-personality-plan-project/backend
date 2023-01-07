import {Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Group} from "./group.models";
import {Hashtag} from "./hashtag.models";

@Table({
    modelName: 'GroupHashtag',
    freezeTableName: true,
    timestamps: true,
})
export class GroupHashtag extends Model {

    @PrimaryKey
    @Column
    groupHashtagId: number

    @ForeignKey(() => Group)
    @Column
    groupId: number;

    @ForeignKey(() => Hashtag)
    @Column
    hashtagId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}