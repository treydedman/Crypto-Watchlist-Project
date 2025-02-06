// Interface for crypto Asset
interface Asset {
  name: string;
  symbol: string;
  priceUsd: number;
  changePercent24Hr: number;
  marketCapUsd: number;
}

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
      // Clear any previous data in the cryptoDataDiv
      cryptoDataDiv.innerHTML = '';

      // Dynamically create and append elements for the asset data
      const dataNameElement = document.createElement('h2');
      dataNameElement.classList.add('data-name');
      dataNameElement.textContent = asset.name;
      cryptoDataDiv.appendChild(dataNameElement);

      const dataSymbolElement = document.createElement('p');
      dataSymbolElement.classList.add('data-symbol');
      dataSymbolElement.textContent = asset.symbol;
      cryptoDataDiv.appendChild(dataSymbolElement);

      const dataPriceUsdElement = document.createElement('h1');
      dataPriceUsdElement.classList.add('data-priceUsd');
      dataPriceUsdElement.textContent = `$${asset.priceUsd.toFixed(2)}`;
      cryptoDataDiv.appendChild(dataPriceUsdElement);

      const dataChangePercent24HrElement = document.createElement('p');
      dataChangePercent24HrElement.classList.add('data-changePercent24Hr');

      // Check if changePercent24Hr is positive or negative
      if (asset.changePercent24Hr > 0) {
        dataChangePercent24HrElement.textContent = `+${asset.changePercent24Hr.toFixed(2)}% (24Hr)`;
        dataChangePercent24HrElement.classList.add('positive'); // Add class for positive change
      } else {
        dataChangePercent24HrElement.textContent = `${asset.changePercent24Hr.toFixed(2)}% (24Hr)`;
        dataChangePercent24HrElement.classList.add('negative'); // Add class for negative change
      }

      cryptoDataDiv.appendChild(dataChangePercent24HrElement);

      const marketCapLabelElement = document.createElement('h3');
      marketCapLabelElement.classList.add('market-cap');
      marketCapLabelElement.textContent = 'Market Cap';
      cryptoDataDiv.appendChild(marketCapLabelElement);

      const dataMarketCapUsdElement = document.createElement('h2');
      dataMarketCapUsdElement.classList.add('data-marketCapUsd');
      dataMarketCapUsdElement.textContent = `$${(asset.marketCapUsd / 1_000_000_000).toFixed(2)} B`;
      cryptoDataDiv.appendChild(dataMarketCapUsdElement);

      // Dynamically create Add to Watchlist button
      // const addToWatchlistBtn = document.createElement('button');
      // addToWatchlistBtn.textContent = 'Add to Watchlist';
      // addToWatchlistBtn.classList.add('add-to-watchlist');
      // addToWatchlistBtn.addEventListener('click', () => {
      //   alert(`${asset.name} has been added to your watchlist!`);
      // });
      // cryptoDataDiv.appendChild(addToWatchlistBtn);

      // Show the cryptoDataDiv after adding data
      cryptoDataDiv.style.display = 'block';
    } else {
      console.log('No asset found for the given name');
      alert('Crypto name not found or invalid.');
    }
  } else {
    alert('Please enter a valid crypto name.');
  }

  // Clear the input field after search
  searchInput.value = '';
});
