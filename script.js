// Helper function to fetch and process SEC data
async function fetchAndProcessData(cik) {
  // Use SEC recommended User-Agent
  const userAgent = 'ExampleApp/1.0 (email@example.com)';
  const url = `https://data.sec.gov/api/xbrl/companyconcept/CIK${cik}/dei/EntityCommonStockSharesOutstanding.json`;

  // Use proxy (AIPipe as example)
  // AIPipe: https://aipipe.org/#simple-proxy
  // We will prepend the SEC URL with AIPipe proxy
  const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);

  try {
    const response = await fetch(proxyUrl, { headers: { 'User-Agent': userAgent } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Extract entityName
    const entityName = data.entityName || 'Unknown';

    // Extract shares from units.shares[] with fy > '2020' and numeric val
    const shares = data.units && data.units.shares ? data.units.shares : [];
    const filteredShares = shares.filter(s => {
      // Validate fy format and val is number
      return s.fy && s.fy > '2020' && (typeof s.val === 'number') && !isNaN(s.val);
    });

    if (filteredShares.length === 0) {
      throw new Error('No share data after filtering for fy>2020 and numeric val');
    }

    // Find max and min by val
    const maxEntry = filteredShares.reduce((max, current) => current.val >= max.val ? current : max);
    const minEntry = filteredShares.reduce((min, current) => current.val <= min.val ? current : min);

    return {
      entityName,
      max: { val: maxEntry.val, fy: maxEntry.fy },
      min: { val: minEntry.val, fy: minEntry.fy }
    };
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    return null;
  }
}

function updatePageData(data) {
  if (!data) return;

  // Update title and h1
  document.title = `${data.entityName} (Shares Outstanding)`;
  document.getElementById('share-entity-name').textContent = data.entityName;

  // Update max
  document.getElementById('share-max-value').textContent = data.max.val.toLocaleString();
  document.getElementById('share-max-fy').textContent = data.max.fy;

  // Update min
  document.getElementById('share-min-value').textContent = data.min.val.toLocaleString();
  document.getElementById('share-min-fy').textContent = data.min.fy;
}

// On page load
window.addEventListener('DOMContentLoaded', async () => {
  const defaultCIK = '0000318154';

  // Parse CIK from URL query string if provided and valid (10 digits)
  const urlParams = new URLSearchParams(window.location.search);
  const queryCIK = urlParams.get('CIK');
  let cik = defaultCIK;
  if (queryCIK && /^\d{10}$/.test(queryCIK)) {
    cik = queryCIK;
  }

  const data = await fetchAndProcessData(cik);

  if (data) {
    updatePageData(data);
  } else if (cik !== defaultCIK) {
    // If custom CIK fetch failed, fallback to default
    const fallbackData = await fetchAndProcessData(defaultCIK);
    updatePageData(fallbackData);
  }
});