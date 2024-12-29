import Charity from "./Charity";

export default interface Occasion {
    id: string;
    name: string;
    description: string;
    type: "birthday" | "christmas" | "hanukkah" | "other";
    startDate: Date;
    endDate: Date;
    charities: {
      charity: Charity;
      goal: number;
      description: string;
    }[];
  }