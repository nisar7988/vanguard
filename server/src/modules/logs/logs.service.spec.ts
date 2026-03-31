import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { StorageService } from '../../core/storage/storage.service';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: StorageService,
          useValue: {
            save: jest.fn(),
            load: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
