// cSpell Settings
// REF https://cspell.org/configuration/
module.exports = {
    // Version of the setting file.  Always 0.1
    version: "0.1",
    // language - current active spelling language
    language: "en",
    // words - list of words to be always considered correct
    words: [
        "siyuan",
    ],
    // flagWords - list of words to be always considered incorrect
    // This is useful for offensive words and common spelling errors.
    // For example "hte" should be "the"
    flagWords: [
    ],
    ignorePaths: [
        "./package.json",
        "./pnpm-lock.yaml",

        "./node_modules/**",
        "./build/**",
        "./dist/**",
    ],
};
