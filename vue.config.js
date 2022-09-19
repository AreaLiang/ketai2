// const CompressionPlugin = require('compression-webpack-plugin');
const Webpack = require("webpack");

module.exports = {
	pages: {
		index: {
			entry: "src/main.js"
		}
	},
	// 基本路径
	publicPath: './',
	// 输出文件目录
	outputDir: 'dist',
	assetsDir: 'static',
	lintOnSave: false,
	// devServer: {
	// 	proxy: {
	// 		'/api': {
	// 			target: 'http://localhost:5000', //跨域端口
	// 			pathRewrite: {
	// 				'^/api': ''
	// 			}
	// 		}
	// 	}
	// }
	configureWebpack: {
		plugins: [
			// new CompressionPlugin({
			// 	algorithm: 'gzip', // 使用gzip压缩
			// 	test: /\.js$|\.html$|\.css$/, // 匹配文件名
			// 	filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
			// 	minRatio: 1, // 压缩率小于1才会压缩
			// 	threshold: 10240, // 对超过10k的数据压缩
			// 	deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
			// }),
			new Webpack.DefinePlugin({ //用于注入全局变量，一般用在环境变量上
				global_companyName: "'广东科泰计量检测科技有限公司'", //该网站的 公司名称
			})
		]
	},
	chainWebpack: config => { //image-webpack-loader 图片压缩
		const imagesRule = config.module.rule('images')
		imagesRule
			.use('image-webpack-loader')
			.loader('image-webpack-loader')
			.options({
				bypassOnDebug: true
			})
			.end()
	}
}
