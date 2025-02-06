'use strict';
/* exported data */
// // Interface for crypto Asset
// interface Asset {
//   name: string;
//   symbol: string;
//   priceUsd: number;
//   changePercent24Hr: number;
//   marketCapUsd: number;
// }
// // Interface for Data
// interface Data {
//   view: string;
//   assets: Asset[];
// }
// const localStorageKey = 'crypto-watchlist';
// // Write data to local storage
// function writeData(): void {
//   localStorage.setItem(localStorageKey, JSON.stringify(data));
// }
// // Load data from local storage
// function loadData(): Data {
//   const dataJSON = localStorage.getItem(localStorageKey);
//   if (dataJSON) {
//     return JSON.parse(dataJSON);
//   } else {
//     return {
//       view: 'search',
//       assets: [],
//     };
//   }
// }
// const data = loadData();
// // Function to add a new asset to the beginning of the watchlist
// function addAsset(asset: Asset): void {
//   data.assets.unshift(asset);
//   writeData();
// }
