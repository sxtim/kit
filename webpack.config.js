const config = {
	mode: 'none',
	entry: {
		index: './src/js/index.js',
		apartmentsCatalog: './src/js/apartmentsCatalog.js',
		productDetail: './src/js/productDetail.js',
		// about: './src/js/about.js',
	},
	output: {
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
