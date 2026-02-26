module.exports = {
  '*.{js,cjs,mjs,ts,tsx}': [
    'ESLINT_USE_FLAT_CONFIG=false eslint --max-warnings 0 --fix',
    'prettier --write',
  ],
  '*.{json,md,css,html,yml,yaml}': ['prettier --write'],
};
