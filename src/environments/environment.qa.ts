const host = 'http://gateway.okd.waseel.com';
export const environment = {
    name: 'qa',
    production: true,
    GA_TRACKING_ID: '',
    showFreshChat: false,
    versionCheckURL: `http://okd.waseel.com`,
    uploaderHost: `${host}/claim-uploader`,
    claimSearchHost: `${host}/claim-search`,
    claimServiceHost: `${host}/claim-service`,
    NotificationServiceHost: `${host}/notification-service`,
    authenticationHost: `${host}/authentication`,
    adminServiceHost: `${host}/admin-service`,
    auditTrailServiceHost: `${host}/audit-trail`,
    settingsServiceHost: `${host}/settings`,
    claimInquireServiceHost: `${host}/claim-inquiry`,
    validationServiceHost: `${host}/validate`,
    creditReportService: `${host}/reports`,
    tawuniyaCreditReportService: `${host}/credit-report`,
    pbmValidationService: `${host}/pbm`,
    payerPaymentContractService: `${host}`,
    approvalDetailInquiryService: `${host}/approval-detail-inquiry`,
    providersBeneficiariesService: `${host}/beneficiaries`,
    providerNphiesEligibility: `${host}/eligibilities`,
    providerNphiesSearch: `${host}/provider-nphies-search`,
    providerNphiesApproval: `${host}/approvals`,
    nphiesClaimUploader: `${host}/upload-v2`,

    nphiesPollManagement: `${host}/poll-management`,
    contractManagementService: `${host}/contract-billing`,

    claimsDownloadsService: `${host}/downloads`,
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
    nphiesApprovalPBM:`${host}/nphies-approval-pbm-validation`
};
