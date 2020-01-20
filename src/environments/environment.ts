// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  uploaderHost: "http://localhost:8080",
  claimSearchHost: "http://localhost:8082",
  claimServiceHost: "http://localhost:8081",
  NotificationServiceHost: "http://localhost:8222",
  authenticationHost: "http://localhost:8086",
  adminServiceHost: "http://localhost:8087",
  auditTrailServiceHost: "http://localhost:8089"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
