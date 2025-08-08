import { fileURLToPath } from 'node:url';
import { RuleTester } from '@typescript-eslint/rule-tester'
import { noInlineQueryOptions as rule } from "./no-inline-query-options";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            projectService: {
                allowDefaultProject: ['*.ts*']
            },
            tsconfigRootDir: fileURLToPath(import.meta.url),
        }
    }
})

const valid = [
    `
        import { queryOptions } from '@tanstack/react-query';
        
        queryOptions({ queryKey: ['todos', 1] })
        `,
    `
        import { useQuery, queryOptions } from '@tanstack/react-query';
        
        const todosOptions = queryOptions({ queryKey: ['todos'] });
        `,
    `
        import { queryOptions } from '@tanstack/react-query';
        
        const queries = {
          todos: queryOptions({ queryKey: ['todos', 1] }),
          }
        `,
    `
        import { QueryClient, queryOptions } from '@tanstack/react-query';

        declare const queryClient: QueryClient;
        const todoOptions = (id: number) => queryOptions(queryOptions({ queryKey: ['todo', id] }))
        queryClient.setQueryData(todoOptions(1).queryKey, () => 1);
        `,
]

const invalid = [
    `
        import { useQuery, queryOptions } from '@tanstack/react-query';
        
        useQuery(queryOptions({ queryKey: ['todos', 1] }));
        `,
    `
        import { QueryClient, queryOptions } from '@tanstack/react-query';

　　　　　const Todo = () => { useQuery(queryOptions({ queryKey: ['todos', 1] })) };
        `,
    `
        import { QueryClient, queryOptions } from '@tanstack/react-query';

　　　　　function Todo() { useQuery(queryOptions({ queryKey: ['todos', 1] })) };
        `,
]

ruleTester.run('no-inline-query-options', rule, {
    // valid: valid,
    valid: [
        ...valid.map((code) => ({ code })),
    ],
    invalid: [
        ...invalid.map((code) => ({code, errors:[{messageId: 'NoInlineQueryOptions'}] as const})),
    ]
})