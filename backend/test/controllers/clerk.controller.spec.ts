import { Test, TestingModule } from '@nestjs/testing';
import { ClerkController } from '../../src/clerk/clerk.controller';
import { ClerkService } from '../../src/clerk/clerk.service';
import { Logger, NotFoundException } from '@nestjs/common';

describe('ClerkController', () => {
  let controller: ClerkController;
  let service: ClerkService;
  let loggerSpy: jest.SpyInstance;

  const mockClerkService = {
    getUserName: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkController],
      providers: [
        {
          provide: ClerkService,
          useValue: mockClerkService,
        },
      ],
    }).compile();

    controller = module.get<ClerkController>(ClerkController);
    service = module.get<ClerkService>(ClerkService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserName', () => {
    const clerkUserId = 'test-user-id';

    it('should return user name successfully', async () => {
      const expectedName = 'John Doe';
      mockClerkService.getUserName.mockResolvedValue(expectedName);

      const result = await controller.getUserName(clerkUserId);

      expect(result).toBe(expectedName);
      expect(mockClerkService.getUserName).toHaveBeenCalledWith(clerkUserId);
      expect(mockClerkService.getUserName).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when service throws an error', async () => {
      const error = new Error('Service error');
      mockClerkService.getUserName.mockRejectedValue(error);

      await expect(controller.getUserName(clerkUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClerkService.getUserName).toHaveBeenCalledWith(clerkUserId);
    });

    it('should log error when service throws an error', async () => {
      const error = new Error('Service error');
      mockClerkService.getUserName.mockRejectedValue(error);

      try {
        await controller.getUserName(clerkUserId);
      } catch (e) {}

      expect(loggerSpy).toHaveBeenCalledWith(
        'User name not available',
        error.stack,
      );
    });
  });
});
