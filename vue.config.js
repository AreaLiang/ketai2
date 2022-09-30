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
	configureWebpack: {
		plugins: [
			new Webpack.DefinePlugin({ //用于注入全局变量，一般用在环境变量上
				global_companyName: "'广东科泰计量检测科技有限公司'", //该网站的 公司名称
			}),
			new Webpack.ProvidePlugin({
				//lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库,中文文档：https://www.lodashjs.com/
				_: 'lodash'
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
