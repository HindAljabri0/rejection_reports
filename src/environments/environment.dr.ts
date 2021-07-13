const host = 'https://api.qa-eclaims.waseel.com';
export const environment = {
  name: 'dr',
  production: true,
  versionCheckURL: `https://qa-eclaims.waseel.com`,
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
  payerPaymentContractService: `${host}`
};
