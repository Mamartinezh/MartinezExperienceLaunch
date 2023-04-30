

let path = require('path')
let htmlWebpackPlugin = require('html-webpack-plugin')
let copyWebpackPlugin = require('copy-webpack-plugin')


const ruleForJS = {
	test: /\.js$/,
	loader: 'babel-loader',
	options: {
		presets: [
			[
				'@babel/preset-react',
				{runtime: 'automatic'}
			]
		]
	}
}

const ruleForCSS = {
	test: /\.css$/,
	use: ['style-loader', 'css-loader']
}

const ruleForMedia = {
	test: /\.(png|svg|webp|jpe?g)$/,
	use: 'file-loader?name=./media/[name].[ext]'
}

const rules = [ruleForJS, ruleForCSS, ruleForMedia]

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build')
	},
	module: {rules},
	devtool: 'source-map',
	plugins: [ 
		new htmlWebpackPlugin({template: './src/index.html'}),
		new copyWebpackPlugin({patterns: [{from: path.resolve(__dirname, './static') }] })
	],
	devServer: {
		open: true,
		port: 3000,
		compress: true
	}

}