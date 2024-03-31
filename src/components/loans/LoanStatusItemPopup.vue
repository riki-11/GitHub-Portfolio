<script setup>
// Packages
import { ref } from 'vue'

// Project constants
import { API_URL } from '../../constants/index.js'

// Stores
import { useCurrentUserStore } from '../../stores/currentUser.js'
const currentUserStore = useCurrentUserStore()

// Props
const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    onsubmit: {
        type: Function,
        required: true
    }
})

// Reactive variables
const errorAlert = ref(false)
const errorMessage = ref('')
const processing = ref(false)
const headers = [
    { title: 'Loanee', key: 'loanee' },
    { title: 'Type of Loan', key: 'loanType' },
    { title: 'Amount of Loan', key: 'originalLoanAmount' },
    { title: 'Submission Date', key: 'submissionDate' }
]

// Methods
const decide = async (toApprove) => {
    processing.value = true

    const { error, message } = await fetch(`${API_URL}/loans/${props.data.id}/review`, {
        credentials: 'omit',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        },
        body: JSON.stringify({
            approved: toApprove,
            oic: currentUserStore.name
        })
    }).then((res) => res.json())

    processing.value = false

    // Reset error alert
    errorAlert.value = false
    errorMessage.value = ''

    if (error) {
        errorAlert.value = true
        errorMessage.value = message
        return
    }

    props.onsubmit(props.data.id)
}
</script>

<template>
    <h2 class="header-wrapper">Change the status of the loan below</h2>
    <div class="wrapper">
        <v-data-table-virtual :headers="headers" :items="[data]">
            <template #item.loanee="{ value }">
                <v-btn
                    class="text-none bg-blue-darken-1"
                    :to="{ name: 'Profile View', params: { username: value } }"
                >
                    {{ value }}
                </v-btn>
            </template>

            <template #item.originalLoanAmount="{ value }">
                {{
                    Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'PHP'
                    }).format(Number(value))
                }}
            </template>

            <template #item.submissionDate="{ value }">
                {{ new Date(value).toLocaleDateString('en-PH', { dateStyle: 'long' }) }}
            </template>
        </v-data-table-virtual>
        <VAlert
            v-if="errorAlert"
            v-model="errorAlert"
            type="error"
            closable=""
            density="comfortable"
            elevation="5"
        >
            {{ errorMessage }}
        </VAlert>
        <div class="ml-auto d-flex justify-end pt-4">

            <!-- Reject Loan -->
            <v-btn
                class="capitalize mr-2 text-white"
                prepend-icon="mdi-close-thick"
                color="var(--vt-c-red)"
                :loading="processing"
                @click.prevent="decide(false)"
            >
                Reject Loan
            </v-btn>
            <!-- Accept Loan -->
            <v-btn
                class="capitalize"
                prepend-icon="mdi-check-bold"
                color="green"
                :loading="processing"
                @click.prevent="decide(true)"
            >
                Accept Loan
            </v-btn>

            
        </div>
    </div>
</template>

<style scoped>
.header-wrapper {
    padding-left: 7%;
    padding-bottom: 2%;
}
.wrapper {
    padding: 6%;
    padding-top: 2%;
    padding-bottom: 3%;
    background-color: var(--vt-c-white);
}
</style>
