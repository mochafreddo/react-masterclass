#!/bin/bash

# 공통 의존성 설치
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-import eslint-plugin-simple-import-sort stylelint stylelint-config-standard husky lint-staged @typescript-eslint/parser @typescript-eslint/eslint-plugin commitlint @commitlint/config-conventional commitizen jest eslint-plugin-jest

# npm-check-updates 글로벌 설치
npm install -g npm-check-updates

# Husky 초기화
npx husky install

# pre-commit 훅 추가 (커밋 전에 lint-staged 실행)
cat <<EOL >.husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
EOL
chmod +x .husky/pre-commit

# commit-msg 훅 추가 (커밋 메시지 검사)
cat <<EOL >.husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "\$1"
EOL
chmod +x .husky/commit-msg

# ESLint 설정 파일 생성
cat <<EOL >.eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "extends": ["react-app", "react-app/jest", "prettier"],
  "plugins": ["prettier", "import", "simple-import-sort"],
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

# 설정 파일들이 제대로 생성되었는지 확인
if [ -f ".eslintrc.json" ] && [ -f ".prettierrc" ] && [ -f ".stylelintrc.json" ] && [ -f ".lintstagedrc" ] && [ -f "commitlint.config.js" ] && [ -f ".ncurc.json" ]; then
  echo "설정 파일들이 성공적으로 생성되었습니다."
else
  echo "설정 파일 생성에 실패했습니다."
  exit 1
fi

# ESLint 테스트
echo "console.log('test');" >test.js
npx eslint test.js
if [ $? -eq 0 ]; then
  echo "ESLint가 정상적으로 작동합니다."
else
  echo "ESLint 테스트에 실패했습니다."
  exit 1
fi
rm test.js

# Prettier 테스트
echo "const x = { y: 1 };" >test.js
npx prettier --check test.js
if [ $? -eq 0 ]; then
  echo "Prettier가 정상적으로 작동합니다."
else
  echo "Prettier 테스트에 실패했습니다."
  exit 1
fi
rm test.js

# Stylelint 테스트
echo "a { color: #fff; }" >test.css
npx stylelint test.css
if [ $? -eq 0 ]; then
  echo "Stylelint가 정상적으로 작동합니다."
else
  echo "Stylelint 테스트에 실패했습니다."
  exit 1
fi
rm test.css

# Commitlint 테스트
echo "test: commit message" | npx commitlint
if [ $? -eq 0 ]; then
  echo "Commitlint가 정상적으로 작동합니다."
else
  echo "Commitlint 테스트에 실패했습니다."
  exit 1
fi

echo "모든 설정이 정상적으로 작동합니다."
