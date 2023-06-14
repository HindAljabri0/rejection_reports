const host = 'https://api.eclaims.waseel.com';
// const apiDotHost = 'https://api.eclaims.waseel.com';
export const environment = {
    name: 'oci_prod',
    production: true,
    GA_TRACKING_ID: 'G-5NSFHV5Y6V',
    showFreshChat: true,
    versionCheckURL: `https://eclaims.waseel.com`,
    uploaderHost: `${host}/upload`,
    claimSearchHost: `${host}/search`,
    claimServiceHost: `${host}/claims`,
    NotificationServiceHost: `${host}/notifications`,
    authenticationHost: `${host}/oauth`,
    adminServiceHost: `${host}/admin`,
    auditTrailServiceHost: `${host}/audit`,
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
    claimsDownloadsService: `${host}/downloads`,
    nphiesPollManagement: `${host}/poll-management`,
    contractManagementService: `${host}/contract-billing`,
    claimReviewService: `${host}/review`,
    nphiesConfigurationService: `${host}/nphies-configurations`,
    tawuniyaGssReport: `${host}/gss-report`,
    nphiesClaimDownload: `${host}/nphiesDownloads`,
    nphiesApprovalInquiry: `${host}/nphies-approval-inquiry`,
    nphiesDownloadApprovleEligibility: `${host}/nphiesApprovalEligibilityDownloads`,
    providerNphiesClaim:`${host}/nphies-claim`,
    nphiesClaimLinkAttachment: `${host}/nphies-claim-attachment-link`,
    eclaimsTicketManagement: `${host}/eclaims-ticket-management`,
    providerNphiesClaimsSearch: `${host}/provider-nphies-claim-search`,
    nphiesApprovalPBM:`${host}/nphies-approval-pbm-validation`,
    nphiesPollApprovalManagement: `${host}/nphies-poll-approval-management`,
    nphiesPollClaimManagement: `${host}/nphies-poll-claim-management`   
};
