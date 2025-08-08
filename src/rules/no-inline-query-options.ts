import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { createRule } from '../utils'

type MessageId = 'NoInlineQueryOptions'

type Options = []

export const noInlineQueryOptions = createRule<Options, MessageId>({
    name: 'no-inline-query-options',
    create(context) {
        const services = ESLintUtils.getParserServices(context);
        const checker = services.program.getTypeChecker()
        const sourceCode = context.getSourceCode()

        return {
            CallExpression(node) {
                if (
                    node.callee.type !== TSESTree.AST_NODE_TYPES.Identifier ||
                    node.callee.name !== 'queryOptions'
                ) {
                    return;
                }

                const calleeNode = services.esTreeNodeToTSNodeMap.get(node.callee)
                const calleeSymbol = checker.getSymbolAtLocation(calleeNode);
                // const sourceFile = calleeSymbol?.declarations?.[0]?.getSourceFile().fileName
                //
                // if (!sourceFile) {
                //     return;
                // }
                //
                // const isFromTanStackQuery = /@tanstack\/(react-query|solid-query|svelte-query|vue-query)/.test(
                //     sourceFile,
                // );
                //
                // console.log(sourceFile, isFromTanStackQuery)
                //
                // if (!isFromTanStackQuery) {
                //     return
                // }

                const ancestors = sourceCode.getAncestors(node)
                console.log(ancestors)
                const isInsideFunctionScope = ancestors.some((ancestor) =>
                    [
                        TSESTree.AST_NODE_TYPES.FunctionDeclaration,
                        TSESTree.AST_NODE_TYPES.FunctionExpression,
                        TSESTree.AST_NODE_TYPES.ArrowFunctionExpression,
                        TSESTree.AST_NODE_TYPES.MethodDefinition,
                    ].includes(ancestor.type),
                )

                if (isInsideFunctionScope) {
                    context.report({
                        node: node,
                        messageId: 'NoInlineQueryOptions',
                    })
                }
            }
        }
    },
    meta: {
        docs: {
            description: 'Enforces that `queryOptions` is not called directly inside query hooks.'
        },
        messages: {
            NoInlineQueryOptions: '',
        },
        type: 'problem',
        schema: [
        ],
    },
    defaultOptions: [
    ],
})