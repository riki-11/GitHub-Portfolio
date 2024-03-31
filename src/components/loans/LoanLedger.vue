<script setup>
// Import packages
import { ref, onMounted, computed, reactive } from 'vue'

// Import constants
import { API_URL, LOAN_TYPES } from '../../constants'

// Import components
import LoanLedgerAdd from './LoanLedgerAdd.vue'
import LoanEdit from './LoanInfoEdit.vue'
import DeletePrompt from '../DeletePrompt.vue'
import LoanStatusEdit from './LoanStatusEdit.vue'

import router from '../../router/index.js'

import { formatUTC } from '../../modules/datetime/formatDate.js'

// Define props for the component
const props = defineProps({
    loanID: {
        type: [Number, String],
        default: null
    }
})

const search = ref('')
const ledgerData = reactive([])
const isAddPopupActive = ref(false) // for add transaction pop up
const originalLoanAmount = ref(0) // for dynamically calculating balance in form
const balance = ref(0)

const rawLoanData = ref()

const formData = reactive({
    amount: 0,
    loanee: '',
    type: '',
    term: '',
    paymentFrequency: '',
    totalAmountPaid: 0,
    coborrowerName: '',
    approvalDate: '',
    coborrower: {
        name: {
            given: '',
            middle: '',
            last: ''
        },
        birthday: '',
        birthplace: '',
        occupation: '',
        contact_no: ''
    }
})

// Format the loan amount to PHP standard
const formattedLoanAmount = computed(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(
        formData.amount
    )
})

// Format the current balance to PHP standard
const formattedBalance = computed(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(
        balance.value
    )
})

const headers = [
    { title: 'Date of Transaction', key: 'transactionDate' },
    { title: 'GV/OR Number', key: 'ORNumber' },
    { title: 'Amount Due', key: 'amountDue' },
    { title: 'Amount Paid', key: 'amountPaid' },
    { title: 'Balance', key: 'balance' },
    { title: 'Interest Due', key: 'interestDue' },
    { title: 'Interest Paid', key: 'interestPaid' },
    { title: 'Fines Due', key: 'finesDue' },
    { title: 'Fines Paid', key: 'finesPaid' },
    { title: 'Date of Entry', key: 'submissionDate' },
    { title: 'Officer in Charge', key: 'officerInCharge' }
]

const setPopupAdd = () => {
    isAddPopupActive.value = true
}

