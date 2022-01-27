// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


let host = 'http://localhost';
host = 'http://localhost';

export const environment = {
  name: `dev`,
  production: false,
  GA_TRACKING_ID: '',
  showFreshChat: false,
  versionCheckURL: `${host}:4200`,
  uploaderHost: `${host}:8080`,
  claimSearchHost: `${host}:8082`,
  claimServiceHost: `${host}:8081`,
  NotificationServiceHost: `${host}:8222/notification-service`,
  authenticationHost: `${host}:8086`,
  adminServiceHost: `${host}:8087`,
  auditTrailServiceHost: `${host}:8089`,
  settingsServiceHost: `${host}:8111`,
  claimInquireServiceHost: `${host}:8580`,
  validationServiceHost: `${host}:8121`,
  creditReportService: `${host}:8484`,
  tawuniyaCreditReportService: `${host}:8491`,
  pbmValidationService: `${host}:8099`,
  payerPaymentContractService: `${host}:8089`,
  approvalDetailInquiryService: `${host}:8333`,
  providersBeneficiariesService: `${host}:8995`,
  providerNphiesEligibility: `${host}:8022`,
  providerNphiesSearch: `${host}:8090`,
  providerNphiesApproval: `${host}:8025`,
  nphiesClaimUploader: `http://192.168.1.177:8088`,
  claimsDownloadsService: `${host}:8052`,
  nphiesPollManagement: `${host}:9991`,
  contractManagementService: `${host}:8099`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import `zone.js/dist/zone-error`;  // Included with Angular CLI.
