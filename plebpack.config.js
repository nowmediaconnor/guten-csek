const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { merge } = require("webpack-merge");

const myConfig = {
    entry: {
        ...defaultConfig.entry,
        // editor: "./src/editor.ts",
        index: "./src/index.js",
    },
    // Additional custom configuration
};

module.exports = merge(defaultConfig, myConfig);
