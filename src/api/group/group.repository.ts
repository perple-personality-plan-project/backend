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
      raw: true,
      where: { ...findData },
    });
  }

  async getGroup(sort) {
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

  async getGroupFeed(groupId) {
    return this.feed.findAll({
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: GroupUser,
          attributes: [],
          include: [{ model: Group, attributes: [] }],
        },
      ],
      where: {
        '$groupUser.group.group_id$': groupId,
      },
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
      where: { feed_id: feedId },
      include: [
        {
          model: User,
          required: false,
          include: [
            {
              model: GroupUser,
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
          where: { ...user_id },
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
}
