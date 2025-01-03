import { Charity } from "../schemas/occasion.schema";

export class OccasionDto {
  clerk_user_id: string;
  name: string;
  description: string;
  type: string;
  start: Date;
  end: Date;
  url: string;
  charities: Charity[];
}
