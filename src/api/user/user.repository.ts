import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Pick } from 'src/db/models/pick.models';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Pick)
    private pickModel: typeof Pick,
    private sequelize: Sequelize,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const { login_id, password, nickname, provider, mbti } = user;
      return await this.userModel.create({
        login_id,
        password,
        nickname,
        provider,
        mbti,
      });
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
                        (SELECT COUNT(*) FROM feeds f WHERE u.user_id = f.user_id) as feeds_cnt,
                        (SELECT COUNT(*) FROM maps m WHERE u.user_id = m.user_id) as routes_cnt,
                        (SELECT COUNT(*) FROM picks p  WHERE u.user_id = p.user_id) as picks_cnt,
                        (SELECT COUNT(*) FROM group_users g WHERE u.user_id = g.user_id) as groups_cnt
                      FROM users u 
                      WHERE user_id = ${user_id};
                    `;
    return this.sequelize.query(query, { type: QueryTypes.SELECT });
  }

  /*
   * 컬럼명을 매개변수로 받아
   * 동적으로 해당 컬럼에 중복 데이터가 있는지 확인
   */
  async IsDuplicatedInputData(column: string, data: string): Promise<User> {
    try {
      return this.userModel.findOne({ where: { [column]: data } });
    } catch (error) {
      return error.message;
    }
  }
}
