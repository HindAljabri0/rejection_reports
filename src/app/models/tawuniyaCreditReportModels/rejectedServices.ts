export class RejectedService {

    agree: string;
    attachmentrefno: string;
    attachmenturl: string;
    comments: string;
    newComments?: string;
    newAttachment?: File;
    newAttachmentSrc?: string;
    deductedamount: number;
    deductedservicesIcd10s: { id: number, diagnosiscode: string, diagnosisdescription: string }[];
    exceedprice: number;
    filename: string;
    grossamount: number;
    id: { serialno: string, batchreferenceno: string };
    invoicedate: Date;
    invoiceno: string;
    memberid: string;
    membername: string;
    patientfileno: string;
    patientshare: number;
    payerclaimno: string;
    payerdiscount: number;
    physicianid: string;
    physicianname: string;
    policyno: string;
    quantity: number;
    receiveddiscount: number;
    receivedgross: number;
    rejectionreason: string;
    requestednetamount: number;
    servicecode: string;
    servicedescription: string;
    serviceprice: number;
    visitdate: Date;
    waseelbatch: string;

}
