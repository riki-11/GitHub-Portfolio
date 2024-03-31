<script setup>
// Packages
import { ref, reactive } from 'vue'
import { formatDate } from '../../modules/datetime/formatDate.js'

// Router
import router from '../../router/index.js'

// Project constants
import { API_URL, DEPOSIT_CATEGORIES, FORM_RULES } from '../../constants/index.js'

// Stores
import { useMemberSearchStore } from '../../stores/memberSearch.js'
const memberSearchStore = useMemberSearchStore()

// Define constants
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

// Reactive variables
const depositData = reactive({
    approvalDate: formatDate(Date.now()),
    category: '',
    originalDepositAmount: '',
    runningAmount: 0,
    interestRate: ''
})

const form = ref(null)
const disableSubmit = ref(false)
const errorAlert = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const snackbar = ref(false)

const depositCategories = reactive(
    Object.keys(DEPOSIT_CATEGORIES).map((key) => {
        return {
            title: DEPOSIT_CATEGORIES[key],
            value: key
        }
    })
)

//Methods
const submit = async function () {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true

    // Upon creating a new deposit, make the running amount equal to the origina deposit amount
    depositData.runningAmount = depositData.originalDepositAmount

    const res = await fetch(`${API_URL}/deposits/user/${memberSearchStore.data.username}`, {
        credentials: 'omit',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        },
        body: JSON.stringify({
            ...depositData,
            username: memberSearchStore.data.username
        })
    })

    loading.value = false

    if (res.status === 404) {
        errorAlert.value = true
        errorMessage.value =
            'An error occurred, please go back to member search screen (Step 1) and try again'
        return false
    }

    const { error, message } = await res.json()

    if (error) {
        errorAlert.value = true
        errorMessage.value = message
        return false
    } else {
        errorAlert.value = false
        errorMessage.value = ''
        disableSubmit.value = true
        snackbar.value = true
        router.go()
    }
}
</script>

<template>
    <h2 class="header-wrapper pt-3">Enter Deposit Information</h2>
    <div class="wrapper">
        <!-- Deposit form -->
        <VForm id="deposit-form" ref="form">
            <v-select
                class="ml-3"
                label="* Deposit Category"
                :items="depositCategories"
                v-model="depositData.category"
                :rules="[FORM_RULES.required]"
            ></v-select>

            <VTextField
                type="date"
                label="* Approval Date"
                class="ml-3"
                v-model="depositData.approvalDate"
                :rules="[FORM_RULES.required]"
            ></VTextField>

            <VTextField
                v-number-only
                class="ml-3"
                label="* Deposit Amount"
                v-model="depositData.originalDepositAmount"
                type="number"
                :min="0"
                :rules="[FORM_RULES.required, rules.maxDecimalPlaces(2)]"
            />

            <div class="btn-wrapper">
                <VBtn
                    prepend-icon="mdi-check"
                    class="capitalize btn"
                    :loading="loading"
                    @click.prevent="submit"
                    :disabled="disableSubmit"
                >
                    {{ disableSubmit ? 'Submitted' : 'Submit' }}
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
        <v-snackbar v-model="snackbar" rounded="pill"
            >Deposit successfully added!
            <template #actions>
                <v-btn :to="{ name: 'Deposit Dashboard' }" variant="text" color="blue"
                    >Go to Deposit Dashboard</v-btn
                >
            </template>
        </v-snackbar>
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
