module.exports = {
  devServer: {
    port: 8000
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js'
    }
  },
  transpileDependencies: ['feathers-vuex', 'vuetify'],
  configureWebpack: {
    plugins: []
  }
}
