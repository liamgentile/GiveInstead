import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteCharityController } from '../../src/favourite-charities/controllers/favouriteCharities.controller';
import { CreateFavouriteCharityDto } from '../../src/favourite-charities/dto/createFavouriteCharity.dto';
import { UpdateFavouriteCharityNoteDto } from '../../src/favourite-charities/dto/updateFavouriteCharityNote.dto';
import { FavouriteCharitiesService } from '../../src/favourite-charities/services/favouriteCharities.service';

describe('FavouriteCharityController', () => {
  let controller: FavouriteCharityController;
  let favouriteCharitiesService: FavouriteCharitiesService;

  const mockFavouriteCharitiesService = {
    create: jest.fn(),
    updateNote: jest.fn(),
    findByUser: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouriteCharityController],
      providers: [
        {
          provide: FavouriteCharitiesService,
          useValue: mockFavouriteCharitiesService,
        },
      ],
    }).compile();

    controller = module.get<FavouriteCharityController>(
      FavouriteCharityController,
    );
    favouriteCharitiesService = module.get<FavouriteCharitiesService>(
      FavouriteCharitiesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a favourite charity', async () => {
      const createFavouriteCharityDto: CreateFavouriteCharityDto = {
        every_id: 'everyId1',
        every_slug: 'everySlug1',
        clerk_user_id: 'clerkUser1',
        name: 'Charity 1',
        website: 'https://charity1.org',
        description: 'A great charity',
        image_url: 'https://charity1.org/image.jpg',
      };

      mockFavouriteCharitiesService.create.mockResolvedValue(
        createFavouriteCharityDto,
      );

      const result = await controller.create(createFavouriteCharityDto);
      expect(result).toEqual(createFavouriteCharityDto);
      expect(mockFavouriteCharitiesService.create).toHaveBeenCalledWith(
        createFavouriteCharityDto,
      );
    });

    it('should throw error if create fails', async () => {
      const createFavouriteCharityDto: CreateFavouriteCharityDto = {
        every_id: 'everyId1',
        every_slug: 'everySlug1',
        clerk_user_id: 'clerkUser1',
        name: 'Charity 1',
        website: 'https://charity1.org',
        description: 'A great charity',
        image_url: 'https://charity1.org/image.jpg',
      };

      mockFavouriteCharitiesService.create.mockRejectedValue(
        new Error('Creation failed'),
      ); 

      await expect(
        controller.create(createFavouriteCharityDto),
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('updateNote', () => {
    it('should successfully update the charity note', async () => {
      const updateFavouriteCharityNoteDto: UpdateFavouriteCharityNoteDto = {
        _id: '1',
        note: 'Updated note',
      };

      mockFavouriteCharitiesService.updateNote.mockResolvedValue(
        updateFavouriteCharityNoteDto,
      ); 

      const result = await controller.updateNote(updateFavouriteCharityNoteDto);
      expect(result).toEqual(updateFavouriteCharityNoteDto);
      expect(mockFavouriteCharitiesService.updateNote).toHaveBeenCalledWith(
        updateFavouriteCharityNoteDto,
      );
    });

    it('should throw error if updateNote fails', async () => {
      const updateFavouriteCharityNoteDto: UpdateFavouriteCharityNoteDto = {
        _id: '1',
        note: 'Updated note',
      };

      mockFavouriteCharitiesService.updateNote.mockRejectedValue(
        new Error('Update failed'),
      ); 

      await expect(
        controller.updateNote(updateFavouriteCharityNoteDto),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('findByUser', () => {
    it('should return favourite charities for the user', async () => {
      const clerkUserId = 'user123';
      const favouriteCharities = [{ name: 'Charity 1' }, { name: 'Charity 2' }];

      mockFavouriteCharitiesService.findByUser.mockResolvedValue(
        favouriteCharities,
      ); 

      const result = await controller.findByUser(clerkUserId);
      expect(result).toEqual(favouriteCharities);
      expect(mockFavouriteCharitiesService.findByUser).toHaveBeenCalledWith(
        clerkUserId,
      );
    });

    it('should throw error if findByUser fails', async () => {
      const clerkUserId = 'user123';

      mockFavouriteCharitiesService.findByUser.mockRejectedValue(
        new Error('Find by user failed'),
      ); 

      await expect(controller.findByUser(clerkUserId)).rejects.toThrow(
        'Find by user failed',
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove a favourite charity', async () => {
      const id = '1';
      mockFavouriteCharitiesService.remove.mockResolvedValue({ success: true }); // Mock success

      const result = await controller.remove(id);
      expect(result).toEqual({ success: true });
      expect(mockFavouriteCharitiesService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw error if remove fails', async () => {
      const id = '1';

      mockFavouriteCharitiesService.remove.mockRejectedValue(
        new Error('Remove failed'),
      ); 

      await expect(controller.remove(id)).rejects.toThrow('Remove failed');
    });
  });
});
