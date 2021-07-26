// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'dev',
  production: false,
  versionCheckURL: `http://192.168.1.135:4200`,
  uploaderHost: 'http://192.168.1.135:8080',
  claimSearchHost: 'http://192.168.1.135:8082',
  claimServiceHost: 'http://192.168.1.135:8081',
  NotificationServiceHost: 'http://192.168.1.135:8222/notification-service',
  authenticationHost: 'http://192.168.1.135:8086',
  adminServiceHost: 'http://192.168.1.135:8087',
  auditTrailServiceHost: 'http://192.168.1.135:8089',
  settingsServiceHost: 'http://192.168.1.135:8111',
  claimInquireServiceHost: 'http://192.168.1.135:8580',
  validationServiceHost: 'http://192.168.1.135:8121',
  creditReportService: 'http://192.168.1.135:8484',
  tawuniyaCreditReportService: 'http://192.168.1.135:8491',
  pbmValidationService: 'http://192.168.1.135:8099',
  payerPaymentContractService: `http://192.168.1.135:8089/payer-payment-contract`

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
