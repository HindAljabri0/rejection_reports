// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   name: 'dev',
//   production: false,
//   uploaderHost: "http://localhost:8080",
//   claimSearchHost: "http://localhost:8082",
//   claimServiceHost: "http://localhost:8081",
//   NotificationServiceHost: "http://localhost:8222/notification-service",
//   authenticationHost: "http://localhost:8086",
//   adminServiceHost: "http://localhost:8087",
//   auditTrailServiceHost: "http://localhost:8089",
//   settingsServiceHost:"http://localhost:8111",
//   claimInquireServiceHost:"http://localhost:8580"
// };
// export const environment = {
//   auditTrailServiceHost: 'http://192.168.1.182:8089',
//   claimInquireServiceHost: 'http://192.168.1.182:8580',
//   authenticationHost: 'http://192.168.1.182:8086',
//   settingsServiceHost: 'http://192.168.1.182:8111',
//   claimServiceHost: 'http://192.168.1.182:8081',
// };
export const environment = {
  name: 'dev',
  production: false,
  uploaderHost: 'http://192.168.1.182:8080',
  claimSearchHost: 'http://192.168.1.182:8082',
  claimServiceHost: 'http://192.168.1.182:8081',
  NotificationServiceHost: 'http://192.168.1.182:8222/notification-service',
  authenticationHost: 'https://api.qa-eclaims.waseel.com/oauth',
  adminServiceHost: 'http://192.168.1.182:8087',
  auditTrailServiceHost: 'https://api.qa-eclaims.waseel.com/audit',
  settingsServiceHost: 'https://api.qa-eclaims.waseel.com/settings',
  claimInquireServiceHost: 'https://api.qa-eclaims.waseel.com/claim-inquiry'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
