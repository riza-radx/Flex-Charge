// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Flex Charge - LOCAL
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  // TODO: zevendeso me public_key e Flex Charge nga tabela `authKeys` (domain: flexcharge)
  publicKey: 'f3e14e27b2da1aa23cfe0984fe7ec6a21f17a10f1f1656c59ba44280816a0097',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
