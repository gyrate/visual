const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '',
    lintOnSave: false,
    // 生产环境 sourceMap
    productionSourceMap: false,
    devServer: {
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: `http://develop.iot-cas.com:8081/portal`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
        }
    },

    configureWebpack: {
        name: 'framework',
        resolve: {
            extensions: ['.js', '*', '.css'],
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            // 构建结果输出可视化分析
            // new BundleAnalyzerPlugin(
            //   {
            //     analyzerMode: 'server',
            //     analyzerHost: '127.0.0.1',
            //     analyzerPort: 8889,
            //     reportFilename: 'report.html',
            //     defaultSizes: 'parsed',
            //     openAnalyzer: true,
            //     generateStatsFile: false,
            //     statsFilename: 'stats.json',
            //     statsOptions: null,
            //     logLevel: 'info'
            //   }
            // )
        ]
    },


    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'visual',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    }

}
