export class BillSearchModel {
    patientId: string;
    departmentId: string;
    doctorId: string;
    billId: string;
    withPagination: boolean;
    page: number;
    size: number;
}