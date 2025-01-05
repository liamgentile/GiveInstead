import { Test, TestingModule } from '@nestjs/testing';
import { ClerkService } from '../../src/clerk/clerk.service';
import { Logger } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';

jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
  },
}));

describe('ClerkService', () => {
  let service: ClerkService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();

    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [ClerkService],
    }).compile();

    service = module.get<ClerkService>(ClerkService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUserName', () => {
    const clerkUserId = 'test-user-id';

    it('should return full name when both first and last name are available', async () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
      };

      (clerkClient.users.getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserName(clerkUserId);
      expect(result).toBe('John Doe');
      expect(clerkClient.users.getUser).toHaveBeenCalledWith(clerkUserId);
    });

    it('should return only first name when last name is not available', async () => {
      const mockUser = {
        firstName: 'John',
        lastName: '',
        username: 'john',
      };

      (clerkClient.users.getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserName(clerkUserId);
      expect(result).toBe('John');
      expect(clerkClient.users.getUser).toHaveBeenCalledWith(clerkUserId);
    });

    it('should return username when first and last names are not available', async () => {
      const mockUser = {
        firstName: '',
        lastName: '',
        username: 'johndoe',
      };

      (clerkClient.users.getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserName(clerkUserId);
      expect(result).toBe('johndoe');
      expect(clerkClient.users.getUser).toHaveBeenCalledWith(clerkUserId);
    });

    it('should throw error when no name fields are available', async () => {
      const mockUser = {
        firstName: '',
        lastName: '',
        username: '',
      };

      (clerkClient.users.getUser as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.getUserName(clerkUserId)).rejects.toThrow('Failed to fetch user from Clerk');
      expect(loggerSpy).toHaveBeenCalledWith('User name not available');
    });

    it('should throw error when Clerk API call fails', async () => {
      const error = new Error('API Error');
      (clerkClient.users.getUser as jest.Mock).mockRejectedValue(error);

      await expect(service.getUserName(clerkUserId)).rejects.toThrow('Failed to fetch user from Clerk');
      expect(loggerSpy).toHaveBeenCalledWith('Failed to fetch user from Clerk', error.stack);
    });
  });
});