const getLoanInfo = async () => {
    // Fetch loan properties from the database by using the loanID property!
    const resJson = await fetch(`${API_URL}/loans/${props.loanID}`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    }).then((res) => res.json())

    if (resJson) {
        const loanData = resJson.loan
        rawLoanData.value = loanData

        // Also assign the original loan amount to the reactive variable
        originalLoanAmount.value = loanData.originalLoanAmount

        // Store value of balance
        balance.value = loanData.balance

        formData.amount = loanData.originalLoanAmount
        formData.loanee = loanData.username
        formData.type = LOAN_TYPES[loanData.loanType]
        formData.term = loanData.term
        formData.paymentFrequency =
            loanData.paymentFrequency.substring(0, 1).toUpperCase() +
            loanData.paymentFrequency.substring(1)
        formData.approvalDate = formatUTC(loanData.approvalDate)
        if (loanData.coborrower) {
            formData.coborrowerName = `${loanData.coborrower.name.last}, ${loanData.coborrower.name.given}`
        } else {
            formData.coborrowerName = 'No coborrower'
        }
        formData.status = loanData.status
    }

    const ledgerRes = await fetch(`${API_URL}/loans/${props.loanID}/ledger`, {
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
            amountDue: transaction.amountDue,
            amountPaid: transaction.amountPaid,
            balance: transaction.balance,
            interestDue: transaction.interestDue,
            interestPaid: transaction.interestPaid,
            finesDue: transaction.finesDue,
            finesPaid: transaction.finesPaid,
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
onMounted(getLoanInfo)
</script>

<template>
    <div class="w-100 d-flex flex-column">
        <div id="loan-info-wrapper" class="d-flex justify-space-between">
            <!-- Left -->
            <div id="loan-amount-cell" class="d-flex flex-column h-75 w-30 pa-2">
                <div>
                    <p>Outstanding Balance:</p>
                    <p class="loan-amount">{{ formattedBalance }}</p>
                </div>
                <p>Original Loan Amount: {{ formattedLoanAmount }}</p>
                <!-- TODO: remove this! -->
                <div class="d-flex flex-row">
                    <p>Loanee:</p>
                    <p class="font-weight-bold ml-3">{{ formData.loanee }}</p>
                </div>
                <div class="d-flex flex-row">
                    <p>Loan ID:</p>
                    <p class="font-weight-bold ml-3">{{ loanID }}</p>
                </div>
            </div>

            <!-- Right -->
            <div class="d-flex flex-column align-end justify-space-between">
                <div class="d-flex justify-space-evenly align-center pa-2">
                    <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-4">
                        <p>Loan Approval Date:</p>
                        <p class="font-weight-bold text-capitalize">
                            {{ formData.approvalDate }}
                        </p>
                    </div>
                    <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-4">
                        <p>Type of Loan:</p>
                        <p class="font-weight-bold text-capitalize">{{ formData.type }}</p>
                    </div>
                    <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-4">
                        <p>Term of Loan:</p>
                        <p class="font-weight-bold text-capitalize">{{ formData.term }}</p>
                    </div>
                    <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-4">
                        <p>Mode of Payment:</p>
                        <p class="font-weight-bold text-capitalize">
                            {{ formData.paymentFrequency }}
                        </p>
                    </div>
                    <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-4">
                        <p>Coborrower Name:</p>
                        <p class="font-weight-bold text-capitalize">
                            {{ formData.coborrowerName }}
                        </p>
                    </div>
                    <div class="d-flex flex-column loan-info-cell grid-left-border h-100 px-4">
                        <p>Status:</p>
                        <p class="font-weight-bold text-capitalize">
                            {{ formData.status }}
                        </p>
                    </div>
                </div>

                <div class="d-flex">
                    <!-- Mark Loan as Complete -->
                    <v-dialog width="1200">
                        <template #activator="{ props }">
                            <v-btn
                                v-if="formData.status === 'released'"
                                prepend-icon="mdi-check-underline-circle-outline"
                                class="edit-loan-btn capitalize mr-2 text-white"
                                v-bind="props"
                                text="Mark Loan as Complete"
                                color="success"
                            >
                            </v-btn>
                        </template>

                        <!-- Form popup -->
                        <template #default="{ isActive }">
                            <v-card close-on-back contained class="form-wrapper">
                                <v-container>
                                    <v-row justify="end">
                                        <v-card-actions>
                                            <v-btn
                                                class="ma-2 capitalize-text"
                                                color="var(--vt-c-blue)"
                                                @click="isActive.value = false"
                                                icon="mdi-close"
                                            >
                                            </v-btn>
                                        </v-card-actions>
                                    </v-row>
                                </v-container>
                                <LoanStatusEdit
                                    :loanID="loanID"
                                    :message="'complete?'"
                                    :onsubmit="
                                        () => {
                                            formData.status = 'complete'
                                            isActive.value = false
                                        }
                                    "
                                />
                            </v-card>
                        </template>
                    </v-dialog>

                    <!-- Mark Loan as Released -->
                    <v-dialog width="1200">
                        <template #activator="{ props }">
                            <v-btn
                                v-if="formData.status === 'approved'"
                                prepend-icon="mdi-check-underline-circle-outline"
                                class="edit-loan-btn capitalize mr-2 text-white"
                                v-bind="props"
                                text="Mark Loan as Released"
                                color="var(--vt-c-blue-very-dark)"
                            >
                            </v-btn>
                        </template>

                        <!-- Form popup -->
                        <template #default="{ isActive }">
                            <v-card close-on-back contained class="form-wrapper">
                                <v-container>
                                    <v-row justify="end">
                                        <v-card-actions>
                                            <v-btn
                                                class="ma-2 capitalize-text"
                                                color="var(--vt-c-blue)"
                                                @click="isActive.value = false"
                                                icon="mdi-close"
                                            >
                                            </v-btn>
                                        </v-card-actions>
                                    </v-row>
                                </v-container>
                                <LoanStatusEdit
                                    :loanID="loanID"
                                    :message="'released?'"
                                    :onsubmit="
                                        () => {
                                            formData.status = 'released'
                                            isActive.value = false
                                        }
                                    "
                                />
                            </v-card>
                        </template>
                    </v-dialog>

                    <!-- Edit Loan -->
                    <v-dialog width="1200">
                        <template #activator="{ props }">
                            <v-btn
                                prepend-icon="mdi-square-edit-outline"
                                class="edit-loan-btn capitalize mr-2 text-white"
                                v-bind="props"
                                text="Edit Loan"
                                color="var(--vt-c-blue)"
                            >
                            </v-btn>
                        </template>

                        <!-- Form popup -->
                        <template #default="{ isActive }">
                            <v-card close-on-back contained class="form-wrapper">
                                <v-container>
                                    <v-row justify="end">
                                        <v-card-actions>
                                            <v-btn
                                                class="ma-2 capitalize-text"
                                                color="var(--vt-c-blue)"
                                                @click="isActive.value = false"
                                                icon="mdi-close"
                                            >
                                            </v-btn>
                                        </v-card-actions>
                                    </v-row>
                                </v-container>
                                <LoanEdit
                                    :loanID="loanID"
                                    :autofill="rawLoanData"
                                    :onsubmit="
                                        async () => {
                                            await getLoanInfo()
                                            isActive.value = false
                                        }
                                    "
                                />
                            </v-card>
                        </template>
                    </v-dialog>

                    <!-- Delete Loan -->
                    <v-dialog width="600">
                        <template #activator="{ props }">
                            <v-btn
                                prepend-icon="mdi-trash-can-outline"
                                class="edit-loan-btn capitalize mr-2"
                                v-bind="props"
                                text="Delete Loan"
                                color="error"
                            >
                            </v-btn>
                        </template>

                        <!-- Form popup -->
                        <template #default="{ isActive }">
                            <v-card close-on-back contained class="form-wrapper">
                                <v-container>
                                    <v-row justify="end">
                                        <v-card-actions>
                                            <v-btn
                                                class="ma-2 capitalize-text"
                                                color="var(--vt-c-blue)"
                                                @click="isActive.value = false"
                                                icon="mdi-close"
                                            >
                                            </v-btn>
                                        </v-card-actions>
                                    </v-row>
                                </v-container>

                                <DeletePrompt
                                    profileType="Loan"
                                    :identifier="loanID"
                                    :onsubmit="
                                        async () => {
                                            isActive.value = false
                                            router.push({ name: 'Loan Dashboard' })
                                        }
                                    "
                                />
                            </v-card>
                        </template>
                    </v-dialog>
                </div>
            </div>
        </div>

        <v-divider :thickness="1" class="mt-3 mb-3 border-opacity-70" />

        <!-- Ledger -->
        <v-data-table
            :headers="headers"
            :items="ledgerData"
            hover=""
            multi-sort=""
            :search="search"
            sticky=""
        >
        </v-data-table>
        <VBtn
            @click="setPopupAdd"
            block=""
            size="large"
            density="compact"
            rounded="lg"
            prepend-icon="mdi-plus-circle"
            class="capitalize btn"
            :disabled="formData.status !== 'released'"
        >
            Add New Transaction
        </VBtn>

        <!-- ADD A "Mark Loan as Paid" button?? -->

        <!-- Form popup for ADD TRANSACTION -->
        <VDialog width="1000" v-model="isAddPopupActive">
            <template #default="{ isActive }">
                <VCard close-on-back contained class="form-wrapper">
                    <VContainer fluid="">
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

                    <LoanLedgerAdd
                        :loanID="loanID"
                        :onsubmit="
                            async (newTx) => {
                                ledgerData.push(newTx)
                                isActive.value = false
                                console.log(newTx.balance)
                                balance = newTx.balance
                            }
                        "
                        :originalLoanAmount="originalLoanAmount"
                        :balance="balance"
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

.loan-amount {
    font-size: 2.5rem;
}

.loan-properties {
    font-size: 1.3em;
}

.gap-1 {
    gap: 1rem;
}

th.gridjs-th {
}

th .gridjs-th {
    white-space: normal;
    min-width: 500px;
}
</style>
