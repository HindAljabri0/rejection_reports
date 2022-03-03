

export class Upload {

    id: number;
    name: string;
    date: Date;

    totalClaims: number;

    assignedDoctor: {
        id: string;
        name: string;
    };
    pendingClaimsOfDoctor: number;
    reviewedClaimsOfDoctor: number;

    assignedCoder: {
        id: string;
        name: string;
    };
    pendingClaimsOfCoder: number;
    reviewedClaimsOfCoder: number;

    isLoading: boolean;

    static fromBackendResponse(incomingUpload): Upload {
        return {
            id: incomingUpload.id,
            name: incomingUpload.name,
            date: new Date(incomingUpload.uploadDate),
            totalClaims: incomingUpload.totalClaims,
            assignedDoctor: {
                id: incomingUpload.assignedDoctorId,
                name: incomingUpload.assignedDoctorName
            },
            pendingClaimsOfDoctor: incomingUpload.pendingClaimsOfDoctor,
            reviewedClaimsOfDoctor: incomingUpload.reviewedClaimsOfDoctor,
            assignedCoder: {
                id: incomingUpload.assignedCoderId,
                name: incomingUpload.assignedCoderName
            },
            pendingClaimsOfCoder: incomingUpload.pendingClaimsOfCoder,
            reviewedClaimsOfCoder: incomingUpload.reviewedClaimsOfCoder,
            isLoading: false
        }
    }

}