const host = 'https://stg-eclaims.waseel.com/api';
const apiDotHost = 'https://api.stg-eclaims.waseel.com';
const hostFeedback = 'https://feedback.stg-eclaims.waseel.com/en/';
const hostjisr = 'https://stg-jisr.waseel.com/signIn'
const hostlegacy = 'http://legacy.stg-eclaims.waseel.com/'

export const environment = {
    name: 'oci_staging',
    production: true,
    GA_TRACKING_ID: 'G-VML3GL1L5T',
    showFreshChat: true,
    versionCheckURL: `https://stg-eclaims.waseel.com`,
    uploaderHost: `${host}/upload`,
    claimSearchHost: `${host}/search`,
    claimServiceHost: `${host}/claims`,
    NotificationServiceHost: `${apiDotHost}/notifications`,
    authenticationHost: `${host}/oauth`,
    adminServiceHost: `${host}/admin`,
    auditTrailServiceHost: `${apiDotHost}/audit`,
    settingsServiceHost: `${host}/settings`,
    claimInquireServiceHost: `${host}/claim-inquiry`,
    validationServiceHost: `${host}/validate`,
    creditReportService: `${host}/reports`,
    tawuniyaCreditReportService: `${host}/credit-report`,
    pbmValidationService: `${host}/pbm`,
    mreClaimsSender:`${host}/mre-claims-sender`,
    nphiesApprovalMRE: `${host}/nphies-approval-mre-validation`,
    payerPaymentContractService: `${host}/payer-payment-contract`,
    approvalDetailInquiryService: `${host}/approval-detail-inquiry`,
    providersBeneficiariesService: `${host}/beneficiaries`,
    providerNphiesEligibility: `${host}/eligibilities`,
    providerNphiesSearch: `${host}/provider-nphies-search`,
    providerNphiesApproval: `${host}/approvals`,
    nphiesClaimUploader: `${host}/upload-v2`,
    claimsDownloadsService: `${apiDotHost}/downloads`,
    nphiesPollManagement: `${host}/poll-management`,
    contractManagementService: `${host}/contract-billing`,
    claimReviewService: `${host}/review`,
    nphiesConfigurationService: `${host}/nphies-configurations`,
    tawuniyaGssReport: `${host}/gss-report`,
    nphiesClaimDownload: `${apiDotHost}/nphiesDownloads`,
    nphiesApprovalInquiry: `${host}/nphies-approval-inquiry`,
    nphiesDownloadApprovleEligibility: `${apiDotHost}/nphiesApprovalEligibilityDownloads`,
    providerNphiesClaim:`${host}/nphies-claim`,
    nphiesClaimLinkAttachment: `${host}/nphies-claim-attachment-link`,
    eclaimsTicketManagement: `${host}/eclaims-ticket-management`,
    providerNphiesClaimsSearch: `${host}/provider-nphies-claim-search`,
    nphiesApprovalPBM:`${host}/nphies-approval-pbm-validation`,
    nphiesPollApprovalManagement: `${host}/nphies-poll-approval-management`,
    nphiesPollClaimManagement: `${host}/nphies-poll-claim-management`,
    chronicDiseaseManagement: `${host}/chronic-disease-management`,
    feedbacksurveyUrl: `${hostFeedback}`,
    communicationportalUrl: `${hostjisr}`,
    legacyUrl:`${hostlegacy}`,
};
