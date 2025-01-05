import { Injectable, Logger } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);

  async getUserName(clerkUserId: string): Promise<string> {
    try {      
      const response = await clerkClient.users.getUser(clerkUserId);
  
      if (response.firstName && response.lastName) {
        return response.firstName + ' ' + response.lastName;  
      } else if (response.firstName) {
        return response.firstName;  
      } else if (response.username) {
        return response.username;
      } else {
        this.logger.error('User name not available');
        throw new Error('User name is not available');
      }
    } catch (error) {
      this.logger.error('Failed to fetch user from Clerk', error.stack);
      throw new Error('Failed to fetch user from Clerk');
    }
  }
}
