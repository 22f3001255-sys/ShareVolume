# Minimal Static Web App for Amgen Shares Outstanding

This static web application fetches and displays the maximum and minimum common stock shares outstanding for a company, by default Amgen (CIK 0000318154).

## Features

- Fetches official SEC data from the SEC API endpoint.
- Filters share data for fiscal years after 2020.
- Displays entity name in the title and heading.
- Shows max and min shares outstanding and their fiscal years.
- Supports dynamic update for any 10-digit CIK passed in the URL query string, e.g., `?CIK=0001018724`.
- Uses a proxy to avoid CORS issues and sets a descriptive User-Agent header.

## Files

- `index.html` - Main HTML file containing markup and linking scripts and styles.
- `style.css` - Styling for a clean and readable interface.
- `script.js` - JavaScript file handling fetching and dynamic content updates.
- `data.json` - Example JSON data for Amgen's shares outstanding.
- `uid.txt` - Provided UID text file (content unchanged).

## Usage

1. Open `index.html` in any modern browser.
2. To view data for a different company by CIK, append `?CIK=xxxxxxxxxx` to the URL, where `xxxxxxxxxx` is the 10-digit CIK.

Example:
shell
file:///path/to/index.html?CIK=0001018724


## Development

No build tools or servers are required. The application runs purely static.

## Notes

- The SEC data is fetched through a CORS proxy to allow browser access.
- User-Agent header follows SEC guidance for descriptive user agents.

## License

This application is licensed under the MIT License. See the LICENSE file for details.