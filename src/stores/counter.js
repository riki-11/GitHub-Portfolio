/**
 * A store for maintaining a generic counter across webpages.
 * @module stores/counter
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Counter store
 */
export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    /**
     * Increment counter
     */
    function increment() {
        count.value++
    }

    return { count, doubleCount, increment }
})
