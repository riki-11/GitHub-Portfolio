<script setup>
// Packages
import { ref, watch, reactive, computed } from 'vue'
import Decimal from 'decimal.js'
import { formatDate } from '../../modules/datetime/formatDate.js'

// Project constants
import { API_URL, FORM_RULES } from '../../constants/index.js'

// Stores
import { useCurrentUserStore } from '../../stores/currentUser.js'
const currentUserStore = useCurrentUserStore()

// Define constants
const currentUser = {
    title:
        currentUserStore.username === 'admin'
            ? 'Admin'
            : `${currentUserStore.name.last}, ${currentUserStore.name.given}`,
    value: {
        given: currentUserStore.name.given,
        middle: currentUserStore.name.middle,
        last: currentUserStore.name.last
    }
}

const rules = {
    maxDecimalPlaces: (decimalPlaces) => {
        return (v) =>
            ((v) => {
                v = parseFloat(v)
                if (!v) return 0
                if (Math.floor(v) === v) return 0
                return v.toString().split('.')[1].length || 0
            })(v) <= decimalPlaces || `Must not have more than ${decimalPlaces} decimal places`
    }
}

const form = ref(null)
const errorAlert = ref(false)
const errorMessage = ref('')
const loading = ref(false)

// Props
const props = defineProps({
    loanID: {
        type: [Number, String],
        default: null
    },
    onsubmit: {
        type: Function,
        default: () => () => null
    },
    originalLoanAmount: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    }
})

const formData = reactive({
    transactionDate: '',
    ORNumber: '',
    amountDue: 0,
    amountPaid: 0,
    balance: props.balance,
    interestDue: 0,
    interestPaid: 0,
    finesDue: 0,
    finesPaid: 0,
    submissionDate: formatDate(Date.now()),
    officerInCharge: {
        given: currentUserStore.name.given,
        middle: currentUserStore.name.middle,
        last: currentUserStore.name.last
    },
    transactionType: ''
})

const newBalance = computed(() => {
    const dues = Decimal(formData.interestDue || 0).add(formData.finesDue || 0)
    const payments = Decimal(formData.amountPaid || 0)
        .add(formData.interestPaid || 0)
        .add(formData.finesPaid || 0)

    return parseFloat(Decimal(props.balance).sub(payments).add(dues))
})

function getAmountDue(interestDue, finesDue) {
    interestDue = Decimal(interestDue || 0)
    finesDue = Decimal(finesDue || 0)

    return parseFloat(interestDue.add(finesDue))
}

const submit = async function () {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true

    // If transaction is NOT readjustment
    if (formData.transactionType !== 'readjustment') {
        // Update balance to match that of form input
        formData.balance = newBalance
    }

    formData.amountDue = getAmountDue(formData.interestDue, formData.finesDue)

    // Convert all empty strings to 0 values for numeric fields
    for (const field of [
        'amountDue',
        'amountPaid',
        'interestDue',
        'interestPaid',
        'finesDue',
        'finesPaid'
    ]) {
        if (formData[field] === '') {
            formData[field] = 0
        }
    }

    const res = await fetch(`${API_URL}/loans/${props.loanID}/ledger`, {
        credentials: 'omit',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        },
        body: JSON.stringify(formData)
    })
    const { error, message } = await res.json()

    loading.value = false

    if (error) {
        errorAlert.value = true
        errorMessage.value = message
        return false
    } else {
        errorAlert.value = false
        errorMessage.value = ''
        formData.officerInCharge = currentUser.title
        props.onsubmit({ ...formData }, newBalance)
    }
}

// Watch the transaction type to reset formData back to default if switching transaction type
watch(
    () => formData.transactionType,
    (transaction) => {
        // If selected transaction is payments
        if (transaction === 'payments') {
            formData.amountPaid = 0
            formData.amountDue = 0
            formData.interestDue = 0
            formData.balance = props.balance
            formData.payment = true
            formData.dues = false
        } else if (transaction === 'dues') {
            formData.amountPaid = 0
            formData.interestPaid = 0
            formData.finesPaid = 0
            formData.balance = props.balance
            formData.payment = false
            formData.dues = true
        } else if (transaction === 'readjustment') {
            formData.balance = props.balance
            formData.amountDue = 0
            formData.amountPaid = 0
            formData.interestDue = 0
            formData.interestPaid = 0
            formData.finesPaid = 0
        }
    }
)
</script>

