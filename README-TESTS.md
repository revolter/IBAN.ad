# IBAN.ad Testing Suite

This repository includes comprehensive end-to-end tests using Playwright to ensure the multi-currency IBAN functionality works correctly across different browsers and devices.

## Test Coverage

The test suite covers:

### Core Functionality
- **Basic IBAN field operations** (input, validation, copy)
- **Multi-currency row creation** and management
- **Button visibility logic** and state management
- **Copy functionality** for single and multi-currency rows
- **Delete functionality** for removing unwanted rows

### Advanced Features
- **Sequential progression** enforcement (completing rows in order)
- **Permalink generation** and restoration from URLs
- **Language switching** (English/Romanian)
- **Form reset** functionality
- **Responsive design** on mobile and tablet devices

### Edge Cases
- **Long IBAN values** and special characters
- **Rapid user interactions** and state changes
- **Browser navigation** (back/forward)
- **Clipboard permission** handling
- **Window resize** events
- **Malformed URL parameters**

### Accessibility
- **Screen reader compatibility**
- **Keyboard navigation**
- **ARIA labels** and semantic HTML
- **Focus management**
- **High contrast** support

## Running Tests

### Prerequisites
```bash
npm install
npx playwright install
```

### Running All Tests
```bash
npm test
```

### Running Tests in Headed Mode (with visible browser)
```bash
npm run test:headed
```

### Running Tests with UI Mode (interactive)
```bash
npm run test:ui
```

### Running Tests in Debug Mode
```bash
npm run test:debug
```

### Running Specific Test Files
```bash
npx playwright test basic-functionality.spec.ts
npx playwright test multi-currency.spec.ts
npx playwright test permalink.spec.ts
```

### Running Tests in Specific Browsers
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Files

- `basic-functionality.spec.ts` - Core IBAN field functionality
- `multi-currency.spec.ts` - Multi-currency row management
- `permalink.spec.ts` - URL parameter handling and restoration
- `accessibility.spec.ts` - Language switching and accessibility features
- `button-behavior.spec.ts` - Button visibility and interaction logic
- `edge-cases.spec.ts` - Edge cases, responsive design, and error handling
- `smoke.spec.ts` - Basic smoke tests for quick validation

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

- Runs tests on every push and pull request
- Tests on multiple browsers (Chromium, Firefox, WebKit)
- Generates test reports and artifacts
- Provides faster feedback with Chromium-only tests for PRs
- Runs full cross-browser tests on main branch pushes

## Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- **Cross-browser testing** (Chrome, Firefox, Safari)
- **Mobile device testing** (Pixel 5, iPhone 12)
- **Automatic retries** on CI failures
- **Screenshot capture** on test failures
- **HTML report generation**
- **File:// protocol support** for local HTML testing

## Key Testing Strategies

### State Management Testing
Tests ensure that button visibility, form state, and row management work correctly across all user interactions.

### Sequential Progression Testing
Validates that users must complete rows in order before adding new ones, maintaining data integrity.

### Permalink Testing
Comprehensive testing of URL parameter generation and restoration, ensuring bookmarkable links work reliably.

### Responsive Testing
Tests across different viewport sizes to ensure the application works on mobile devices and tablets.

### Accessibility Testing
Validates screen reader compatibility, keyboard navigation, and proper semantic HTML structure.

## Troubleshooting

### Browser Installation Issues
If Playwright browser installation fails:
```bash
npx playwright install --force
```

### Running Tests Locally
For local development, tests use the `file://` protocol to load the HTML directly without requiring a web server.

### Debugging Test Failures
Use the debug mode to step through tests:
```bash
npx playwright test --debug
```

Or run with the UI mode for interactive debugging:
```bash
npx playwright test --ui
```