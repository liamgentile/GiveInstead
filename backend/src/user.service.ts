import { clerkClient } from "@clerk/clerk-sdk-node";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  async getCurrentUser(clerkUserId: string) {
    
    const user = await clerkClient.users.getUser(clerkUserId);
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }
}