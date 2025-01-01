import { Injectable } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  constructor() {}

  async getUserName(clerkUserId: string): Promise<string> {
    try {
      const response = await clerkClient.users.getUser(clerkUserId);

      return response.firstName + ' ' + response.lastName;
    } catch (error) {
      throw new Error('Failed to fetch user from Clerk');
    }
  }
}
