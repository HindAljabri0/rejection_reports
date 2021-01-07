const host = 'https://api.stg-eclaims.waseel.com';
export const environment = {
  name: 'oci_staging',
  production: true,
  uploaderHost: `${host}/upload`,
  claimSearchHost: `${host}/search`,
  claimServiceHost: `${host}/claims`,
  NotificationServiceHost: `${host}/notifications`,
  authenticationHost: `${host}/oauth`,
  adminServiceHost: `${host}/admin`,
  auditTrailServiceHost: `${host}/audit`,
  settingsServiceHost:`${host}/settings`,
  claimInquireServiceHost: `${host}/claim-inquiry`
};
