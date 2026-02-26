module.exports = {
  '*.{js,cjs,mjs,ts,tsx,jsx,json,md,css,scss,yml,yaml}': ['prettier --write'],
  '*.{js,ts,tsx,jsx}': ['eslint --max-warnings=0 --fix'],
};
