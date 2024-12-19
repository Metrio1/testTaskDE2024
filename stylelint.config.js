export default {
    extends: [
        'stylelint-config-standard-scss',
    ],
    plugins: ['stylelint-scss'],
    rules: {
        'scss/at-rule-no-unknown': true,
        'no-empty-source': null,
    },
};
