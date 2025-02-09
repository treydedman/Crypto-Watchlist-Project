'use strict';
// Load data first
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  // Ensure data.assets is always an array
  if (!Array.isArray(data.assets)) {
    data.assets = [];
  }
});
// Fetch data and render dashboard
document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardAssets();
});
// Query the DOM elements
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
// Holds data for the dashboard
let dashboardAssets = [];
// Fetch the top 8 crypto based on market cap
async function fetchDashboardAssets() {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=8');
    const data = await response.json();
    dashboardAssets = data.data.map((asset) => ({
      name: asset.name,
      symbol: asset.symbol,
      priceUsd: parseFloat(asset.priceUsd),
      changePercent24Hr: parseFloat(asset.changePercent24Hr),
      marketCapUsd: parseFloat(asset.marketCapUsd),
    }));
    renderDashboard();
  } catch (error) {
    alert('Error fetching dashboard assets!');
  }
}
// Function to get the current watchlist
function getWatchlist() {
  return data.assets;
}
// Function to add an asset to the watchlist and store it in localStorage
function addAsset(asset) {
  // Ensure loadData() has been called before modifying data.assets
  if (!Array.isArray(data.assets)) {
    data.assets = [];
  }
  // Check if the asset already exists in the watchlist by symbol in UpperCase
  const existingAsset = data.assets.find(
    (item) => item.symbol.toUpperCase() === asset.symbol.toUpperCase(),
  );
  // If the asset does not exist - add it to the watchlist
  if (!existingAsset) {
    data.assets = [asset, ...data.assets];
    // Save to localStorage
    writeData();
  } else {
    // Show an alert if the asset is already in the watchlist
    alert(`The asset ${asset.symbol} is already on your watchlist.`);
  }
}
// Function to remove an asset from the watchlist and update localStorage
function removeAsset(symbol) {
  if (!Array.isArray(data.assets)) {
    data.assets = [];
  }
  // Remove the asset
  data.assets = data.assets.filter(
    (asset) => asset.symbol.toUpperCase() !== symbol.toUpperCase(),
  );
  // Save updated list to localStorage
  writeData();
}
// Function to render the asset in the search view
function renderAsset(asset) {
  // Create the card div
  const card = document.createElement('div');
  card.classList.add('card');
  // Create a container for the icon and name
  const nameContainer = document.createElement('div');
  nameContainer.classList.add('name-container');
  // Asset Icon
  const iconElement = document.createElement('img');
  iconElement.classList.add('asset-icon');
  iconElement.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
  iconElement.alt = `${asset.name} icon`;
  // Asset Name
  const dataNameElement = document.createElement('h2');
  dataNameElement.classList.add('data-name');
  dataNameElement.textContent = asset.name;
  // Append icon and name to the container
  nameContainer.appendChild(iconElement);
  nameContainer.appendChild(dataNameElement);
  // Append the name container to the card
  card.appendChild(nameContainer);
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
    // Add asset to watchlist
    addAsset(asset);
    // Update watchlist
    renderWatchlist();
    viewSwap('watchlist');
  });
  card.appendChild(addToWatchlistBtn);
  // Append the card to the container
  cryptoDataDiv.appendChild(card);
}
// Function to render the watchlist
function renderWatchlist() {
  // Get the watchlist container
  const watchlistDiv = document.getElementById('watchlist');
  // Clear the existing watchlist
  watchlistDiv.innerHTML = '';
  // Get the assets in the watchlist from local storage
  const watchlist = getWatchlist();
  // If the watchlist is empty - display a message
  if (watchlist.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Your watchlist is empty. \nAdd some crypto!';
    emptyMessage.classList.add('empty-message');
    watchlistDiv.appendChild(emptyMessage);
    return;
  }
  // Loop through each asset in the watchlist
  watchlist.forEach((asset) => {
    // Create the card div
    const card = document.createElement('div');
    card.classList.add('card');
    // Create a container for the icon and name
    const nameContainer = document.createElement('div');
    nameContainer.classList.add('name-container');
    // Asset Icon
    const iconElement = document.createElement('img');
    iconElement.classList.add('asset-icon');
    iconElement.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
    iconElement.alt = `${asset.name} icon`;
    // Asset Name
    const dataNameElement = document.createElement('h2');
    dataNameElement.classList.add('data-name');
    dataNameElement.textContent = asset.name;
    // Append icon and name to the container
    nameContainer.appendChild(iconElement);
    nameContainer.appendChild(dataNameElement);
    // Append the name container to the card
    card.appendChild(nameContainer);
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
    // Remove Button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove from Watchlist';
    removeButton.classList.add('remove-from-watchlist');
    removeButton.addEventListener('click', () => {
      // Remove the asset from the watchlist
      removeAsset(asset.symbol);
      // Re-render the watchlist after removal
      renderWatchlist();
    });
    card.appendChild(removeButton);
    // Append the card to the watchlist container
    watchlistDiv.appendChild(card);
  });
}
// Function to render the top 8 crypto assets dynamically in the dashboard view
function renderDashboard() {
  const dashContainer = document.querySelector('.dash');
  if (!dashContainer) {
    return;
  }
  dashContainer.innerHTML = '';
  if (!dashboardAssets || dashboardAssets.length === 0) {
    return;
  }
  dashboardAssets.forEach((asset) => {
    // Create dashboard card
    const card = document.createElement('div');
    card.classList.add('dashboard-card');
    // Name & Icon Container
    const nameContainer = document.createElement('div');
    nameContainer.classList.add('name-container');
    const iconElement = document.createElement('img');
    iconElement.classList.add('asset-icon');
    iconElement.src = `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`;
    iconElement.alt = `${asset.name} icon`;
    const dataNameElement = document.createElement('h2');
    dataNameElement.classList.add('data-name');
    dataNameElement.textContent = asset.name;
    nameContainer.appendChild(iconElement);
    nameContainer.appendChild(dataNameElement);
    card.appendChild(nameContainer);
    // Symbol
    const dataSymbolElement = document.createElement('p');
    dataSymbolElement.classList.add('data-symbol');
    dataSymbolElement.textContent = asset.symbol;
    card.appendChild(dataSymbolElement);
    // Price
    const dataPriceUsdElement = document.createElement('h1');
    dataPriceUsdElement.classList.add('data-priceUsd');
    dataPriceUsdElement.textContent = `$${Number(asset.priceUsd).toFixed(2)}`;
    card.appendChild(dataPriceUsdElement);
    // 24Hr Change
    const dataChangePercent24HrElement = document.createElement('p');
    dataChangePercent24HrElement.classList.add('data-changePercent24Hr');
    const changePercent = Number(asset.changePercent24Hr).toFixed(2);
    dataChangePercent24HrElement.textContent = `${changePercent}% (24Hr)`;
    if (asset.changePercent24Hr > 0) {
      dataChangePercent24HrElement.classList.add('positive');
    } else {
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
    dataMarketCapUsdElement.textContent = `$${(Number(asset.marketCapUsd) / 1_000_000_000).toFixed(2)} B`;
    card.appendChild(dataMarketCapUsdElement);
    // Add to Watchlist Button
    const addToWatchlistBtn = document.createElement('button');
    addToWatchlistBtn.textContent = 'Add to Watchlist';
    addToWatchlistBtn.classList.add('add-to-watchlist');
    addToWatchlistBtn.addEventListener('click', () => {
      addAsset(asset);
      renderWatchlist();
      viewSwap('watchlist');
    });
    card.appendChild(addToWatchlistBtn);
    // Append to Dashboard
    dashContainer.appendChild(card);
  });
}
// Call this function when the dashboard view loads
renderDashboard();
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
// Function to swap views
function viewSwap(viewName) {
  // Get all views
  const views = document.querySelectorAll('[data-view]');
  // Hide all views first
  views.forEach((view) => {
    view.classList.add('hidden');
  });
  // Show the selected view
  const activeView = document.querySelector(`[data-view="${viewName}"]`);
  if (activeView) {
    activeView.classList.remove('hidden');
  }
  // When switching to 'search' view - clear the search results and reset the input field
  if (viewName === 'search') {
    const cryptoDataDiv = document.getElementById('crypto-data');
    if (cryptoDataDiv) {
      cryptoDataDiv.innerHTML = '';
    }
    const searchInput = document.getElementById('symbol');
    if (searchInput) {
      searchInput.value = '';
    }
  }
  // If switching to the 'watchlist' view - populate the watchlist
  if (viewName === 'watchlist') {
    renderWatchlist();
  }
}
// Event listener for the "My Watchlist" button in the search view
const myWatchlistButton = document.querySelector('.watchlist-btn');
if (myWatchlistButton) {
  myWatchlistButton.addEventListener('click', (event) => {
    // Prevent the default anchor behavior
    event.preventDefault();
    // Switch to the watchlist view
    viewSwap('watchlist');
    // Populate the watchlist with the saved assets
    renderWatchlist();
  });
}
// Event listener for the "Add" button in the watchlist view
const addButton = document.querySelector('.add-btn');
if (addButton) {
  addButton.addEventListener('click', (event) => {
    event.preventDefault();
    viewSwap('search');
    // Clear any previous search results in the search view
    const cryptoDataDiv = document.getElementById('crypto-data');
    if (cryptoDataDiv) {
      cryptoDataDiv.innerHTML = '';
    }
    // Clear the search input field
    const searchInput = document.getElementById('symbol');
    if (searchInput) {
      searchInput.value = '';
    }
  });
}
// Event listener for the navbar links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = event.target;
    if (target) {
      const targetView = target.getAttribute('href')?.substring(1);
      if (targetView) {
        viewSwap(targetView);
      }
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // Set the initial view to the watchlist view
  viewSwap('watchlist');
});
