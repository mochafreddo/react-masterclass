#!/bin/bash

# 공통 의존성 설치
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-import eslint-plugin-simple-import-sort stylelint stylelint-config-standard husky lint-staged @typescript-eslint/parser @typescript-eslint/eslint-plugin commitlint @commitlint/config-conventional commitizen jest eslint-plugin-jest

# npm-check-updates 글로벌 설치
npm install -g npm-check-updates

# Husky 초기화
npx husky install

# pre-commit 훅 추가 (커밋 전에 lint-staged 실행)
npx husky add .husky/pre-commit "npx lint-staged"
# commit-msg 훅 추가 (커밋 메시지 검사)
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'

# ESLint 설정 파일 생성
cat <<EOL >.eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "react-app",
    "react-app/jest",
    "prettier",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": [
    "prettier",
    "import",
    "simple-import-sort",
    "@typescript-eslint",
    "jest"
  ],
  "rules": {
    "prettier/prettier": "error",
    "import/order": [
      "error",
      {
        "groups": [["builtin", "external", "internal"]],
        "newlines-between": "always"
      }
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-console": "warn",
    "no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": true
      }
    ],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-undef": "error",
    "no-var": "error",
    "prefer-const": "error",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { "vars": "all", "args": "after-used", "ignoreRestSiblings": true }
    ]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
}
EOL

# Prettier 설정 파일 생성
cat <<EOL >.prettierrc
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "jsxBracketSameLine": false,
  "printWidth": 80,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false
}
EOL

# Stylelint 설정 파일 생성
cat <<EOL >.stylelintrc.json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "block-no-empty": true,
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "indentation": 2,
    "max-empty-lines": 1,
    "string-quotes": "single",
    "unit-allowed-list": ["em", "rem", "%", "s"]
  }
}
EOL

# lint-staged 설정 파일 생성
cat <<EOL >.lintstagedrc
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,scss}": [
    "stylelint --fix"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
EOL

# commitlint 설정 파일 생성
cat <<EOL >commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
EOL

# ncu (npm-check-updates) 설정 파일 생성
cat <<EOL >.ncurc.json
{
  "upgrade": true
}
EOL

# 프로젝트 초기화 완료 메시지 출력
echo "프로젝트 초기화가 완료되었습니다. 이제 코딩을 시작하세요!"
