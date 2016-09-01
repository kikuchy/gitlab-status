module.exports = {
    context: __dirname + "/source",
    entry: {
    
        application: "./es2015/application",
        background: "./es2015/background"
    },
    output: {
        path: __dirname + "/distribution/javascript",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            }
        ]
    }
}
