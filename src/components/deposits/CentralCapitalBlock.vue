<script setup>
// Packages
import { ref, reactive, onMounted } from 'vue'

// Project constants
import { API_URL, DEPOSIT_CATEGORIES } from '../../constants/index.js'

// Import router
import router from '../../router/index.js'

// Stores
import { useProfileDataStore } from '../../stores/profileData.js'
const profileDataStore = useProfileDataStore()

// Props
const props = defineProps({
    username: {
        type: String,
        required: false
    }
})

// Reactive variables
const search = ref('')
const items = reactive([])
const headers = [
    { title: 'Deposit Category', key: 'category' },
    { title: 'Deposit Holder', key: 'holder' },
    { title: 'Approval Date', key: 'approvalDate' },
    { title: 'Ledger', key: 'id' }
]

if (props.username) headers.splice(1, 1)

// Methods

/**
 * Visits individual deposit ledger based on its ID
 * @param {*} depositID - ID of individual deposit
 */
const visitDepositLedger = async (depositID) => {
    router.push({ name: 'Deposit Ledger', params: { id: depositID } })
}

/**
 * Visits the member profile based on their username
 * @param {*} username - Username of the member
 */
const visitMemberProfile = async (username) => {
    if (profileDataStore.profileData && profileDataStore.profileData.username !== username)
        profileDataStore.setProfileData({})
    router.push({ name: 'Profile View', params: { username } })
}

onMounted(async () => {
    const url = props.username ? `/user/${props.username}` : ''

    const res = await fetch(`${API_URL}/deposits${url}`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    })

    if (res.status === 200) {
        const { deposits } = await res.json()

        items.push(
            ...deposits.map((deposit) => ({
                id: deposit.depositID,
                category: DEPOSIT_CATEGORIES[deposit.category],
                holder: deposit.username,
                approvalDate: deposit.approvalDate,
                interestRate: deposit.interestRate
            }))
        )
    }
})
</script>

<template>
    <v-card>
        <v-card-title class="d-flex align-center w-25">
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                label="Search"
                single-line=""
                flat=""
                hide-details
                variant="solo-filled"
            ></v-text-field>
        </v-card-title>

        <v-data-table
            :headers="headers"
            :items="items"
            hover=""
            multi-sort=""
            :search="search"
            sticky=""
        >
            <template #item.holder="{ value }">
                <v-btn
                    class="text-none bg-blue-darken-1"
                    @click.prevent="visitMemberProfile(value)"
                >
                    {{ value }}
                </v-btn>
            </template>

            <template #item.approvalDate="{ value }">
                {{
                    new Date(value).toLocaleDateString('en-PH', {
                        dateStyle: 'long'
                    })
                }}
            </template>

            <template #item.interestRate="{ value }">
                {{
                    Intl.NumberFormat('en-PH', {
                        style: 'percent',
                        maximumFractionDigits: 2
                    }).format(value / 100)
                }}
            </template>

            <template #item.id="{ value }">
                <v-btn
                    class="text-none bg-blue-darken-1"
                    @click.prevent="visitDepositLedger(value)"
                    density="comfortable"
                    icon="mdi-arrow-right-circle"
                />
            </template>
        </v-data-table>
    </v-card>
</template>

<style>
.cursor-pointer {
    cursor: pointer;
}
</style>
