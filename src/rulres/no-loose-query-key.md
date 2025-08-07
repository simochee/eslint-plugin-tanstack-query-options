# no-loose-query-key

> Ensures query options are defined as stable, reusable variables.

- ⚙️This rule is included in `"plugin:tanstack-query-options/recommended"`.

## 📖 Rule Details

This rule enforces the core principle of colocating all query-related logic.  
Defining `queryKey` in a raw object passed to `useQuery` is a legacy pattern that `queryOptions` is designed to replace.

**👎 Incorrect code for this rule:**

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

**👍 Correct code for this rule:**

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

## 🔧 Options

```json
{
  "tanstack-query-options/no-loose-query-key": [
    "error",
    {
      "allowQueryFilter": true
    }
  ]
}
```

## 🔍 Implementation

- [Rule source](./no-loose-query-key.ts)
- [Test source](./no-loose-query-key.test.ts)
