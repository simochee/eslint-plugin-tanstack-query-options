import {ESLint, Linter} from 'eslint'
import { name, version } from '../package.json' with { type: 'json' };

const plugin = {
    meta: {
        name,
        version,
    },
    rules: {}
} satisfies ESLint.Plugin

export default plugin

type RuleDefinitions = typeof plugin.rules

export type RuleOptions = {
    [K in keyof RuleDefinitions]: RuleDefinitions[K]['defaultOptions']
}

export type Rules = {
    [K in keyof RuleDefinitions]: Linter.RuleEntry[RuleOptions[K]]
}