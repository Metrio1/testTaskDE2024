import globals from "globals";

const customRules = {
  "array-bracket-spacing": [ 2, "always" ],
  "quotes": [ "error", "double", { "avoidEscape": true, "allowTemplateLiterals": true } ],
  "no-console": [
    "error",
    { "allow": [ "warn", "error", "debug", "asset", "table", "time", "timeEnd" ] },
  ],
  "no-unused-vars": [ "error", { "args": "none" } ],
  "curly": "error",
  "object-curly-spacing": [ "error", "always" ],
  "no-redeclare": 2,
  "no-shadow-restricted-names": 2,
  "eqeqeq": [ "error", "always" ],
};

const getIgnoreFolders = (folders = [ "node_modules", "build", "public", "assets", "dist", "temp", ".temp", ".cache", "cache" ]) => {
  const maskName = "%mask%";
  const ignoreMasks = [ `**/${maskName}/`, `/**/${maskName}/*`, `${maskName}/` ];
  return folders
      .map((folder) => ignoreMasks.map(item => item.replace(maskName, folder)))
      .flat();
};

const files = [ "js", "jsx", "mjs" ].map(ex => `**/*.${ex}`);

const languageOptions = {
  "globals": {
    ...globals.browser,
    ...globals.builtin,
    ...globals.es2021,
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
};

export default [
  {
    files,
    languageOptions,
    settings: {},
    ignores: getIgnoreFolders(),
    rules: customRules,
  },
];