<script setup>
// Packages
import { ref, reactive, onMounted } from 'vue'

// Vue components
import LoanStatusItemPopup from './LoanStatusItemPopup.vue'

// Project constants
import { API_URL, LOAN_TYPES } from '../../constants/index.js'

const props = defineProps({
    status: {
        type: String,
        default: 'pending'
    }
})

// Reactive variables
const search = ref('')
const items = reactive([])
const snackbar = ref(false)
const headers = [
    { title: 'Loanee', key: 'loanee' },
    { title: 'Type of Loan', key: 'loanType' },
    { title: 'Amount of Loan', key: 'originalLoanAmount' },
    { title: 'Submission Date', key: 'submissionDate' },
    { title: 'Change Status', key: 'id' }
]

// Remove the "Change Status" column if the status is not pending
if (props.status !== 'pending') headers.splice(4, 1)

// Methods
const fetchLoans = async () => {
    const params = new URLSearchParams()
    params.set('status', props.status)
    const { error, message, loans } = await fetch(`${API_URL}/loans?${params}`, {
        credentials: 'omit',
        method: 'GET',
        headers: { Authorization: `Bearer ${window.$cookies.get('credentials').token}` }
    }).then((res) => res.json())

    if (error) {
        console.error(message)
        return
    }

    items.push(
        ...loans.map((loan) => ({
            id: loan.loanID,
            loanee: loan.username,
            loanType: LOAN_TYPES[loan.loanType],
            originalLoanAmount: loan.originalLoanAmount,
            submissionDate: loan.submissionDate,
            status: loan.status
        }))
    )
}

const removeLoanFromGrid = (loanID) => {
    snackbar.value = true

    const index = items.findIndex((loan) => loan[0] === loanID)
    items.splice(index, 1)
}

// Lifecycle hooks
onMounted(fetchLoans)
</script>

<template>
    <v-data-table
        :headers="headers"
        :items="items"
        hover=""
        multi-sort=""
        :search="search"
        sticky=""
    >
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

        <template #item.id="{ item }">
            <VDialog width="1200">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        icon="mdi-pencil"
                        density="comfortable"
                        color="var(--vt-c-blue)"
                        class="text-white"
                    />
                </template>

                <template #default="{ isActive }">
                    <VCard close-on-back contained class="form-wrapper">
                        <VContainer>
                            <VRow justify="end">
                                <VCardActions>
                                    <VBtn
                                        class="ma-2 capitalize-text"
                                        color="var(--vt-c-blue)"
                                        @click="isActive.value = false"
                                        icon="mdi-close"
                                    >
                                    </VBtn>
                                </VCardActions>
                            </VRow>
                        </VContainer>

                        <LoanStatusItemPopup :data="item" :onsubmit="removeLoanFromGrid" />
                    </VCard>
                </template>
            </VDialog>
        </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" rounded="pill">Loan was processed!</v-snackbar>
</template>

<style>
.form-wrapper {
    background-color: var(--vt-c-white-off);
}

.memberdiv {
    margin-top: -7px;
    padding: 0;
}

.officer-profile-btn {
    background-color: rgba(239, 239, 239, 0.525);
    /* border: 1px solid black */
}

.officer-icon-box {
    min-width: 5.5rem;
}

.officer-icon {
    font-size: 4rem;
}

.officer-actions-box {
    gap: 0.5rem;
}

.officer-action-icon {
    font-size: 2rem;
}

.officer-action-icon:hover {
    opacity: 0.65;
}
</style>
