# no-inline-query-options

> Enforces that `queryOptions` is not called directly inside query hooks.

- ⚙️This rule is included in `"plugin:tanstack-query-options/recommended"`.

## 📖 Rule Details

This rule enforces the practice of defining `queryOptions` as standalone variables to improve code reusability.

**👎 Incorrect code for this rule:**

```js
/* eslint tanstack-query-options/no-inline-query-options: "error" */

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

**👍 Correct code for this rule:**

```js
/* eslint tanstack-query-options/no-inline-query-options: "error" */

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

## 🔧 Options

Noting.

## 🔍 Implementation

- [Rule source](./no-inline-query-options.ts)
- [Test source](./no-inline-query-options.test.ts)
