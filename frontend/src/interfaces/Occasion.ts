import Charity from "./Charity";

export default interface Occasion {
    _id: string;
    id: string;
    name: string;
    description: string;
    type: "birthday" | "graduation" | "christmas" | "hanukkah" | "eid" | "diwali" | "mother's day" | "father's day" | "other";
    start: Date;
    end: Date;
    charities: Charity[];
  }