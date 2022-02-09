

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

}