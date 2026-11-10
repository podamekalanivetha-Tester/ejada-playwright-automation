# EJADA – Senior Automation Tester Playwright Assignment

A TypeScript + Playwright framework covering SauceDemo UI automation and the Simple Books API.

## Prerequisites

- Node.js LTS (npm included)
- Visual Studio Code
- Git
- Internet access to SauceDemo and Simple Books API

## Setup

```bash
npm install
npx playwright install chromium firefox
```

Optional: copy `.env.example` to `.env` and update values if required. The defaults use the public SauceDemo test account and public Simple Books API.

## Run tests

```bash
# All UI and API tests across configured browsers
npm test

# UI only / API only
npm run test:ui
npm run test:api

# One browser
npm run test:chromium
npm run test:firefox

# Open browser visibly
npm run test:headed
```

The Playwright configuration enables parallel execution. API tests are serial because they create a client, obtain a token, create an order, update it, and then delete it.

## Reports

After a run:

```bash
npx playwright show-report
```

Allure results are written to `allure-results`. Generate and open an Allure report:

```bash
npm run report
```

## Project structure

```text
EJADA_Playwright_Automation_Framework/
├── src/
│   ├── config/
│   │   └── env.ts
│   └── pages/
│       ├── LoginPage.ts
│       ├── InventoryPage.ts
│       ├── CartPage.ts
│       └── CheckoutPage.ts
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts
│   │   └── order.spec.ts
│   └── api/
│       └── simple-books.spec.ts
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Coverage

### UI – SauceDemo
- Successful login
- Invalid username
- Invalid password
- Locked-out user
- Empty credentials
- Add one product to cart and complete checkout

### API – Simple Books
- GET available books
- POST API client registration and token acquisition
- POST order with bearer token
- GET order
- PATCH order customer name
- DELETE order
- GET deleted order to verify 404

## Design notes

- Page Object Model keeps selectors and page actions out of test cases.
- Environment values are centralized in `src/config/env.ts`.
- Chromium and Firefox are configured as separate Playwright projects.
- `fullyParallel: true` enables parallel test execution. API lifecycle tests are grouped with `serial` mode because later steps depend on earlier created resources.
- Screenshots, videos, and traces are retained on failure.
- Both Playwright HTML and Allure reporters are configured.

## Important assignment notes

1. The Simple Books API is a shared public demo service. Do not use real personal information.
2. The API lifecycle is stateful. Do not run the serial API test file with `--grep` that skips its setup tests.
3. Confirm the API's current behavior and status codes against the linked API documentation if the demo service changes.
4. Before submission, run the full suite locally and commit the generated source files only (not `node_modules`, reports, or test results).
5. This is a starter submission framework. Review and understand each file, run it, and be ready to explain the architecture and assertions during an interview.

## GitHub submission

```bash
git init
git add .
git commit -m "Add EJADA Playwright UI and API automation framework"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own GitHub repository URL.
