// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


let host = 'http://localhost';
host = 'http://localhost';
const hostFeedback = 'http://localhost';
const hostjisr = 'https://qa-jisr.waseel.com/signIn'
const hostlegacy = 'http://legacy.dr-eclaims.waseel.com/'

export const environment = {
    name: `dev`,
    production: false,
    GA_TRACKING_ID: '',
    showFreshChat: false,
    versionCheckURL: `${host}:4200`,
    uploaderHost: `${host}:8080`,
    claimSearchHost: `${host}:8082`,
    claimServiceHost: `${host}:8081`,
    NotificationServiceHost: `${host}:8222/notification-service`,
    authenticationHost: `${host}:8086`,
    //authenticationHost: 'https://api.qa-eclaims.waseel.com/oauth',
    adminServiceHost: `${host}:8087`,
    auditTrailServiceHost: `${host}:8089`,
    settingsServiceHost: `${host}:8111`,
    claimInquireServiceHost: `${host}:8580`,
    validationServiceHost: `${host}:8121`,
    creditReportService: `${host}:8484`,
    tawuniyaCreditReportService: `${host}:8491`,
    pbmValidationService: `${host}:8099`,
    payerPaymentContractService: `${host}:8089`,
    approvalDetailInquiryService: `${host}:8333`,
    providersBeneficiariesService: `${host}:8995`,
    providerNphiesEligibility: `${host}:8022`,
    providerNphiesSearch: `${host}:8090`,
    providerNphiesApproval: `${host}:8025`,
    providerNphiesClaim: `${host}:8102`,
    mreClaimsSender:`${host}:8078`,
    nphiesClaimUploader: `${host}:8088`,
    claimsDownloadsService: `${host}:8052/downloads`,
    nphiesPollManagement: `${host}:9991`,
    contractManagementService: `${host}:8099`,
    claimReviewService: `${host}:8100`,
    nphiesConfigurationService: `${host}:8092`,
    tawuniyaGssReport: `${host}:8011`,
    nphiesClaimDownload: `${host}:8054/nphiesDownloads`,
    nphiesApprovalInquiry: `${host}:8101`,
    nphiesDownloadApprovleEligibility: `${host}:8055/nphiesApprovalEligibilityDownloads`,
    nphiesClaimLinkAttachment: `${host}:8094`,
    eclaimsTicketManagement: `${host}:8100`,
    providerNphiesClaimsSearch: `${host}:8091`,
    nphiesApprovalPBM: `${host}:8096`,
    nphiesApprovalMRE: `${host}:8077`,
    nphiesPollApprovalManagement: `${host}:8093`,
    nphiesPollClaimManagement: `${host}:8097`,
    chronicDiseaseManagement: `${host}:8199`,    
    feedbacksurveyUrl: `${hostFeedback}:5000/en`,
    communicationportalUrl: `${hostjisr}`,
    legacyUrl:`${hostlegacy}`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import `zone.js/dist/zone-error`;  // Included with Angular CLI.
