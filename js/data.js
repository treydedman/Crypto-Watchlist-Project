'use strict';
/* exported data */
const localStorageKey = 'crypto-watchlist';
// Write data to local storage
function writeData() {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
}
// Load data from local storage with error handling
function loadData() {
  try {
    const dataJSON = localStorage.getItem(localStorageKey);
    if (dataJSON) {
      const parsedData = JSON.parse(dataJSON);
      return {
        view: parsedData.view || 'watchlist', // Default view is now watchlist
        assets: Array.isArray(parsedData.assets) ? parsedData.assets : [],
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return { view: 'watchlist', assets: [] }; // Default to watchlist view if there's an error or no data
}
const data = loadData();
