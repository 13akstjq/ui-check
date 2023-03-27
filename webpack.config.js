const path = require('path');

const config = {
    entry: './src/ui-check.js',
    output: {
        filename: 'ui-check.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader", 
                        options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: false,
    }
};


module.exports = (env, argv) => {
    if(argv.mode == 'production')
        config.optimization.minimize = true;

    return config;
};