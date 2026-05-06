import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".claude/**",
    ".test-dist/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "__tests__/**",
  ]),
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      }],
      "@typescript-eslint/no-non-null-assertion": "error",

      // General
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "no-duplicate-imports": "error",
      "no-return-await": "error",
      "object-shorthand": "error",

      // React
      "react/no-unused-prop-types": "error",
      "react/self-closing-comp": "error",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/no-array-index-key": "warn",
    },
  },
  {
    // .tsx files are potentially client components — pino can't be bundled there
    files: ["**/*.tsx"],
    rules: {
      "no-console": "off",
    },
  },
  {
    // Type-aware rules — require parserOptions.project
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
    },
  },
]);

export default eslintConfig;
