export default interface Stats {
    lifetimeRaised: number;
    topCharity: {
      charityName: string;
      amount: number;
    };
    topOccasion: {
      occasionName: string;
      totalAmount: number;
      startDate: Date;
      endDate: Date;
    };
  }