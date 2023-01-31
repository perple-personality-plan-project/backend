import { Injectable } from '@nestjs/common';
import { Group } from '../../db/models/group.models';
import { InjectModel } from '@nestjs/sequelize';
import { Hashtag } from '../../db/models/hashtag.models';
import { GroupUser } from '../../db/models/groupUser.models';
import { GroupHashtag } from '../../db/models/groupHahtag.models';
import { Feed } from '../../db/models/feed.models';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../../db/models/user.models';
import { Like } from '../../db/models/like.models';
import { Comment } from '../../db/models/comment.models';
import { Op } from 'sequelize';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(Hashtag)
    private hashtagModel: typeof Hashtag,
    @InjectModel(GroupUser)
    private groupUser: typeof GroupUser,
    @InjectModel(GroupHashtag)
    private groupHashtagModel: typeof GroupHashtag,
    @InjectModel(Feed)
    private feed: typeof Feed,
    @InjectModel(User)
    private user: typeof User,
    @InjectModel(Like)
    private like: typeof Like,
    @InjectModel(Comment)
    private comment: typeof Comment,
  ) {}

  async createGroup(createGroup: object) {
    return this.groupModel.create({ ...createGroup });
  }

  async findGroup(findData: object) {
    return this.groupModel.findOne({
      include: [{ model: GroupUser, attributes: [] }],
      raw: true,
      where: { ...findData },
      attributes: [
        'group_id',
        'group_name',
        'thumbnail',
        'description',
        [Sequelize.col('groupUser.user_id'), 'user_id'],
        'created_at',
        'updated_at',
      ],
    });
  }

  async groupHashTag(groupId) {
    return this.groupHashtagModel.findAll({
      where: { ...groupId },
      include: [
        {
          model: Hashtag,
          required: true,
          attributes: ['title'],
        },
      ],
      raw: true,
    });
  }

  async getGroup(sort, search) {
    return this.groupModel.findAll({
      include: [
        {
          model: GroupUser,
          as: 'groupUser',
          attributes: [],
          required: false,
          include: [
            {
              model: Feed,
              required: false,
              attributes: [],
            },
          ],
        },
        {
          model: GroupHashtag,
          as: 'groupHashTag',
          required: false,
          attributes: [],
          include: [
            {
              model: Hashtag,
              required: false,
              attributes: ['title'],
            },
          ],
        },
      ],
      attributes: [
        'group_id',
        'group_name',
        'thumbnail',
        'description',
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('groupUser.group_user_id')),
          ),
          'group_user_count',
        ],
        [
          Sequelize.fn(
            'GROUP_CONCAT',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('groupHashTag.hashtag.title'),
            ),
          ),
          'hashtags',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('groupUser.feed.feed_id')),
          ),
          'feedCount',
        ],
        'created_at',
        'updated_at',
      ],
      group: ['group_id'],
      where: {
        [Op.or]: [
          { group_name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { '$groupHashTag.hashtag.title$': { [Op.like]: `%${search}` } },
        ],
      },
      order: [[sort, 'DESC']],
      raw: false,
    });
  }

  //태그
  async findHashtag(findData: object) {
    return this.hashtagModel.findOne({
      raw: true,
      where: { ...findData },
    });
  }
  async createHashtag(title: object) {
    return this.hashtagModel.create({ ...title });
  }

  //그룹 해쉬 태그
  async createGroupHashtag(groupHashtag: object) {
    return this.groupHashtagModel.create({ ...groupHashtag });
  }

  //그룹유저
  async groupUserSignUp(createData: object) {
    return this.groupUser.create({ ...createData });
  }

  async findGroupUser(findData: object) {
    return this.groupUser.findOne({ raw: true, where: { ...findData } });
  }

  async destroyGroupUser(groupUser) {
    this.groupUser.destroy({ where: { ...groupUser } });
  }

  async getGroupFeed(groupId: number, userId: number) {
    return this.feed.findAll({
      attributes: {
        exclude: ['user_id'],
        include: [
          'feed_id',
          'group_user_id',
          'thumbnail',
          'description',
          'location',
          [Sequelize.col('groupUser.user.profile_img'), 'profile_img'],
          [Sequelize.col('groupUser.user_id'), 'user_id'],
          [Sequelize.col('groupUser.user.mbti'), 'mbti'],
          [Sequelize.col('groupUser.user.nickname'), 'nickname'],
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM likes WHERE likes.user_id = ${userId} AND likes.feed_id = Feed.feed_id)`,
            ),
            'isLike',
          ],
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.fn('DISTINCT', Sequelize.col('like.like_id')),
            ),
            'likeCount',
          ],
          'created_at',
          'updated_at',
        ],
      },
      include: [
        {
          model: GroupUser,
          attributes: [],
          include: [{ model: Group }, { model: User }],
        },
        {
          model: Like,
          attributes: [],
          required: false,
        },
      ],
      where: {
        '$groupUser.group.group_id$': groupId,
      },
      group: ['feed_id'],
    });
  }

  async getGroupFeedDetail(groupId, feedId) {
    const feed = await this.feed.findOne({
      include: [
        {
          model: GroupUser,
          attributes: [],
          include: [{ model: User, attributes: [] }],
        },
        { model: Like, attributes: [] },
      ],
      where: {
        feed_id: feedId,
      },
      attributes: [
        'feed_id',
        'group_user_id',
        'thumbnail',
        'description',
        'location',
        [Sequelize.col('groupUser.user.nickname'), 'nickname'],
        [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'likeCount'],
        'created_at',
        'updated_at',
      ],
      raw: true,
    });

    const commentResult = await this.comment.findAll({
      where: {
        feed_id: feedId,
        '$user.groupUser.group_user_id$': { [Op.ne]: null },
      },
      include: [
        {
          model: User,
          required: false,
          include: [
            {
              model: GroupUser,
              as: 'groupUser',
              attributes: [],
              include: [{ model: Group, attributes: [] }],
              where: { group_id: groupId },
            },
          ],
          attributes: [],
        },
      ],
      attributes: [
        'comment_id',
        'user_id',
        'feed_id',
        'comment',
        [Sequelize.col('user.nickname'), 'nickname'],
        [Sequelize.col('user.groupUser.group_user_id'), 'group_user_id'],
        'created_at',
        'updated_at',
      ],
      raw: true,
    });

    feed.comment = commentResult;
    return feed;
  }

  async createGroupFeed(feedData) {
    return this.feed.create({ ...feedData });
  }

  async findFeedLike(userId, feed_id) {
    return this.like.findOne({
      where: {
        ...userId,
        feed_id,
      },
      raw: true,
    });
  }

  async createGroupFeedLike(userId, feed_id) {
    return this.like.create({ ...userId, feed_id });
  }

  async deleteGroupFeedLike(like_id) {
    return this.like.destroy({ where: { like_id } });
  }

  async findMyGroupList(user_id) {
    return this.groupModel.findAll({
      include: [
        {
          model: GroupUser,
          as: 'groupUser',
          where: { user_id },
          attributes: [],
          include: [
            {
              model: Feed,
              required: false,
              attributes: [],
            },
          ],
        },
        {
          model: GroupHashtag,
          as: 'groupHashTag',
          required: false,
          attributes: [],
          include: [
            {
              model: Hashtag,
              required: false,
              attributes: ['title'],
            },
          ],
        },
      ],
      attributes: [
        'group_id',
        'group_name',
        'thumbnail',
        'description',
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('groupUser.group_user_id')),
          ),
          'group_user_count',
        ],
        [
          Sequelize.fn(
            'GROUP_CONCAT',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('groupHashTag.hashtag.title'),
            ),
          ),
          'hashtags',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('groupUser.feed.feed_id')),
          ),
          'feedCount',
        ],
        'created_at',
        'updated_at',
      ],
      group: ['group_id'],
      raw: false,
    });
  }

  async getHashTag() {
    return this.hashtagModel.findAll({});
  }

  async deleteGroup(groupId) {
    return this.groupModel.destroy({ where: { [Op.and]: { ...groupId } } });
  }

  async editGroup(edit, groupId) {
    await this.groupModel.update({ ...edit }, { where: { ...groupId } });
  }

  async deleteGroupHashtag(groupId) {
    return await this.groupHashtagModel.destroy({ where: { ...groupId } });
  }

  async deleteHashtag(HashtagId) {
    return await this.hashtagModel.destroy({
      where: { hashtag_id: [...HashtagId] },
    });
  }

  async getGroupHashtag(groupId) {
    return await this.groupHashtagModel.findAll({
      having: [
        Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('hashtag_id')), {
          [Op.eq]: 1,
        }),
        // Sequelize.where(Sequelize.col('group_id'), groupId.group_id),
      ],
      where: { ...groupId },
      attributes: ['group_id', 'hashtag_id'],
      group: ['hashtag_id'],
      raw: true,
    });
  }
}
