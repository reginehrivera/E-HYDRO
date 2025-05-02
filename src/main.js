import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // ✅ Import this

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VCalendar } from 'vuetify/labs/VCalendar'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia() // ✅ Assign this to a variable
pinia.use(piniaPluginPersistedstate) // ✅ Register plugin BEFORE using app.use(pinia)

const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
