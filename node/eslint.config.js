import antfu from "@antfu/eslint-config";

export default antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
        semi: true,
        arrowParens: true,
        quoteProps: "as-needed",
    },
    ignores: [
        "./coverage",
        "./temp",
    ],
});
