// v2.0 - src/vuetify.plugin.js
import Vue from 'vue'
import Vuetify from 'vuetify' // "a-la-carte" component imports required by vuetify-form-base (instead of working with vuetify-loader)

Vue.use(Vuetify)

let colors = {
  primary: '#026F6F',
  secondary: '#ec407a',
  tertiary: '#04B9A8',
  accent: '#5c4ae4',
  background: '#F5F5F5',
  error: '#F04722',
  info: '#51A0FB',
  success: '#44C47D',
  warning: '#FFC107',
  // wot-runtime states:
  idle: '#666666',
  loading: '#007FFF',
  running: '#10D8B1',
  working: '#5c4ae4',
  stopped: '#FF9933',
  failed: '#CC0066'
}

export default new Vuetify({
  theme: {
    // dark: $store.state.app.darkTheme,
    themes: {
      light: colors,
      dark: colors
    }
  },
  icons: {
    iconfont: 'md' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  options: {
    customProperties: true // generate a css variable for each theme color
  }
})
