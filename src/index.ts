import {Linter} from '@typescript-eslint/utils/ts-eslint'
import { name, version } from '../package.json' with { type: 'json' };
import {noLooseQueryKey} from "./rules/no-loose-query-key";

const plugin = {
    meta: {
        name,
        version,
    },
    rules: {
        'no-loose-query-key': noLooseQueryKey
    }
} satisfies Linter.Plugin

export default plugin
