<script setup>
// Packages
import { ref, reactive, computed, watch } from 'vue'
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

const props = defineProps({
    depositID: {
        type: [Number, String],
        default: null
    },
    onsubmit: {
        type: Function,
        default: () => () => null
    },
    runningAmount: {
        type: Number,
        default: 0
    }
})

const formData = reactive({
    ORNumber: '',
    transactionDate: '',
    submissionDate: formatDate(Date.now()),
    transactionType: '',
    amount: 0,
    interest: 0,
    balance: 0,
    officerInCharge: {
        given: currentUserStore.name.given,
        middle: currentUserStore.name.middle,
        last: currentUserStore.name.last
    }
})

// TODO: this throws an error, fix it later
// eslint-disable-next-line vue/return-in-computed-property
const newBalance = computed(() => {
    // Compute the new balance differently depending on whether transaction is deposit or withdrawal
    if (formData.transactionType === 'Deposit' || formData.transactionType === 'deposit') {
        return props.runningAmount + Number(formData.amount) + Number(formData.interest)
    } else if (
        formData.transactionType === 'Withdrawal' ||
        formData.transactionType === 'withdrawal'
    ) {
        return props.runningAmount - Number(formData.amount)
    }
})

const submit = async function () {
    const { valid } = await form.value.validate()
    if (!valid) return

    formData.balance = newBalance

    loading.value = true

    // Convert all empty strings to 0 values for numeric fields
    for (const field of ['amount', 'interest', 'balance']) {
        if (formData[field] === '') {
            formData[field] = 0
        }
    }

    const res = await fetch(`${API_URL}/deposits/${props.depositID}/ledger`, {
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
        props.onsubmit({ ...formData })
        return true
    }
}

watch(
    () => formData.transactionType,
    (transaction) => {
        if (transaction === 'Deposit') {
            formData.amount = 0
        } else if (transaction === 'Withdrawal') {
            formData.amount = 0
            formData.interest = 0
        }
    }
)
</script>

<template>
    <h2 class="header-wrapper pt-3">Add New Transaction</h2>
    <div class="wrapper">
        <!-- Add transaction form -->
        <VForm id="loan-ledger-form" ref="form">
            <!-- Only show form once user has selected transaction type -->

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
            <div class="d-flex flex-row">
                <VTextField
                    class="ml-3"
                    type="date"
                    label="* Date of Entry"
                    v-model="formData.submissionDate"
                    :rules="[FORM_RULES.required]"
                />
                <v-combobox
                    class="ml-3"
                    label="* Officer in Charge"
                    :items="[{}]"
                    v-model="currentUser"
                    :rules="[FORM_RULES.required, rules.isOfficer]"
                    auto-select-first=""
                    disabled="true"
                ></v-combobox>
            </div>
            <VSelect
                class="ml-3"
                label="* Transaction Type"
                v-model="formData.transactionType"
                :items="['Deposit', 'Withdrawal']"
                :rules="[FORM_RULES.required]"
            ></VSelect>

            <div v-if="formData.transactionType !== ''">
                <VTextField
                    class="ml-3"
                    v-number-only
                    type="number"
                    label="Balance (Automatically Calculated)"
                    disabled="true"
                    v-model="newBalance"
                    :rules="[rules.maxDecimalPlaces(2)]"
                    :min="0"
                />

                <!-- Only show interest earned if deposit transaction -->
                <div v-if="formData.transactionType === 'Deposit'">
                    <VTextField
                        v-number-only
                        class="ml-3"
                        type="number"
                        label="Amount"
                        v-model="formData.amount"
                        :rules="[rules.maxDecimalPlaces(2)]"
                        :min="0"
                    />
                    <VTextField
                        v-number-only
                        class="ml-3"
                        type="number"
                        label="Interest Earned"
                        v-model="formData.interest"
                        :rules="[rules.maxDecimalPlaces(2)]"
                    />
                </div>
                <!-- Show different amount fields since deposit amount has no limit, but withdrawal amount does. -->
                <div v-else-if="formData.transactionType === 'Withdrawal'">
                    <VTextField
                        v-number-only
                        class="ml-3"
                        type="number"
                        label="Amount"
                        v-model="formData.amount"
                        :rules="[rules.maxDecimalPlaces(2)]"
                        :min="0"
                        :max="props.runningAmount"
                    />
                </div>
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
