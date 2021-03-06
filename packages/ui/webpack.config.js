import PerspectivePlugin from '@finos/perspective-webpack-plugin'

module.exports = {
  entry: './in.js',
  output: {
    filename: 'out.js',
    path: 'build'
  },
  plugins: [new PerspectivePlugin()]
}
