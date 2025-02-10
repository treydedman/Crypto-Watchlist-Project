/* exported data */

// Interface for crypto Asset
interface Asset {
  name: string;
  symbol: string;
  priceUsd: number;
  changePercent24Hr: number;
  marketCapUsd: number;
}

// Interface for Data
interface Data {
  view: string;
  assets: Asset[];
}

const localStorageKey = 'crypto-watchlist';

// Write data to local storage
function writeData(): void {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
}

// Load data from local storage with error handling and set watchlist as default view
function loadData(): Data {
  try {
    const dataJSON = localStorage.getItem(localStorageKey);
    if (dataJSON) {
      const parsedData = JSON.parse(dataJSON);
      return {
        view: parsedData.view || 'watchlist',
        assets: Array.isArray(parsedData.assets) ? parsedData.assets : [],
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }

  return { view: 'watchlist', assets: [] };
}

const data = loadData();
