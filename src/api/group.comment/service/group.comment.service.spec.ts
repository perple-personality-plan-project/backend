import { Test, TestingModule } from '@nestjs/testing';
import { GroupCommentService } from './group.comment.service';

describe('GroupCommentService', () => {
  let service: GroupCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupCommentService],
    }).compile();

    service = module.get<GroupCommentService>(GroupCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
