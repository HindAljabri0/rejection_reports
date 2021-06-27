const host = 'http://gateway.okd.waseel.com';
export const environment = {
  name: 'qa',
  production: true,
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
  pbmValidationService: `${host}/pbm`
};
