# IBAN Advertiser

The easiest way for NGOs, freelancers, and clubs to share their bank details for donations, payments, or memberships.

## Features

- 🌓 **Dark Mode Support**: Automatic system preference detection with manual toggle
- 🌍 **Multi-language**: Support for English and Romanian 
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔗 **Shareable Links**: Generate links to share your IBAN information
- 📋 **One-click Copy**: Copy any field to clipboard with visual feedback
- ♿ **Accessible**: Full keyboard navigation and screen reader support

## Development

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling with a build process that generates optimized CSS.

### Prerequisites

- Node.js 18+ 
- npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build CSS (watch mode for development):
```bash
npm run build-css
```

3. Build CSS for production (minified):
```bash
npm run build-css:prod
```

4. Serve the site locally for testing:
```bash
cd docs && python3 -m http.server 8000
```

### Project Structure

```
├── src/
│   └── styles.css          # Tailwind CSS source file
├── docs/
│   ├── index.html          # Main HTML file
│   └── styles.css          # Generated CSS file (do not edit)
├── package.json            # Dependencies and build scripts
├── tailwind.config.js      # Tailwind configuration
└── .github/workflows/      # GitHub Actions for deployment
```

### Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The GitHub Actions workflow builds the CSS and deploys the site.

## License

MIT License - see [LICENSE](LICENSE) file for details.