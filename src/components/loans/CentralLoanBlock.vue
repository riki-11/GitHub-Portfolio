<script setup>
// Packages
import { ref, reactive, onMounted } from 'vue'

// Project constants
import { API_URL, LOAN_TYPES } from '../../constants/index.js'

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

// Constants
const headers = [
    { title: 'Type of Loan', key: 'type' },
    { title: 'Loanee', key: 'loanee' },
    { title: 'Original Amount of Loan', key: 'originalAmount' },
    { title: 'Outstanding Balance', key: 'balance' },
    { title: 'Status', key: 'status' },
    { title: 'Due Date', key: 'dueDate' },
    { title: 'View Loan Ledger', key: 'id' }
]
const buildStatus = {
    pending: ['Pending', 'purple'],
    approved: ['Approved (for release)', 'orange'],
    released: ['Approved (released)', 'success'],
    rejected: ['Rejected', 'red'],
    complete: ['Complete', 'blue']
}
const notificationSettings = reactive({
    reminder: 0,
    first_notice: 0,
    second_notice: 0,
    third_notice: 0,
    demand_letter: 0
})

// Reactive variables
const search = ref('')
const items = reactive([])

if (props.username) headers.splice(1, 1)

// Methods

/**
 * Visits individual loan ledger based on its ID
 * @param {*} loanID - ID of individual loan
 */
const visitLoanLedger = async (loanID) => {
    router.push({ name: 'Loan Ledger', params: { id: loanID } })
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

/**
 * Gets the corresponding color for the data
 * @param {*} dueDate - Due date of the loan
 */
const getDateColor = (dueDate) => {
    const currentDate = new Date()

    const diffTime = Math.abs(currentDate - new Date(dueDate))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= notificationSettings.demand_letter) return 'red'
    else if (diffDays <= notificationSettings.third_notice) return 'orange'
    else if (diffDays <= notificationSettings.second_notice) return 'blue'
    else if (diffDays <= notificationSettings.first_notice) return 'purple'
    else if (diffDays <= notificationSettings.reminder) return 'grey'
    else return 'green'
}

// Lifecycle hooks
onMounted(async () => {
    // Get notification settings for due date periods
    let res = await fetch(`${API_URL}/settings/notifications`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    })

    if (res.ok) {
        const { settings } = await res.json()
        Object.assign(notificationSettings, settings)
    }

    // Get loans
    const url = props.username ? `/user/${props.username}` : ''
    const params = new URLSearchParams()
    params.set('status', 'approved,released')
    res = await fetch(`${API_URL}/loans${url}?${params}`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    })

    if (res.ok) {
        const { loans } = await res.json()
        items.push(
            ...loans.map((loan) => ({
                id: loan.loanID,
                loanee: loan.username,
                type: LOAN_TYPES[loan.loanType],
                balance: loan.balance,
                originalAmount: loan.originalLoanAmount,
                status: loan.status,
                dueDate: loan.dueDate
            }))
        )
    }
})
</script>

<template>
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
        :sort-by="[
            { key: 'status', order: 'asc' },
            { key: 'dueDate', order: 'asc' }
        ]"
    >
        <template #item.loanee="{ value }">
            <v-btn class="text-none bg-blue-darken-1" @click.prevent="visitMemberProfile(value)">
                {{ value }}
            </v-btn>
        </template>

        <template #item.submissionDate="{ value }">
            <v-chip>
                {{
                    new Date(value).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                }}
            </v-chip>
        </template>

        <template #item.balance="{ value }">
            {{
                Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP'
                }).format(Number(value))
            }}
        </template>

        <template #item.originalAmount="{ value }">
            {{
                Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP'
                }).format(Number(value))
            }}
        </template>

        <template #item.status="{ value, item }">
            <v-chip :color="buildStatus[value][1]"> {{ buildStatus[value][0] }} </v-chip>
        </template>

        <template #item.dueDate="{ value }">
            <v-chip
                :color="Date.now() > new Date(value).getTime() ? 'red' : getDateColor(value)"
                v-if="value"
            >
                {{
                    new Date(value).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                }}
            </v-chip>
            <v-tooltip location="top" v-if="value && Date.now() > new Date(value).getTime()">
                <template #activator="{ props }">
                    <v-icon v-bind="props" color="var(--vt-c-red)">mdi-alert</v-icon>
                </template>
                <span>This loan is overdue!</span>
            </v-tooltip>
        </template>

        <template #item.id="{ value }">
            <v-btn
                class="text-none bg-blue-darken-1"
                @click.prevent="visitLoanLedger(value)"
                density="comfortable"
                icon="mdi-arrow-right-circle"
            />
        </template>
    </v-data-table>
</template>

<style>
.cursor-pointer {
    cursor: pointer;
}
</style>
