<script setup>
// Import packages
import { ref, reactive, onMounted, computed } from 'vue'

// Import constants
import { API_URL, DEPOSIT_CATEGORIES } from '../../constants'

import { formatUTC } from '../../modules/datetime/formatDate.js'

// Import components
import DepositLedgerEdit from './DepositLedgerEdit.vue'
import DepositLedgerAdd from './DepositLedgerAdd.vue'

// Define props for the component
const props = defineProps({
    depositID: {
        type: [Number, String],
        default: null
    }
})

const ledgerData = reactive([])
const isAddPopupActive = ref(false) // for add transaction pop up
const isPopupActive = ref(false) // for edit transaction pop up

const setPopupAdd = () => {
    // database connection stuff
    isAddPopupActive.value = true
}

const search = ref('')
const depositAmount = ref(0)
const depositRunningAmount = ref(0)
const depositOwner = ref('')
const depositType = ref('')
const depositApprovalDate = ref('')
const depositInterestRate = ref(0)

const currentlyEditedTransactionID = ref('')

// Format the deposit amount to PHP standard
const formattedDepositAmount = computed(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(
        depositRunningAmount.value
    )
})

// Format the approval date of the loan
const formattedApprovalDate = computed(() => {
    return formatUTC(depositApprovalDate.value)
})

const capitalLedgerColumns = [
    { title: 'Date of Payment', key: 'transactionDate' },
    { title: 'GV/OR Number', key: 'ORNumber' },
    { title: 'Transaction Type', key: 'transactionType' },
    { title: 'Amount', key: 'amount' },
    { title: 'Interest', key: 'interest' },
    { title: 'Balance', key: 'balance' },
    { title: 'Date of Entry', key: 'submissionDate' },
    { title: 'Officer in Charge', key: 'officerInCharge' }
]

const getDepositInfo = async () => {
    // Fetch loan properties from the database by using the loanID property!
    const jsonRes = await fetch(`${API_URL}/deposits/${props.depositID}`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    }).then((res) => res.json())

    if (jsonRes) {
        const depositData = jsonRes.deposit
        // TEMP: Change this once calculations are implemented
        depositAmount.value = depositData.originalDepositAmount // change to running amount
        depositRunningAmount.value = depositData.runningAmount
        depositOwner.value = depositData.username
        depositType.value = DEPOSIT_CATEGORIES[depositData.category]
        depositApprovalDate.value = depositData.approvalDate
        depositInterestRate.value = depositData.interestRate
    }

    const ledgerRes = await fetch(`${API_URL}/deposits/${props.depositID}/ledger`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    })

    const ledgerJson = await ledgerRes.json()

    ledgerJson.ledger.forEach((transaction) => {
        ledgerData.push({
            transactionDate: formatUTC(transaction.transactionDate),
            ORNumber: transaction.ORNumber,
            transactionType: transaction.transactionType,
            amount: transaction.amount,
            interest: transaction.interest,
            balance: transaction.balance,
            submissionDate: formatUTC(transaction.submissionDate),
            officerInCharge:
                transaction.officerInCharge.given === 'Admin' &&
                transaction.officerInCharge.last === ' '
                    ? 'Admin'
                    : `${transaction.officerInCharge.last}, ${transaction.officerInCharge.given}`
        })
    })
}

// Ideally, we do a fetch request to the database to grab the data.
onMounted(getDepositInfo)
</script>

<template>
    <div class="w-100">
        <div id="loan-info-wrapper" class="d-flex justify-space-between align-center">
            <div id="loan-amount-cell" class="h-75 w-30 pa-2">
                <p class="font-weight-bold">Running Amount:</p>
                <p class="amount">{{ formattedDepositAmount }}</p>
            </div>
            <div class="d-flex justify-space-evenly align-center h-75 pa-2">
                <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-2">
                    <p class="font-weight-bold">Deposit ID:</p>
                    <p class="loan-properties">{{ depositID }}</p>
                </div>
                <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-2">
                    <p class="font-weight-bold">Type of Deposit:</p>
                    <p class="loan-properties">{{ depositType }}</p>
                </div>
                <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-4">
                    <p class="font-weight-bold">Date of Deposit:</p>
                    <p class="loan-properties">{{ formattedApprovalDate }}</p>
                </div>
            </div>
        </div>

        <v-divider :thickness="1" class="mt-3 mb-3 border-opacity-70" />

        <!-- Ledger -->
        <v-data-table
            :headers="capitalLedgerColumns"
            :items="ledgerData"
            hover=""
            multi-sort=""
            :search="search"
            sticky=""
        >
        </v-data-table>

        <VBtn
            @click="setPopupAdd"
            block
            size="large"
            density="compact"
            rounded="lg"
            prepend-icon="mdi-plus-circle"
            class="capitalize btn"
        >
            Add New Transaction
        </VBtn>

        <!-- Form popup for ADD TRANSACTION -->
        <VDialog width="1000" v-model="isAddPopupActive">
            <template #default="{ isActive }">
                <VCard close-on-back contained class="form-wrapper">
                    <VContainer fluid>
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

                    <DepositLedgerAdd
                        :depositID="depositID"
                        :onsubmit="
                            async (newTx) => {
                                ledgerData.push(newTx)
                                isActive.value = false
                                depositRunningAmount = newTx.balance
                            }
                        "
                        :runningAmount="depositRunningAmount"
                    />
                </VCard>
            </template>
        </VDialog>

        <!-- Form popup for EDIT TRANSACTION-->
        <VDialog width="1000" v-model="isPopupActive">
            <template #default="{ isActive }">
                <VCard close-on-back contained class="form-wrapper">
                    <VContainer fluid>
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

                    <DepositLedgerEdit
                        :depositID="depositID"
                        :transactionID="currentlyEditedTransactionID"
                        :onsubmit="
                            async () => {
                                await getDepositInfo()
                                isActive.value = false
                            }
                        "
                    />
                </VCard>
            </template>
        </VDialog>
    </div>
</template>

<style scoped>
.btn {
    padding: 1.2%;
    color: var(--vt-c-white-off);
    background: var(--vt-c-blue);
    border-radius: 5px;
    text-transform: capitalize;
}

.btn:hover {
    background: var(--vt-c-blue-dark);
}

.grid-x-borders {
    border-top: none;
    border-bottom: none;
    border-right: solid 1px solid #e5e7eb;
    border-left: solid 1px solid #e5e7eb;
}

.grid-left-border {
    border-left: solid 1px #e5e7eb;
}

.grid-right-border {
    border-right: solid 1px #e5e7eb;
}

.loan-info-cell {
    min-width: 150px;
}

.loan-info-wrapper {
    background-color: var(--vt-c-white-off);
}

.amount {
    font-size: 2.5rem;
}

.loan-properties {
    font-size: 1.25rem;
}

.gap-1 {
    gap: 1rem;
}

.gridjs-th {
    white-space: normal;
}
</style>
