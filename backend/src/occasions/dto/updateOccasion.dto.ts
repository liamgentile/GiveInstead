import { Charity } from '../schemas/occasion.schema';

export class UpdateOccasionDto {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  charities: Charity[];
}