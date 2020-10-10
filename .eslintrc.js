module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  settings: {
    exclude: ["node_modules", ".vscode", "**/*.test.ts","dist"],
    include: ["**/*.{ts,tsx,js,jsx}"],
    "import/resolver": {
      node: {
        paths: ["src", "data", ".storybook"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
      }
    },
  },
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  rules: {
    
    // NOTE: conflicts with prettier
    "@typescript-eslint/indent": "off",
    "react/jsx-indent-props": 0,
    "@typescript-eslint/ban-ts-ignore": "off",
    "react/jsx-props-no-spreading": 0,
    "react/jsx-curly-newline": 0,
    "react/jsx-indent": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "import/no-named-as-default-member": 0,
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsForRegex: ["^draft$"] },
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    "import/no-extraneous-dependencies": [
      2,
      { devDependencies: ["!*/util-type-defs", "!*/util-type-defs/*"] },
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/quotes": "off",
    "react/prop-types": "off",
    "no-underscore-dangle": "off",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
};
