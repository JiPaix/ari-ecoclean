import { createApp } from 'vue'
import App from './App.vue'


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { mdiBarcodeScan, mdiAlertBox } from '@mdi/js'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'mdi',
    aliases : {
        ...aliases,
        'barcode-scan': mdiBarcodeScan,
        'alert-box': mdiAlertBox
    },
    sets: {
      mdi,
    },
  },
})


createApp(App).use(vuetify).mount('#app')
