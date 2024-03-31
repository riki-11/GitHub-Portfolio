# UnboundMNL - Problem Area #2
This project contains the frontend for the UnboundMNL Problem Area #2.
It is a Vue 3 application built with Vite.
The project presents a simple loan management system.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Recommended: Install [Yarn Berry](https://yarnpkg.com/getting-started/install)
1. Install Node.js 14+
2. Open a terminal on your user directory.
3. Run `corepack enable`
4. Run `yarn set version stable`

## Environment Variables
Duplicate `.env.example` and rename it to `.env`.
### `VITE_API_URL`
The API URL to use for the application, defaults to `http://localhost:3000`.
This is the URL where the backend is running.

## Optional Development Stuff
### [Prettier](https://prettier.io/) for Code Formatting
You can install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension (for VSCode).
Other editors have their own extensions as well.
Rules are already set in `.prettierrc.json`.

### [ESLint](https://eslint.org/) for Code Linting
You can install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension (for VSCode).
Other editors have their own extensions as well.
Rules are already set in `.eslintrc.js`.

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Compile and Minify for Production

```sh
yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