<template>
    <h2 class="header-wrapper pt-3">Add New Transaction</h2>
    <div class="wrapper">
        <!-- Add transaction form -->
        <VForm id="loan-ledger-form" ref="form">
            <h2 class="ml-3 py-3">Transaction Type</h2>
            <div class="d-flex justify-center w-100">
                <v-radio-group v-model="formData.transactionType" inline="">
                    <v-radio label="Payment" value="payment"></v-radio>
                    <v-radio label="Dues" value="dues"></v-radio>
                    <v-radio label="Balance Readjustment" value="readjustment"></v-radio>
                </v-radio-group>
            </div>

            <!-- Only show form once user has selected transaction type -->
            <div v-if="formData.transactionType !== ''">
                <div class="d-flex flex-row mb-3">
                    <VTextField
                        class="ml-3"
                        type="date"
                        label="* Date of Payment"
                        v-model="formData.transactionDate"
                        :rules="[FORM_RULES.required]"
                        hint="When was the payment made?"
                        persistent-hint=""
                    />
                    <VTextField
                        class="ml-3"
                        label="* GV/OR Number"
                        v-model="formData.ORNumber"
                        :rules="[FORM_RULES.required]"
                    />
                </div>
                <div class="d-flex flex-row">
                    <VTextField
                        class="ml-3"
                        type="date"
                        label="* Date of Entry"
                        v-model="formData.submissionDate"
                        :rules="[FORM_RULES.required]"
                        hint="When is this entry being created?"
                        persistent-hint=""
                    />
                    <v-combobox
                        class="ml-3"
                        label="* Officer in Charge"
                        :items="[{}]"
                        v-model="currentUser"
                        :rules="[FORM_RULES.required]"
                        hint="Which Loan Officer/Administrator is handling this loan?"
                        persistent-hint=""
                        auto-select-first=""
                        disabled="true"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props">
                                <v-list-item-title>
                                    {{ currentUserStore.name.last }},
                                    {{ currentUserStore.name.given }}
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-combobox>
                </div>

                <!-- Only show payments if Payments is Selected -->
                <div v-if="formData.transactionType === 'payment'">
                    <h3 class="ml-3 py-3">Payments</h3>
                    <VTextField
                        class="ml-3"
                        v-number-only
                        type="number"
                        label="Balance (Automatically Calculated)"
                        disabled="true"
                        v-model="newBalance"
                        :min="0"
                    />
                    <VTextField
                        class="ml-3"
                        v-number-only
                        type="number"
                        label="Amount Paid"
                        v-model="formData.amountPaid"
                        :rules="[rules.maxDecimalPlaces(2)]"
                        :min="0"
                        :max="props.balance"
                    />
                    <VTextField
                        class="ml-3"
                        v-number-only
                        type="number"
                        label="Interest Paid"
                        v-model="formData.interestPaid"
                        :rules="[rules.maxDecimalPlaces(2)]"
                        :min="0"
                    />

                    <!-- Fines Paid -->
                    <VTextField
                        class="ml-3"
                        v-number-only
                        type="number"
                        label="Fines Paid"
                        v-model="formData.finesPaid"
                        :rules="[rules.maxDecimalPlaces(2)]"
                        :min="0"
                    />
                </div>

                <!-- Only show dues if Due is selected -->
                <div v-if="formData.transactionType === 'dues'">
                    <!-- Only show dues if Fine/Interest is selected -->
                    <h3 class="ml-3 py-3">Dues</h3>
                    <VTextField
                        class="ml-3"
                        v-number-only
                        type="number"
                        label="Interest Due"
                        v-model="formData.interestDue"
                        :rules="[rules.maxDecimalPlaces(2)]"
                        :min="0"
                    />

                    <VTextField
                        class="ml-3"
                        v-number-only
                        type="number"
                        label="Fines Due"
                        v-model="formData.finesDue"
                        :rules="[rules.maxDecimalPlaces(2)]"
                        :min="0"
                    />
                </div>

                <div v-if="formData.transactionType === 'readjustment'">
                    <h3 class="ml-3 py-3">Balance Readjustment</h3>
                    <VTextField
                        class="ml-3"
                        v-number-only
                        type="number"
                        label="New Balance"
                        v-model="formData.balance"
                        :min="0"
                        :max="props.originalLoanAmount"
                        :rules="[rules.maxDecimalPlaces(2)]"
                    />
                </div>
                <div class="btn-wrapper">
                    <VBtn
                        prepend-icon="mdi-check"
                        class="capitalize btn"
                        :loading="loading"
                        @click.prevent="submit"
                    >
                        Submit
                    </VBtn>
                </div>

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
            </div>
        </VForm>
    </div>
</template>

<style scoped>
.btn {
    font-weight: 600;
    color: var(--vt-c-white-off);
    background: var(--vt-c-blue);

    display: flex;
    align-items: center;
    text-align: center;

    border-radius: 5px;
    text-transform: capitalize;
}

.btn-wrapper {
    height: min-content;
    display: flex;
    justify-content: flex-end;
}
.btn:hover {
    background: var(--vt-c-blue-dark);
}
.header-wrapper {
    padding-left: 7%;
    padding-bottom: 2%;
}

.row-tab {
    /* border: 1px solid black; */
    display: flex;
    margin-bottom: 1%;
}

.label {
    margin-top: 15px;
    margin-right: 2%;
    /* border: 1px solid black; */
    width: 10%;

    display: inline-block;
    text-align: right;
    vertical-align: top;
}

.wrapper {
    padding: 6%;
    padding-top: 1%;
    padding-bottom: 3%;
    background-color: var(--vt-c-white);
}
</style>
