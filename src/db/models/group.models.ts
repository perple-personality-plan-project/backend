import {
    Table,
    Column,
    Model,
    PrimaryKey,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
    HasMany
} from 'sequelize-typescript';
import {User} from "./user.models";
import {GroupHashtag} from "./groupHahtag.models";

@Table({
    modelName: 'Group',
    freezeTableName: true,
    timestamps: true,
})
export class Group extends Model {
    @HasMany(() => GroupHashtag)
    groupHashtag: GroupHashtag[];


    @PrimaryKey
    @Column
    groupId: number;

    @Column
    groupname: string;

    @Column
    thumbnail: string;

    @Column
    description: string;

    @ForeignKey(()=> User)
    @Column
    userId: number;

    @BelongsTo(()=> User)
    user: User

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}