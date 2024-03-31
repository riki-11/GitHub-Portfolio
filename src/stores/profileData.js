/**
 * Stores the info about the currently viewed user profile in User Profile View.
 * @module stores/profileData
 */

// Packages
import { defineStore } from 'pinia'
import { reactive } from 'vue'

/**
 * Profile Data store
 */
export const useProfileDataStore = defineStore('profileData', () => {
    const profileData = reactive({})

    /**
     * Set the stored profile data
     * @param data - The member profile info to store
     */
    const setProfileData = (data) => {
        Object.assign(profileData, data)
    }

    return {
        profileData,
        setProfileData
    }
})
