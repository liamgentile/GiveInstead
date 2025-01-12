export class EveryDotOrgWebhookDto {
    chargeId: string;
    partnerDonationId: string;
    partnerMetadata: Object | undefined;
    firstName: string | undefined;
    lastName: string | undefined | null;
    email: string | null;
    toNonprofit: {
        slug: string,
        ein: string | undefined,
        name: string
    };
    amount: string;
    netAmount: string;
    currency: string;
    frequency: "Monthly" | "One-time";
    publicTestimony: string | undefined;
    privateNote: string | undefined;
    fromFundraiser: Object | undefined;
    paymentMethod: string;
  }
  