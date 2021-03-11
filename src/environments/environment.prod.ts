const host = 'https://api.eclaims.waseel.com';
export const environment = {
  name: 'prod',
  production: true,
  uploaderHost: `${host}/upload`,
  claimSearchHost: `${host}/search`,
  claimServiceHost: `${host}/claims`,
  NotificationServiceHost: `${host}/notifications`,
  authenticationHost: `${host}/oauth`,
  adminServiceHost: `${host}/admin`,
  auditTrailServiceHost: `${host}/audit`,
  settingsServiceHost:`${host}/settings`,
  claimInquireServiceHost: `${host}/claim-inquiry`,
  validationServiceHost: `${host}/validate`
};