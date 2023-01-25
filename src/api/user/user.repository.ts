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
    private userModel: typeof User,
    @InjectModel(Pick)
    private pickModel: typeof Pick,
    @InjectModel(Feed)
    private feedModel: typeof Feed,
    @InjectModel(Like)
    private likeModel: typeof Like,
    private sequelize: Sequelize,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      return await this.userModel.create({ ...user });
    } catch (error) {
      return error.message;
    }
  }

  async findUserByLoginId(login_id: string): Promise<User> {
    return this.userModel.findOne({ raw: true, where: { login_id } });
  }

  async findUserByUserId(user_id: number): Promise<User> {
    return this.userModel.findOne({ raw: true, where: { user_id } });
  }

  async chkPicked(user_id: number, feed_id: number) {
    const [_, isPicked] = await this.pickModel.findOrCreate({
      where: { user_id, feed_id },
      defaults: { user_id, feed_id },
    });

    if (!isPicked) {
      await this.pickModel.destroy({ where: { user_id, feed_id } });
    }

    return isPicked;
  }

  async updatedProfile(user_id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.update({ ...updateUserDto }, { where: { user_id } });
  }

  async getMypageInfo(user_id: number) {
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
    try {
      return this.userModel.findOne({ where: { [column]: data } });
    } catch (error) {
      return error.message;
    }
  }

  async getUserFeed(user_id) {
    const feeds = await this.feedModel.findAll({
      raw: true,
      where: { user_id },
      attributes: [
        'feed_id',
        'thumbnail',
        'description',
        [Sequelize.col('user.user_id'), 'user_id'],
        [Sequelize.col('user.mbti'), 'mbti'],
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
          attributes: [
            [
              Sequelize.fn('COUNT', Sequelize.col('like.like_id')),
              'like_count',
            ],
          ],
        },
      ],
      group: ['feed_id'],
      order: [['created_at', 'DESC']],
    });
    return feeds;
  }

  async getUserPick(user_id: number) {
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
        [Sequelize.col('feed.created_at'), 'created_at'],
        [Sequelize.col('feed.created_at'), 'updated_at'],
        [
          Sequelize.fn('COUNT', Sequelize.col('feed.like.like_id')),
          'like_count',
        ],
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

  async updateProfile(user_id: number, profile_img: string) {
    return this.userModel.update({ profile_img }, { where: { user_id } });
  }

  async updateBackground(user_id: number, background_img: string) {
    return this.userModel.update({ background_img }, { where: { user_id } });
  }
}
