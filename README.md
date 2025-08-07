# eslint-plugin-tanstack-query-options

An ESLint plugin for [TanStack Query](https://tanstack.com/query) v5+ to enforce structured and reusable query definitions via `queryOptions`.

[link-npm]: https://www.npmjs.com/package/eslint-plugin-tanstack-query-options 'npm'

[![license](https://img.shields.io/npm/l/eslint-plugin-tanstack-query-options)][link-npm]
[![npm version](https://img.shields.io/npm/v/eslint-plugin-tanstack-query-options)][link-npm]
[![downloads per week](https://img.shields.io/npm/dw/eslint-plugin-tanstack-query-options)][link-npm]
[![last updated](https://img.shields.io/npm/last-update/eslint-plugin-tanstack-query-options)][link-npm]

## 🤔 Why This Plugin?

While TanStack Query is incredibly powerful, managing queryKey and queryFn across a large application can become challenging. Keys can become scattered, logic duplicated, and refactoring can be difficult.

TanStack Query v5 introduced the queryOptions helper to solve these problems by encouraging the colocation of query logic. This plugin enforces the best practices around queryOptions to ensure your codebase stays scalable and easy to read.

Key benefits include:

- Centralize your query definitions.
- Define options once and reuse them everywhere.
- Separated options are easier to unit test.
- Keep your data-fetching layer structured and predictable.

## 💿 Installation

```sh
# ✨ Auto-detect
npx nypm install -D eslint eslint-plugin-tanstack-query-options
```

```shell
# npm
npm install -D eslint eslint-plugin-tanstack-query-options
```

```shell
# yarn
yarn add -D eslint eslint-plugin-tanstack-query-options
```

```shell
# pnpm
pnpm install -D eslint eslint-plugin-tanstack-query-options
```

```shell
# bun
bun install -D eslint eslint-plugin-tanstack-query-options
```

```sh
# deno
deno install --dev eslint eslint-plugin-tanstack-query-options
```

## ⚙️ Configuration

### New Config ( `eslint.config.js` )

Use `eslint.config.js` file to configure rules.  
See also: https://eslint.org/docs/latest/use/configure/configuration-files-new.

Example **eslint.config.js**:

```js
import tanstackQueryOptionsPlugin from 'eslint-plugin-tanstack-query-options';

export default [
    ...tanstackQueryOptionsPlugin.configs.recommended,
    {
        'tanstack-query-options/no-hardcoded-query-key': 'error',
    },
];
```

This plugin provides configs:

- `*.configs.recommended` 
- `*.configs.all`

### Legacy Config ( `.eslintrc` )

Use `.eslintrc.*` file to configure rules.  
See also: https://eslint.org/docs/latest/use/configure.

Example **.eslintrc.js**:

```js
module.exports = {
    extends: [
        'plugin:tanstack-query-options/recommended',
    ],
    rules: {
        'tanstack-query-options/no-hardcoded-query-key': 'error',
    },
};
```

This plugin provides configs:

- `plugin:tanstack-query-options/recommended`
- `plugin:tanstack-query-options/all`

### Manual Configuration

If you prefer to configure rules individually, you can create your own configuration object.

Example **eslint.config.js**:

```js
import tanstackQueryOptionsPlugin from 'eslint-plugin-tanstack-query-options';

export default [
    {
        plugins: {
            'tanstack-query-options': tanstackQueryOptionsPlugin,
        },
        rules: {
            'tanstack-query-options/no-loose-query-key': 'error',
            'tanstack-query-options/no-hardcoded-query-key': 'warn',
        },
    },
];
```

## ✅ Rules

The rules with the following star ⭐ are included in the recommended configs.

### `no-loose-query-key` ⭐

**Ensures query options are defined as stable, reusable variables.**

This rule enforces the core principle of colocating all query-related logic.  
Defining `queryKey` in a raw object passed to `useQuery` is a legacy pattern that `queryOptions` is designed to replace.

#### 👎 Incorrect code for this rule:

```js
/* eslint tanstack-query-options/no-loose-query-key: "error" */

import { useQuery } from '@tanstack/react-query';

function Todos() {
    const query = useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
    });
}
```

#### 👍 Correct code for this rule:

```js
/* eslint tanstack-query-options/no-loose-query-key: "error" */

import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '@tanstack/react-query';

function Todos() {
    const query = useQuery(
        queryOptions({
            queryKey: ['todos'],
            queryFn: fetchTodos,
        }),
    );
}
```

### `no-inline-query-options` ⭐

**Enforces that `queryOptions` is not called directly inside query hooks.**

This rule enforces the practice of defining `queryOptions` as standalone variables to improve code reusability.

#### 👎 Incorrect code for this rule:

```js
/* eslint tanstack-query-options/no-loose-query-key: "error" */

import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '@tanstack/react-query';

function Todos() {
    const query = useQuery(
        queryOptions({
            queryKey: ['todos'],
            queryFn: fetchTodos,
        }),
    );
}
```

#### 👍 Correct code for this rule:

```js
/* eslint tanstack-query-options/no-loose-query-key: "error" */

import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '@tanstack/react-query';

const todosOptions = queryOptions({
    queryKey: ['todos'],
    queryFn: fetchTodos,
});

function Todos() {
    const query = useQuery(todosOptions);
}
```

### `no-hardcoded-query-key`

**Discourages the use of hardcoded string or number literals in queryKeys.**

Using magic strings for query keys makes them prone to typos and challenging to manage.  
This rule encourages the use of centralized key factories for better type safety, discoverability, and refactoring.

#### 👎 Incorrect code for this rule:

```js
import { queryOptions } from '@tanstack/react-query';

const todoOptions = (id) =>
  queryOptions({
    queryKey: ['todos', 'detail', id],
    queryFn: () => fetchTodoById(id),
  });
```

#### 👍 Correct code for this rule:

```js
// src/lib/query-keys.js
export const todoQueryKeys = {
    list: () => ['todos'],
    detail: (id) => ['todos', 'detail', id],
};
```

```js
import { queryOptions } from '@tanstack/react-query';
import { todoQueryKeys } from '../lib/query-key';

const todoOptions = (id) =>
  queryOptions({
    queryKey: todoQueryKeys.detail(id),
    queryFn: () => fetchTodoById(id),
  });
```

## 🔒 License

MIT
