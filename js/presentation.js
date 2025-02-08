'use strict';
// Event Listener Setup
document.addEventListener('DOMContentLoaded', () => {
  // Load data first
  loadData();
  // Ensure data.assets is always an array
  if (!Array.isArray(data.assets)) {
    data.assets = [];
  }
});
// Query for the DOM elements
const searchInput = document.getElementById('symbol');
const searchButton = document.getElementById('searchButton');
const cryptoDataDiv = document.getElementById('crypto-data');
// Function to fetch crypto data by name and set it to lower case for API requirements
const apiUrl = 'https://api.coincap.io/v2/assets';
async function fetchCryptoData(name) {
  try {
    const response = await fetch(`${apiUrl}/${name.toLowerCase()}`);
    const data = await response.json();
    if (data && data.data) {
      return {
        name: data.data.name,
        symbol: data.data.symbol,
        priceUsd: parseFloat(data.data.priceUsd),
        changePercent24Hr: parseFloat(data.data.changePercent24Hr),
        marketCapUsd: parseFloat(data.data.marketCapUsd),
      };
    }
  } catch (error) {
    alert(
      'Error fetching data. Please check the cryptocurrency name and try again.',
    );
  }
  return null;
}
// Event listener for the search button click
searchButton.addEventListener('click', async () => {
  const name = searchInput.value.trim();
  if (name) {
    const asset = await fetchCryptoData(name);
    if (asset) {
      // Clear any previous data in the cryptoDataDiv
      cryptoDataDiv.innerHTML = '';
      // Call the renderAsset function
      renderAsset(asset);
      // Show the cryptoDataDiv after adding data
      cryptoDataDiv.style.display = 'block';
    } else {
      alert('Crypto name not found or invalid.');
    }
  } else {
    alert('Please enter a valid crypto name.');
  }
  // Clear the input field after search
  searchInput.value = '';
});
// Function to render the asset in the search view
function renderAsset(asset) {
  // Create the card div
  const card = document.createElement('div');
  card.classList.add('card');
  // Asset Name
  const dataNameElement = document.createElement('h2');
  dataNameElement.classList.add('data-name');
  dataNameElement.textContent = asset.name;
  card.appendChild(dataNameElement);
  // Asset Symbol
  const dataSymbolElement = document.createElement('p');
  dataSymbolElement.classList.add('data-symbol');
  dataSymbolElement.textContent = asset.symbol;
  card.appendChild(dataSymbolElement);
  // Asset Price
  const dataPriceUsdElement = document.createElement('h1');
  dataPriceUsdElement.classList.add('data-priceUsd');
  dataPriceUsdElement.textContent = `$${asset.priceUsd.toFixed(2)}`;
  card.appendChild(dataPriceUsdElement);
  // Asset 24-Hour Change
  const dataChangePercent24HrElement = document.createElement('p');
  dataChangePercent24HrElement.classList.add('data-changePercent24Hr');
  if (asset.changePercent24Hr > 0) {
    dataChangePercent24HrElement.textContent = `+${asset.changePercent24Hr.toFixed(2)}% (24Hr)`;
    dataChangePercent24HrElement.classList.add('positive');
  } else {
    dataChangePercent24HrElement.textContent = `${asset.changePercent24Hr.toFixed(2)}% (24Hr)`;
    dataChangePercent24HrElement.classList.add('negative');
  }
  card.appendChild(dataChangePercent24HrElement);
  // Market Cap Label
  const marketCapLabelElement = document.createElement('h3');
  marketCapLabelElement.classList.add('market-cap');
  marketCapLabelElement.textContent = 'Market Cap';
  card.appendChild(marketCapLabelElement);
  // Market Cap Value
  const dataMarketCapUsdElement = document.createElement('h2');
  dataMarketCapUsdElement.classList.add('data-marketCapUsd');
  dataMarketCapUsdElement.textContent = `$${(asset.marketCapUsd / 1_000_000_000).toFixed(2)} B`;
  card.appendChild(dataMarketCapUsdElement);
  // Add to Watchlist Button
  const addToWatchlistBtn = document.createElement('button');
  addToWatchlistBtn.textContent = 'Add to Watchlist';
  addToWatchlistBtn.classList.add('add-to-watchlist');
  addToWatchlistBtn.addEventListener('click', () => {
    addAsset(asset); // Add asset to watchlist
    renderWatchlist(); // Update watchlist
    viewSwap('watchlist'); // Switch to the watchlist view
  });
  card.appendChild(addToWatchlistBtn);
  // Append the card to the container (e.g., `cryptoDataDiv`)
  cryptoDataDiv.appendChild(card);
}
