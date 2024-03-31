/**
 * Module containing the main app
 * @module main
 */

// Import packages
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'

// Import stylesheets
import 'vuetify/lib/styles/main.css'
import '@mdi/font/css/materialdesignicons.css'
import 'nprogress/nprogress.css'

/**
 * Main Vue file for application
 * @object {App.App}
 */
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies, { expires: '30d', secure: true, sameSite: 'Lax' })
app.use(
    createVuetify({
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi
            }
        }
    })
)

// Create directive for number-only input
app.directive('number-only', {
    beforeMount(el) {
        el.addEventListener('keydown', (e) => {
            if (
                e.key === 'Backspace' ||
                e.key === 'Tab' ||
                e.key === 'Delete' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Home' ||
                e.key === 'End'
            ) {
                return
            }

            if (e.key === '.') {
                if (!el.value.includes('.')) {
                    return
                } else {
                    e.preventDefault()
                }
            }

            if (isNaN(e.key)) {
                e.preventDefault()
            }
        })
    }
})

app.mount('#app')
