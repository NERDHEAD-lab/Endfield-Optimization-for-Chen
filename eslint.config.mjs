import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintComments from "eslint-plugin-eslint-comments";

export default [
  {
    ignores: ["CHANGELOG.md", "dist-electron/**", "dist/**", "release/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "eslint-comments": eslintComments,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/first": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSImportType",
          message:
            "Don't use inline import(...).Type. Import the type at the top of the file instead.",
        },
      ],
      "eslint-comments/no-use": ["error", { allow: ["eslint-enable"] }],
    },
  },
  // Renderer Specific Rules (Restrict Storage & Imports)
  {
    files: ["src/renderer/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSImportType",
          message:
            "Don't use inline import(...).Type. Import the type at the top of the file instead.",
        },
        {
          selector: "CallExpression[callee.object.name='localStorage']",
          message:
            "Direct access to localStorage is restricted. Use useFeatureStorage() or LauncherContext instead.",
        },
        {
          selector: "MemberExpression[object.name='localStorage']",
          message:
            "Direct access to localStorage is restricted. Use useFeatureStorage() or LauncherContext instead.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "electron-store",
              message:
                "Direct import of electron-store is restricted in renderer. Use context-based storage instead.",
            },
          ],
        },
      ],
    },
  },
  // Main/Shared Specific Import Restrictions
  {
    files: ["src/main/**/*.ts", "src/shared/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "../store",
              importNames: ["setConfig", "deleteConfig"],
              message:
                "CONFIRMED: Use 'setConfigWithEvent' or 'deleteConfigWithEvent' from 'utils/config-utils' to ensure UI updates.",
            },
            {
              name: "../../store",
              importNames: ["setConfig", "deleteConfig"],
              message:
                "CONFIRMED: Use 'setConfigWithEvent' or 'deleteConfigWithEvent' from 'utils/config-utils' to ensure UI updates.",
            },
            {
              name: "./store",
              importNames: ["setConfig", "deleteConfig"],
              message:
                "CONFIRMED: Use 'setConfigWithEvent' or 'deleteConfigWithEvent' from 'utils/config-utils' to ensure UI updates.",
            },
          ],
        },
      ],
    },
  },
  // Exceptions for Config Utilities (Allow store access)
  {
    files: ["src/main/utils/config-utils.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // JS/JSX Specific Rules
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": ["error", { count: 1 }],
    },
  },
  // Exceptions for Storage Providers (Allow localStorage)
  {
    files: [
      "src/renderer/context/LauncherContextProvider.tsx",
      "src/renderer/context/FeatureContextProvider.tsx",
      "src/renderer/i18n/index.ts",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSImportType",
          message:
            "Don't use inline import(...).Type. Import the type at the top of the file instead.",
        },
      ],
    },
  },
  // Type Definition Exceptions
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-var": "off",
    },
  },
  prettier,
];
