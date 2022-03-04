const host = 'https://api.eclaims.waseel.com';
export const environment = {
    name: 'prod',
    production: true,
    GA_TRACKING_ID: '',
    showFreshChat: false,
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
    claimReviewService: `${host}/review`

};
