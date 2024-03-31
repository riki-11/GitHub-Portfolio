<script setup>
// Packages
import { ref, onMounted, reactive } from 'vue'

import { formatUTC, formatDate } from '../../modules/datetime/formatDate.js'

// Project constants
import { API_URL, FORM_RULES } from '../../constants/index.js'

// Stylesheets
import 'gridjs/dist/theme/mermaid.css'

// Define constants
const rules = {
    isOfficer: (v) => {
        return (
            officers.map((officer) => officer.title).includes(v.title) ||
            'This field must be a valid officer'
        )
    }
}

const form = ref(null)
const errorAlert = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const props = defineProps({
    depositID: {
        type: [Number, String],
        default: null
    },
    transactionID: {
        type: [Number, String],
        default: null
    },
    onsubmit: {
        type: Function,
        default: () => () => null
    }
})

const formData = reactive({
    ORNumber: '',
    transactionDate: '',
    submissionDate: formatDate(Date.now()),
    depositType: '',
    amount: 0,
    interest: 0,
    balance: 0,
    officerInCharge: ''
})

const officers = reactive([])

const updateAutofill = async function () {
    const res = await fetch(
        `${API_URL}/deposits/${props.depositID}/ledger/${props.transactionID}`,
        {
            credentials: 'omit',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${window.$cookies.get('credentials').token}`
            }
        }
    )

    const jsonData = await res.json()

    if (jsonData.error === false) {
        const transaction = jsonData.transaction
        transaction.transactionDate = formatUTC(transaction.transactionDate)
        transaction.submissionDate = formatUTC(transaction.submissionDate)

        const transactionOfficer = transaction.officerInCharge
        transaction.officerInCharge = {
            title: `${transactionOfficer.last}, ${transactionOfficer.given}`,
            value: transactionOfficer
        }
        Object.assign(formData, transaction)
    }
}

const submit = async function () {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true

    const preprocessedFormData = { ...formData }
    if (
        typeof preprocessedFormData.officerInCharge === 'string' ||
        preprocessedFormData.officerInCharge instanceof String
    ) {
        delete preprocessedFormData.officerInCharge
    } else {
        preprocessedFormData.officerInCharge = { ...preprocessedFormData.officerInCharge.value }
    }

    preprocessedFormData.amountPaid = Number(preprocessedFormData.amountPaid)
    preprocessedFormData.balance = Number(preprocessedFormData.balance)
    preprocessedFormData.interestPaid = Number(preprocessedFormData.interestPaid)
    preprocessedFormData.finesPaid = Number(preprocessedFormData.finesPaid)

    const res = await fetch(
        `${API_URL}/deposits/${props.depositID}/ledger/${props.transactionID}`,
        {
            credentials: 'omit',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${window.$cookies.get('credentials').token}`
            },
            body: JSON.stringify({
                ...preprocessedFormData
            })
        }
    )
    const { error, message } = await res.json()

    loading.value = false

    if (error) {
        errorAlert.value = true
        errorMessage.value = message
        return false
    } else {
        errorAlert.value = false
        errorMessage.value = ''
        props.onsubmit()
        return true
    }
}

onMounted(async () => {
    const officersRes = await fetch(`${API_URL}/officers/`, {
        credentials: 'omit',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    })
    const officersJson = await officersRes.json()

    for (const officer of officersJson.officers) {
        officers.push({
            title: `${officer.name.last}, ${officer.name.given}`,
            value: officer.name
        })
    }

    updateAutofill()
})
</script>

<template>
    <h2 class="header-wrapper">Edit Transaction</h2>
    <div class="wrapper">
        <h3 class="w-100 px-4 mb-3">Current Deposit Data</h3>
        <!-- TODO: Put current loan data table here; display the current so users have reference -->
        <div id="loan-ledger-wrapper" ref="loanLedgerRefTable" class="w-100 px-4"></div>

        <!-- Edit transaction form -->
        <h3 class="w-100 px-4 mb-3 mt-5">Edit the data below</h3>
        <!-- Add transaction form -->
        <VForm id="loan-ledger-form" ref="form">
            <div class="d-flex flex-row">
                <VTextField
                    class="ml-3"
                    type="date"
                    label="* Date of Payment"
                    v-model="formData.transactionDate"
                    :rules="[FORM_RULES.required]"
                />
                <VTextField
                    class="ml-3"
                    label="* GV/OR Number"
                    v-model="formData.ORNumber"
                    :rules="[FORM_RULES.required]"
                />
            </div>
            <VSelect
                class="ml-3"
                label="* Deposit Type"
                v-model="formData.depositType"
                :items="['deposit', 'withdrawal']"
                :rules="[FORM_RULES.required]"
            ></VSelect>
            <VTextField
                v-number-only
                class="ml-3"
                type="number"
                label="Amount"
                v-model="formData.amount"
            />
            <VTextField
                v-number-only
                class="ml-3"
                type="number"
                label="Balance"
                v-model="formData.balance"
            />
            <VTextField
                v-number-only
                class="ml-3"
                type="number"
                label="Interest Paid"
                v-model="formData.interest"
            />
            <div class="d-flex flex-row">
                <VTextField
                    class="ml-3"
                    type="date"
                    label="* Date of Entry"
                    v-model="formData.submissionDate"
                    :rules="[FORM_RULES.required]"
                    disabled
                />
                <v-combobox
                    class="ml-3"
                    label="* Officer in Charge"
                    :items="officers"
                    v-model="formData.officerInCharge"
                    :rules="[FORM_RULES.required, rules.isOfficer]"
                ></v-combobox>
            </div>

            <div class="btn-wrapper">
                <VBtn prepend-icon="mdi-check" class="capitalize btn" @click.prevent="submit">
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
    padding-top: 2%;
    padding-bottom: 3%;
    background-color: var(--vt-c-white);
}
</style>
