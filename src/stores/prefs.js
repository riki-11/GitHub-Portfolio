// Packages
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const usePrefsStore = defineStore('prefs', () => {
    const preferences = reactive({
        closeSidebar: false
    })

    const setPreferences = (providedData) => {
        Object.assign(preferences, { ...preferences, ...providedData })
    }

    return { preferences, setPreferences }
})
