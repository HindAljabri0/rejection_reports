export class TicketSummaryResponse {
    ticketId: number;
    subject: string;
    createdDate: Date;
    type: string;
    payer: string;
    product: string;
    status: string;
    isError: string;
    errorMessage: string;
}