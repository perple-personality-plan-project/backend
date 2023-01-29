import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Pick } from 'src/db/models/pick.models';
import { User } from 'src/db/models/user.models';
import { Feed } from 'src/db/models/feed.models';
import { Like } from 'src/db/models/like.models';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Pick)
    private readonly pickModel: typeof Pick,
    @InjectModel(Feed)
    private readonly feedModel: typeof Feed,
    private readonly sequelize: Sequelize,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create({ ...createUserDto });
  }

  async findUserByLoginId(login_id: string): Promise<User | null> {
    return this.userModel.findOne({ raw: true, where: { login_id } });
  }

  async findUserByUserId(user_id: number): Promise<User | null> {
    return this.userModel.findOne({ raw: true, where: { user_id } });
  }

  async updatedProfile(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<[affectedCount: number]> {
    return this.userModel.update({ ...updateUserDto }, { where: { user_id } });
  }

  async getMypageInfo(user_id: number): Promise<object[]> {
    const query = ` SELECT 
                        u.nickname,
                        u.mbti,
                        u.profile_img,
                        u.background_img,
                        (SELECT COUNT(*) FROM feeds f WHERE u.user_id = f.user_id) as feeds_cnt,
                        (SELECT COUNT(*) FROM maps m WHERE u.user_id = m.user_id) as routes_cnt,
                        (SELECT COUNT(*) FROM picks p  WHERE u.user_id = p.user_id) as picks_cnt,
                        (SELECT COUNT(*) FROM group_users g WHERE u.user_id = g.user_id) as groups_cnt
                      FROM users u 
                      WHERE user_id = ${user_id};
                    `;
    return this.sequelize.query(query, { type: QueryTypes.SELECT });
  }

  async IsDuplicatedInputData(column: string, data: string): Promise<User> {
    return this.userModel.findOne({ where: { [column]: data } });
  }

  async getUserFeed(user_id: number): Promise<Feed[]> {
    return this.feedModel.findAll({
      raw: true,
      where: { user_id },
      attributes: [
        'feed_id',
        'thumbnail',
        'description',
        'location',
        [Sequelize.col('user.user_id'), 'user_id'],
        [Sequelize.col('user.mbti'), 'mbti'],
        [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'like_count'],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM likes WHERE likes.user_id = ${user_id} AND likes.feed_id = Feed.feed_id)`,
          ),
          'isLike',
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM picks WHERE picks.user_id = ${user_id} AND picks.feed_id = Feed.feed_id)`,
          ),
          'isPick',
        ],
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
        },
        {
          model: Like,
          as: 'like',
          attributes: [],
        },
      ],
      group: ['feed_id'],
      order: [['created_at', 'DESC']],
    });
  }

  async getUserPick(user_id: number): Promise<Pick[]> {
    return this.pickModel.findAll({
      where: { user_id },
      raw: true,
      attributes: [
        [Sequelize.col('feed.user.nickname'), 'nickname'],
        [Sequelize.col('feed.user.mbti'), 'mbti'],
        [Sequelize.col('feed.feed_id'), 'feed_id'],
        [Sequelize.col('feed.thumbnail'), 'thumbnail'],
        [Sequelize.col('feed.description'), 'description'],
        [Sequelize.col('feed.location'), 'location'],
        [
          Sequelize.fn('COUNT', Sequelize.col('feed.like.like_id')),
          'like_count',
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM likes WHERE likes.user_id = ${user_id} AND likes.feed_id = feed.feed_id)`,
          ),
          'isLike',
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM picks WHERE picks.user_id = ${user_id} AND picks.feed_id = feed.feed_id)`,
          ),
          'isPick',
        ],
        [Sequelize.col('feed.created_at'), 'created_at'],
        [Sequelize.col('feed.created_at'), 'updated_at'],
      ],
      include: [
        {
          model: Feed,
          attributes: [],
          include: [
            {
              model: User,
              attributes: [],
            },
            {
              model: Like,
              attributes: [],
            },
          ],
        },
      ],
      group: ['pick_id'],
    });
  }

  async updateProfile(
    user_id: number,
    profile_img: string,
  ): Promise<[affectedCount: number]> {
    return this.userModel.update({ profile_img }, { where: { user_id } });
  }

  async updateBackground(
    user_id: number,
    background_img: string,
  ): Promise<[affectedCount: number]> {
    return this.userModel.update({ background_img }, { where: { user_id } });
  }
}
