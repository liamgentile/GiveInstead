export default interface Donation {
    _id: string;
    donor_name: string;
    message?: string;
    amount: number;
    created_at: Date;
}