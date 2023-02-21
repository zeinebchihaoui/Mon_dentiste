// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//  export const environment = {
//   production: false,
//   apiTimeZone: 'Europe/Paris',
//   apiUrl: 'https://recette-01.api.basmile.clt.secure4all.tech:48080',
//   apiUrl: 'http://localhost:8080',
//   pathFile: 'https://media.basmile.clt.secure4all.tech/',
//   // link file server
//   // https://media.basmile.clt.secure4all.tech/bergues/1023678/ed59a5820a06553caf08fa97ac65b1dfa0f9c952.PDF
//   clinic: {
//     "bergues": {
//       apiUrl: 'https://bergues.api.prod.basmile.clt.secure4all.tech',
//       apiUrl: 'http://localhost:8080',
//       folder: 'bergues',
//       cabinet: 'bergues',
//     },
//     "centre": {
//       apiUrl: 'https://chantepoulet.api.prod.basmile.clt.secure4all.tech',
//       apiUrl: 'http://localhost:8080',
//       folder: 'chantepoulet',
//       cabinet: 'centre',
//     }
//   }
// };

 export const environment = {
  production: false,
  apiTimeZone: 'Europe/Paris',
  apiUrl: 'https://chantepoulet.api.prod.basmile.clt.secure4all.tech',
  pathFile: 'https://media.basmile.clt.secure4all.tech/',
  // link file server
  // https://media.basmile.clt.secure4all.tech/bergues/1023678/ed59a5820a06553caf08fa97ac65b1dfa0f9c952.PDF
  clinic: {
    "bergues": {
      apiUrl: 'https://bergues.api.prod.basmile.clt.secure4all.tech',
      folder: 'bergues',
      cabinet: 'bergues',
    },
    "centre": {
      apiUrl: 'https://chantepoulet.api.recette.basmile.clt.secure4all.tech',
      folder: 'chantepoulet',
      cabinet: 'centre',
    }
  }
};

 // https://bergues.api.recette.basmile.clt.secure4all.tech/register
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
