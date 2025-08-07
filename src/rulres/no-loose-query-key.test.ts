import { fileURLToPath } from 'node:url';
import { RuleTester } from '@typescript-eslint/rule-tester'
import { noLooseQueryKey as rule } from "./no-loose-query-key";

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

const validQueryOptions = [
    `
        import { useQuery, queryOptions } from '@tanstack/react-query';
        
        useQuery(queryOptions({ queryKey: ['todos', 1] }));
        `,
    `
        import { queryOptions } from '@tanstack/react-query';
        
        queryOptions({ queryKey: ['todos', 1] });
        `,
    `
        import { QueryClient, queryOptions } from '@tanstack/react-query';

        declare const queryClient: QueryClient;
        queryClient.setQueryData(queryOptions({ queryKey: ['todo', id] }).queryKey, () => 1);
        `,
]

const validQueryFilters = [
    `
        import { QueryClient, queryOptions } from '@tanstack/react-query';
        
        declare const queryClient: QueryClient;
        queryClient.invalidateQueries(queryOptions({ queryKey: ['todos', id] }));
        `,
];

const invalidQueryOptions = [
    `
        import { useQuery } from '@tanstack/react-query';
        
        useQuery({ queryKey: ['todos', 1] });
        `,
    `
        import { QueryClient, queryOptions } from '@tanstack/react-query';

        declare const queryClient: QueryClient;
        queryClient.setQueryData(['todo', id], () => 1);
        `,
]

const invalidQueryFilters = [
    `
        import { QueryClient } from '@tanstack/react-query';
        
        declare const queryClient: QueryClient;
        queryClient.invalidateQueries({ queryKey: ['todos', id] });
        `,
]

ruleTester.run('no-loose-query-key', rule, {
    // valid: valid,
    valid: [
        ...validQueryOptions.map((code) => ({ code, options: [{ allowQueryFilters: true }] as const})),
        ...validQueryOptions.map((code) => ({ code, options: [{ allowQueryFilters: false }] as const})),
        ...validQueryFilters.map((code) => ({ code, options: [{ allowQueryFilters: true }] as const})),
        ...validQueryFilters.map((code) => ({ code, options: [{ allowQueryFilters: false }] as const})),
        ...invalidQueryFilters.map((code) => ({code,options:[{allowQueryFilters: true}] as const, errors:[{messageId: 'NoLooseQueryKey'}] as const})),
    ],
    invalid: [
        ...invalidQueryFilters.map((code) => ({code,options:[{allowQueryFilters: false}] as const, errors:[{messageId: 'NoLooseQueryKey'}] as const})),
        ...invalidQueryOptions.map((code) => ({code,options:[{allowQueryFilters: true}] as const,errors:[{messageId: 'NoLooseQueryKey'}] as const})),
        ...invalidQueryOptions.map((code) => ({code,options:[{allowQueryFilters: false}] as const,errors:[{messageId: 'NoLooseQueryKey'}] as const})),
    ]
})