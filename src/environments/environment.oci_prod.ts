const host = 'https://eclaims.waseel.com/api';
const apiDotHost = 'https://api.eclaims.waseel.com';
export const environment = {
    name: 'oci_prod',
    production: true,
    GA_TRACKING_ID: 'G-5NSFHV5Y6V',
    showFreshChat: true,
    versionCheckURL: `https://eclaims.waseel.com`,
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
};
