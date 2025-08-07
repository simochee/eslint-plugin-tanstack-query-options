import { ESLintUtils } from '@typescript-eslint/utils'
import { createRule } from '../utils'

type MessageId = 'NoLooseQueryKey'

type Options = [
    { allowQueryFilters: boolean }
]

export const noLooseQueryKey = createRule<Options, MessageId>({
    name: 'no-loose-query-key',
    create: (context) => {
        const { allowQueryFilters } = context.options[0] || {}
        const services = ESLintUtils.getParserServices(context);
        const checker = services.program.getTypeChecker()

        return {
            CallExpression(node) {
                const methodName = node.callee.type === 'Identifier' ? node.callee.name : node.callee.type === 'MemberExpression' ? node.callee.property.type === 'Identifier' ? node.callee.property.name : node.callee.property.type === "Literal" ? node.callee.property.value : null : null

                if (!methodName) {
                    return
                }

                const calleeNode = services.esTreeNodeToTSNodeMap.get(node);
                const signature = checker.getResolvedSignature(calleeNode);

                if (!signature) {
                    return;
                }

                const calleeType = checker.getTypeAtLocation(calleeNode);

                const parameters = signature.getParameters();

                // queryKey を直接引数に取るメソッドのチェック
                node.arguments.forEach((argument, index) => {
                    const parameter = parameters[index];

                    if (!parameter) {
                        return;
                    }

                   // queryKey を直接引数に取るとき、配列が指定されていたらエラー
                    if (parameter.name === 'queryKey' && argument.type === 'ArrayExpression') {

                        switch (methodName) {
                            case 'getQueryData':
                            case 'setQueryData':
                            case 'getQueryState':{
                                context.report({
                                    node: argument,
                                    messageId: 'NoLooseQueryKey'
                                })
                                break;
                            }
                            // Query Filters
                            case 'getQueryDefaults':
                            case 'setQueryDefaults': {
                                if (!allowQueryFilters) {
                                    context.report({
                                        node: argument,
                                        messageId: 'NoLooseQueryKey'
                                    })
                                    break;
                                }
                            }
                        }
                    }

                    if (argument.type !== 'ObjectExpression' || argument.properties.every((property) => property.type !== 'Property' || property.key.type !== 'Identifier' || property.key.name !== 'queryKey')) {
                        return
                    }

                    // Query Options が必須の引数のチェック
                    switch (methodName) {
                        // Hooks
                        case 'useQuery':
                        case 'useSuspenseQuery':
                        case 'useInfiniteQuery':
                        case 'useSuspenseInfiniteQuery':
                        case 'usePrefetchQuery':
                        case 'usePrefetchInfiniteQuery':
                        case 'useIsFetching':
                        // QueryClient Methods
                        case 'fetchQuery':
                        case 'fetchInfiniteQuery':
                        case 'prefetchQuery':
                        case 'prefetchInfiniteQuery':
                        case 'ensureQueryData':
                        case 'ensureInfiniteQuery':
                        {
                            context.report({
                                node: argument,
                                messageId: 'NoLooseQueryKey'
                            })
                            break;
                        }

                        // Query Filters
                        case 'getQueriesData':
                        case 'setQueriesData':
                        case 'invalidateQueries':
                        case 'refreshQueries':
                        case 'cancelQueries':
                        case 'removeQueries':
                        case 'resetQueries':
                        case 'isFetching': {
                            if (!allowQueryFilters) {
                                context.report({
                                    node: argument,
                                    messageId: 'NoLooseQueryKey'
                                })
                                break;
                            }
                        }
                    }
                });
            }
        }
    },
    meta: {
        docs: {
            description: 'Ensures query options are defined as stable, reusable variables.'
        },
        messages: {
            NoLooseQueryKey: 'Query options should be wrapped in `queryOptions`.',
        },
        type: 'problem',
        schema: [
            {
                type: 'object',
                properties: {
                    allowQueryFilters: {
                        type: 'boolean',
                    }
                }
            }
        ],
    },
    defaultOptions: [
        { allowQueryFilters: false },
    ],
})