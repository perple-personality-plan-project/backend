import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import {Group} from "./group.models";
import {Hashtag} from "./hashtag.models";

@Table({
    modelName: 'GroupHashtag',
    freezeTableName: true,
    timestamps: true,
})
export class GroupHashtag extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    groupHashtagId: number

    @ForeignKey(() => Group)
    @AllowNull(false)
    @Column
    groupId: number;

    @BelongsTo(()=> Group)
    group: Group;


    @ForeignKey(() => Hashtag)
    @AllowNull(false)
    @Column
    hashtagId: number;

    @BelongsTo(()=>Hashtag)
    hashtag: Hashtag;


    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}