export default interface Stats {
    lifetimeRaised: number;
    topCharity: {
      name: string;
      amount: number;
      description: string;
    };
    topOccasion: {
      name: string;
      amount: number;
      startDate: Date;
      endDate: Date;
    };
  }