import { Test, TestingModule } from '@nestjs/testing';
import { GroupCommentController } from './group.comment.controller';

describe('GroupCommentController', () => {
  let controller: GroupCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupCommentController],
    }).compile();

    controller = module.get<GroupCommentController>(GroupCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
