// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080/api/',
  authSignInPath: 'auth/signin',
  authSignUpPath: 'auth/signup',
  getManfUrl: 'manufacturer/get',
  updManfUrl: 'manufacturer/create-update',
  getPrdUrl: 'products/get',
  updPrdUrl: 'products/create-update',
  deletePrdUrl: 'products/',
  getStateUrl: 'data/getStates',
  getCitiesUrl: 'data/getCities',
  getCatgUrl: 'data/getCategory',
  genXcelUrl: 'data/generateXcel/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
