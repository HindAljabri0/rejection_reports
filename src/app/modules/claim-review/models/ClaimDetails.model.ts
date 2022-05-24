export class ClaimDetails {
        claimDetailsId : number;
        claimUpload : {
            acceptedClaims : number;
            coderId : string;
            doctorId : string;
            noOfNotAcceptedClaims : number;
            noOfNotUploadedClaims : number;
            noOfUploadedClaims : number;
            providerId : number;
            uploadDate : Date;
            uploadId : number;
            uploadName : string;
        };
        coderId : string;
        coderName : string;
        coderRemark : string;
        coderReviewStatus : string;
        doctorId : string;
        doctorName : string;
        doctorRemark : string;
        doctorReviewStatus : string;
        patientFileNumber : string;
        provClaimNo : string;
        providerId : string;
        uploadStatus : number;
        uploadStatusDesc : string;
        validationStatus : string;
    };