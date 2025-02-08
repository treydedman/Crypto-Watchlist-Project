// Interface for crypto Asset
interface Asset {
  name: string;
  symbol: string;
  priceUsd: number;
  changePercent24Hr: number;
  marketCapUsd: number;
}

// Load data first
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Ensure data.assets is always an array
  if (!Array.isArray(data.assets)) {
    data.assets = [];
  }
});

// Query the DOM elements
const searchInput = document.getElementById('symbol') as HTMLInputElement;
const searchButton = document.getElementById(
  'searchButton',
) as HTMLButtonElement;
const cryptoDataDiv = document.getElementById('crypto-data') as HTMLDivElement;

// Function to fetch crypto data by name and set it to lower case for API requirements
const apiUrl = 'https://api.coincap.io/v2/assets';

async function fetchCryptoData(name: string): Promise<Asset | null> {
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

// Function to get the current watchlist
function getWatchlist(): Asset[] {
  return data.assets;
}

// Function to add an asset to the watchlist and store it in localStorage
function addAsset(asset: Asset): void {
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
function removeAsset(symbol: string): void {
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
function renderAsset(asset: Asset): void {
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
function renderWatchlist(): void {
  // Get the watchlist container
  const watchlistDiv = document.getElementById('watchlist') as HTMLDivElement;

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
function viewSwap(viewName: string): void {
  // Get all views
  const views = document.querySelectorAll(
    '[data-view]',
  ) as NodeListOf<HTMLElement>;

  // Hide all views first
  views.forEach((view) => {
    view.classList.add('hidden');
  });

  // Show the selected view
  const activeView = document.querySelector(
    `[data-view="${viewName}"]`,
  ) as HTMLElement;
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  // When switching to 'search' view - clear the search results and reset the input field
  if (viewName === 'search') {
    const cryptoDataDiv = document.getElementById(
      'crypto-data',
    ) as HTMLDivElement;
    if (cryptoDataDiv) {
      cryptoDataDiv.innerHTML = '';
    }

    const searchInput = document.getElementById('symbol') as HTMLInputElement;
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
const myWatchlistButton = document.querySelector(
  '.watchlist-btn',
) as HTMLAnchorElement;
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
const addButton = document.querySelector('.add-btn') as HTMLAnchorElement;
if (addButton) {
  addButton.addEventListener('click', (event) => {
    event.preventDefault();
    viewSwap('search');

    // Clear any previous search results in the search view
    const cryptoDataDiv = document.getElementById(
      'crypto-data',
    ) as HTMLDivElement;
    if (cryptoDataDiv) {
      cryptoDataDiv.innerHTML = '';
    }

    // Clear the search input field
    const searchInput = document.getElementById('symbol') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  });
}

// Event listener for the navbar links
const navLinks = document.querySelectorAll(
  '.nav-link',
) as NodeListOf<HTMLAnchorElement>;
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = event.target as HTMLAnchorElement;
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
