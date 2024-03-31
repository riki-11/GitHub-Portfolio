<script setup>
// Import packages
import { ref, reactive } from 'vue'

// Import router
import router from '../../router/index.js'

// Import constants
import { LOAN_TYPES, PAYMENT_FREQUENCIES, FORM_RULES } from '../../constants/index.js'

// Import stores
import { useApplicationFormStore } from '../../stores/applicationForm.js'
const appFormStore = useApplicationFormStore()

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

// Define reactive variables
const errorAlert = ref(false)
const errorMessage = ref('')
const form = ref(null)
const hasCoborrower = ref(false)

// Define form fields
const loanData = reactive({
    date: '',
    classification: '',
    term: '',
    type: '',
    paymentFrequency: '',
    amount: 0,
    minAmount: 0,
    maxAmount: 0,
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

// Define Loan types
const loanTypes = reactive(
    Object.keys(LOAN_TYPES).map((key) => {
        return {
            title: LOAN_TYPES[key],
            value: key
        }
    })
)

// Define methods
/**
 * Saves form data to the application form store.
 * @returns {Promise<void>}
 */
const prefillForm = async function () {
    // Check if form is valid
    const { valid } = await form.value.validate()
    if (!valid) return

    // Save data to store
    appFormStore.setLoanData(loanData)

    // Send to application details page
    await router.push({ name: 'Export Application Form' })
}
</script>

<template>
    <div class="info-fields">
        <div class="form-wrapper">
            <VForm id="login-form" ref="form">
                <div class="header2">Loan Information</div>

                <!-- Loan Classification -->

                <div class="row-tab">
                    <div class="label">
                        <div>* Classification:</div>
                    </div>

                    <VRadioGroup
                        v-model="loanData.classification"
                        id="loan-classification"
                        :rules="[FORM_RULES.required]"
                        class="mt-2"
                    >
                        <VRadio label="New Loan" value="new"></VRadio>
                        <VRadio label="Renewal" value="renewal"></VRadio>
                    </VRadioGroup>
                </div>

                <!-- Term of Loan -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Term:</div>
                    </div>
                    <VTextField
                        type="number"
                        v-number-only
                        class="username-pw-input"
                        v-model="loanData.term"
                        :rules="[FORM_RULES.required]"
                        label="Enter Term of Loan"
                    />
                </div>

                <!-- Mode of Repayment -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Mode of Repayment:</div>
                    </div>
                    <VSelect
                        class="username-pw-input"
                        v-model="loanData.paymentFrequency"
                        :items="PAYMENT_FREQUENCIES"
                        id="payment-frequency"
                        :rules="[FORM_RULES.required]"
                        label="Mode of Repayment"
                    />
                </div>

                <!-- Type of Loan -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Type:</div>
                    </div>

                    <VSelect
                        class="username-pw-input"
                        v-model="loanData.type"
                        :items="loanTypes"
                        id="loan-type"
                        :rules="[FORM_RULES.required]"
                        label="Select Loan Type"
                    />
                </div>

                <VExpandTransition>
                    <div v-if="loanData.type !== ''" class="row-tab">
                        <div class="label">
                            <div>* Amount:</div>
                        </div>

                        <div style="width: 68%">
                            <VTextField
                                v-number-only
                                type="number"
                                v-model="loanData.amount"
                                id="loan-amount"
                                :rules="[
                                    FORM_RULES.required,
                                    (v) => {
                                        if (v <= loanData.minAmount) {
                                            return `Amount must be greater than ${loanData.minAmount}`
                                        }
                                        return true
                                    },
                                    rules.maxDecimalPlaces(2)
                                ]"
                                label="Enter Loan Amount"
                                :min="0"
                                :step="100"
                            />
                        </div>
                    </div>
                </VExpandTransition>

                <div class="row-tab">
                    <div class="label">
                        <div>Coborrower Needed?</div>
                    </div>
                    <VCheckbox v-model="hasCoborrower"></VCheckbox>
                </div>

                <!-- Coborrower Information -->
                <VExpandTransition>
                    <div v-if="hasCoborrower">
                        <div class="header2">Coborrower's Information</div>

                        <div class="row-tab">
                            <div class="label">
                                <div>* Coborrower First Name:</div>
                            </div>
                            <VTextField
                                class="username-pw-input"
                                v-model="loanData.coborrower.name.given"
                                :rules="[FORM_RULES.required]"
                                label="Enter Coborrower First Name"
                            />
                        </div>
                        <div class="row-tab">
                            <div class="label">
                                <div>Coborrower Middle Name:</div>
                            </div>
                            <VTextField
                                class="username-pw-input"
                                v-model="loanData.coborrower.name.middle"
                                :rules="[FORM_RULES.required]"
                                label="Enter Coborrower Middle Name"
                            />
                        </div>
                        <div class="row-tab">
                            <div class="label">
                                <div>* Coborrower Last Name:</div>
                            </div>
                            <VTextField
                                class="username-pw-input"
                                v-model="loanData.coborrower.name.last"
                                :rules="[FORM_RULES.required]"
                                label="Enter Coborrower Last Name"
                            />
                        </div>
                        <div class="row-tab">
                            <div class="label">
                                <div>* Coborrower Date of Birth:</div>
                            </div>
                            <VTextField
                                class="username-pw-input"
                                v-model="loanData.coborrower.birthday"
                                type="date"
                                :rules="[FORM_RULES.required]"
                                label="Enter Coborrower Date of Birth"
                            />
                        </div>
                        <div class="row-tab">
                            <div class="label">
                                <div>* Coborrower Place of Birth:</div>
                            </div>
                            <VTextField
                                class="username-pw-input"
                                v-model="loanData.coborrower.birthplace"
                                :rules="[FORM_RULES.required]"
                                label="Enter Coborrower Place of Birth"
                            />
                        </div>
                        <div class="row-tab">
                            <div class="label">
                                <div>* Coborrower Occupation/Source of Income:</div>
                            </div>
                            <VTextField
                                class="username-pw-input"
                                v-model="loanData.coborrower.occupation"
                                :rules="[FORM_RULES.required]"
                                label="Enter Coborrower Occupation/Source of Income"
                            />
                        </div>
                        <div class="row-tab">
                            <div class="label">
                                <div>* Coborrower Contact Number:</div>
                            </div>
                            <VTextField
                                class="username-pw-input"
                                v-model="loanData.coborrower.contact_no"
                                :rules="[FORM_RULES.required]"
                                label="Enter Coborrower Contact Number"
                            />
                        </div>
                    </div>
                </VExpandTransition>

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

                <div class="btn-wrapper">
                    <VBtn type="submit" class="btn capitalize-text" @click.prevent="prefillForm">
                        Submit and Generate PDF
                    </VBtn>
                </div>
            </VForm>
        </div>
    </div>
</template>

<!-- Stylesheet -->
<style scoped>
.bg {
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    z-index: 9999;

    background-color: rgba(0, 0, 0, 0.5);
}

.form-wrapper {
    background: var(--vt-c-white);
}

.header2 {
    font-size: 1.2rem;
    margin-bottom: 3%;
    font-weight: bold;
}

.info-fields {
    padding: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    overflow: auto;
    /* border: 1px solid black; */
}

.error-msg-wrapper {
    width: 100%;
    height: 7vh;
    position: absolute;
    z-index: 999;
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
    width: 30%;

    display: inline-block;
    text-align: right;
    vertical-align: top;
}

.btn {
    color: var(--vt-c-white-off);
    font-weight: 600;
    background: var(--vt-c-blue);

    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-wrapper {
    height: min-content;
    display: flex;
    justify-content: flex-end;
    margin-top: 2%;
}

.capitalize-text {
    text-transform: capitalize;
}

.btn:hover {
    background: var(--vt-c-blue-dark);
}

.rememberMe {
    font-size: 0.9em;
    color: var(--primary-color-jade);
    font-weight: 500;
    margin: -15px 2 15px;
    display: flex;
    justify-content: right;
    margin-top: 5px;
    margin-bottom: 20px;
}

.error {
    display: flex;
    font-size: 0.9em;
    text-align: center;
    color: red;
    font-weight: 400;
    margin: 25px 1 10px;
    justify-content: center;
}
</style>
