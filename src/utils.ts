import {ESLintUtils} from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator(
    (ruleName) => `https://github.com/simochee/eslint-plugin-tanstack-query-options/blob/main/src/rules/${ruleName}.md`,
);