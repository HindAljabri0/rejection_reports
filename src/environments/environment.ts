// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'dev',
  production: false,
  versionCheckURL: `http://localhost:4200`,
  uploaderHost: 'http://localhost:8080',
  claimSearchHost: 'http://localhost:8082',
  claimServiceHost: 'http://localhost:8081',
  NotificationServiceHost: 'http://localhost:8222/notification-service',
  authenticationHost: 'http://localhost:8086',
  adminServiceHost: 'http://localhost:8087',
  auditTrailServiceHost: 'http://localhost:8089',
  settingsServiceHost: 'http://localhost:8111',
  claimInquireServiceHost: 'http://localhost:8580',
  validationServiceHost: 'http://localhost:8121',
  creditReportService: 'http://localhost:8484',
  tawuniyaCreditReportService: 'http://localhost:8491',
  pbmValidationService: 'http://localhost:8099',
  payerPaymentContractService: `http://localhost:8089`,
  approvalDetailInquiryService: 'http://localhost:8333',
  providersBeneficiariesService: `http://localhost:8995`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
