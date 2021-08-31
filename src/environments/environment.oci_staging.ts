const host = 'https://api.stg-eclaims.waseel.com';
export const environment = {
  name: 'oci_staging',
  production: true,
  versionCheckURL: `https://stg-eclaims.waseel.com`,
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
  providerNphiesSearch: `${host}/provider-nphies-search`
};
