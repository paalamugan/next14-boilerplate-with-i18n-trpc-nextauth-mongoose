const lintStagedConfig = {
  '**/*.ts?(x)': () => 'npm run type-check',
  '**/*.{js,mjs,ts,tsx}': ['turbo lint:js -- --fix', 'prettier --check --write'],
  '**/*.{md,mdx}': ['turbo lint:md -- --fix', 'prettier --check --write'],
  '**/*.css': ['turbo lint:css -- --fix', 'prettier --write'],
  '**/*.{json,yaml}': ['prettier --check --write'],
};

export default lintStagedConfig;
