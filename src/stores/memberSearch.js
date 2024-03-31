/**
 * A store for maintaining info about searched members in searchbars.
 * Stores the information of a single searched member (loanee).
 * @module stores/memberSearch
 */

// Packages
import { defineStore } from 'pinia'
import { reactive } from 'vue'

/**
 * Member search store. Stores the information of a searched member.
 */
export const useMemberSearchStore = defineStore('memberSearch', () => {
    const data = reactive({})

    /**
     * Set the store's internal state to the provided data.
     * @param {Object} providedData - The searched member data provided to the store.
     */
    const setData = (providedData) => {
        Object.assign(data, providedData)
    }

    return { data, setData }
})
