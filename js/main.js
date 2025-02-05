'use strict';
// Query the DOM elements
const searchInput = document.getElementById('symbol');
const searchButton = document.getElementById('searchButton');
const cryptoDataDiv = document.getElementById('crypto-data');
const dataName = document.getElementById('dataName');
const dataSymbol = document.getElementById('dataSymbol');
const dataPriceUsd = document.getElementById('dataPriceUsd');
const dataChangePercent24Hr = document.getElementById('dataChangePercent24Hr');
const marketCapLabel = document.querySelector('.market-cap');
const dataMarketCapUsd = document.getElementById('dataMarketCapUsd');
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
    console.error('Error fetching crypto data:', error);
  }
  return null;
}
// Event listener for the search button click
searchButton.addEventListener('click', async () => {
  const name = searchInput.value.trim();
  if (name) {
    const asset = await fetchCryptoData(name);
    if (asset) {
      // Display the fetched asset data
      dataName.textContent = asset.name;
      dataSymbol.textContent = asset.symbol;
      dataPriceUsd.textContent = `$${asset.priceUsd.toFixed(2)}`;
      dataChangePercent24Hr.textContent = `${asset.changePercent24Hr.toFixed(2)}%`;
      // Set color classes
      dataChangePercent24Hr.classList.remove('positive', 'negative');
      // Apply correct class based on value
      if (asset.changePercent24Hr > 0) {
        dataChangePercent24Hr.textContent = `+${asset.changePercent24Hr.toFixed(2)}% (24Hr)`;
        dataChangePercent24Hr.classList.add('positive');
      } else {
        dataChangePercent24Hr.textContent = `${asset.changePercent24Hr.toFixed(2)}% (24Hr)`;
        dataChangePercent24Hr.classList.add('negative');
      }
      // Convert and display the market cap in billions
      marketCapLabel.textContent = 'Market Cap';
      dataMarketCapUsd.textContent = `$${(asset.marketCapUsd / 1_000_000_000).toFixed(2)} B`;
      // Display the data section
      cryptoDataDiv.style.display = 'block';
      // Create the Add to Watchlist button dynamically
      const addToWatchlistBtn = document.createElement('button');
      addToWatchlistBtn.textContent = 'Add to Watchlist';
      addToWatchlistBtn.classList.add('add-to-watchlist');
      // Remove any existing "Add to Watchlist" button before appending a new one
      const existingBtn = cryptoDataDiv.querySelector('.add-to-watchlist');
      if (existingBtn) {
        existingBtn.remove();
      }
      addToWatchlistBtn.addEventListener('click', () => {
        console.log('Add to watchlist clicked!');
        // // Save the asset to the watchlist using the `addAsset` function from `data.ts`
        // addAsset(asset);
        // Display message to the user
        alert(`${asset.name} has been added to your watchlist!`);
      });
      // Append the add to watchlist button to the cryptoDataDiv
      cryptoDataDiv.appendChild(addToWatchlistBtn);
    } else {
      alert('Crypto name not found or invalid.');
    }
  } else {
    alert('Please enter a valid crypto name.');
  }
  // Clear the input field after search
  searchInput.value = '';
});
