const host = 'https://api.eclaims.waseel.com';
export const environment = {
  name: 'oci_prod',
  production: true,
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
  nphiesClaimUploader: `${host}/upload-v2`
};
