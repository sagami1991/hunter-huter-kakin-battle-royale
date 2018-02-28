// @ts-check
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [
    // typescript -> javascript build
    {
        entry: {
            "app": "./src/typescript/app.ts",
        },
        output: {
            path: path.join(__dirname, "dist"),
            filename: "[name].js",
        },
        devtool: "source-map",
        resolve: {
            modules: [
                path.resolve("./src/typescript"),
                path.resolve("./node_modules")
            ],
            extensions: [".js", ".ts"],
        },
        module: {
            rules: [{
                test: /\.ts?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            "noUnusedLocals": false,
                            "noUnusedParameters": false,
                        }
                    }
                }
            }, {
                test: /.svg$/,
                use: {
                    loader: "raw-loader"
                }
            }]
        },
        target: "web",
        externals: {
            "firebase/app": "firebase"
        }
    },
    // sass -> css build
    {
        context: path.join(__dirname, "src/scss"),
        entry: {
            style: "./main.scss"
        },
        output: {
            path: path.join(__dirname, "dist"),
            filename: "style.css"
        },
        module: {
            rules: [{
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }]
                })
            }, {
                test: /\.png$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "image/png"
                    }
                }]
            }, {
                test: /\.svg$/,
                use: [{
                    loader: "svg-url-loader",
                    options: {
                        limit: 10000,
                    }
                }]
            }]
        },
        devtool: "source-map",
        plugins: [
            new ExtractTextPlugin({
                filename: "style.css"
            }),
            new CopyWebpackPlugin([{
                from: path.join(__dirname, "src/static"),
            }])
        ]
    }
];