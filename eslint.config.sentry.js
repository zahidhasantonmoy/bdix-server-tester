{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-object-type": "off"
  },
  "plugins": ["sentry"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    }
  ]
}