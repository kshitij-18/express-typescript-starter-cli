# Express TypeScript Starter

A CLI tool to quickly create Express.js projects with TypeScript, ESLint, Prettier, and other modern development tools.

# package status
[![Publish Package Pipeline](https://github.com/kshitij-18/express-typescript-starter-cli/actions/workflows/publish.yml/badge.svg)](https://github.com/kshitij-18/express-typescript-starter-cli/actions/workflows/publish.yml)

## NPM Package Link
https://www.npmjs.com/package/@kshitij05/express-typescript-starter

## Installation

```bash
npx @kshitij05/express-typescript-starter
```

## Usage

```bash
# Create a new Express TypeScript project
npx @kshitij05/express-typescript-starter create

# Or run the interactive CLI
npx @kshitij05/express-typescript-starter
```

## Features

- 🚀 Express.js with TypeScript setup
- 📦 Package manager selection (npm, yarn, pnpm)
- 🗄️ Database integration options (MongoDB, MySQL, PostgreSQL)
- 🧪 Testing framework setup
- 🐳 Docker configuration
- 📝 ESLint and Prettier configuration
- 🔧 Git initialization

## What's Included

- Express.js server setup
- TypeScript configuration
- ESLint and Prettier setup
- Database connection setup (optional)
- Testing framework (optional)
- Docker configuration (optional)
- Git initialization (optional)

## Development

```bash
# Install dependencies
yarn install

# Run in development mode
yarn dev

# Build the project
yarn build

# Run the CLI locally
yarn start create
```

## GitHub Actions Setup

This project includes automated CI/CD pipelines that publish to npm when you push to the `develop` branch.

### Prerequisites

1. **NPM Token**: Create an NPM access token
   - Go to [npmjs.com](https://www.npmjs.com) → Account Settings → Access Tokens
   - Create a new token with "Automation" type
   - Copy the token

2. **GitHub Secrets**: Add the NPM token to your repository
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Create a new secret named `NPM_TOKEN`
   - Paste your NPM access token

### How it works

- **On push to `develop`**: 
  - Runs linting and type checking
  - Builds the project
  - Publishes to npm

## License

MIT
