<script setup>
// Packages
import { reactive, ref, onMounted } from 'vue'

import { formatUTC } from '../../modules/datetime/formatDate.js'

// Project constants
import { LOAN_TYPES, PAYMENT_FREQUENCIES, API_URL, FORM_RULES } from '../../constants/index.js'

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
    autofill: {
        type: Object
    }
})

// Reactive variables
const hasCoborrower = ref(false)
const errorAlert = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const form = ref(null)

const loanTypes = reactive(
    Object.keys(LOAN_TYPES).map((key) => {
        return {
            title: LOAN_TYPES[key],
            value: key
        }
    })
)

const formData = reactive({
    type: '',
    term: '',
    paymentFrequency: '',
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

// Methods
const updateAutofill = function () {
    formData.type = props.autofill.loanType
    formData.term = props.autofill.term
    formData.paymentFrequency = props.autofill.paymentFrequency

    if (props.autofill.coborrower) {
        Object.assign(formData.coborrower.name, props.autofill.coborrower.name)
        formData.coborrower.birthday = formatUTC(props.autofill.coborrower.birthday)
        formData.coborrower.birthplace = props.autofill.coborrower.birthplace
        formData.coborrower.occupation = props.autofill.coborrower.occupation
        formData.coborrower.contact_no = props.autofill.coborrower.contact_no
        hasCoborrower.value = true
    }
}

const submit = async function () {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true

    const preprocessedFormData = {
        loanType: formData.type,
        term: formData.term,
        paymentFrequency: formData.paymentFrequency.toLowerCase(),
        coborrower: {
            name: {
                given: hasCoborrower.value ? formData.coborrower.name.given : '',
                middle: hasCoborrower.value ? formData.coborrower.name.middle : '',
                last: hasCoborrower.value ? formData.coborrower.name.last : ''
            },
            birthday: hasCoborrower.value ? formData.coborrower.birthday : '',
            birthplace: hasCoborrower.value ? formData.coborrower.birthplace : '',
            occupation: hasCoborrower.value ? formData.coborrower.occupation : '',
            contact_no: hasCoborrower.value ? formData.coborrower.contact_no : ''
        }
    }

    const res = await fetch(`${API_URL}/loans/${props.loanID}`, {
        credentials: 'omit',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        },
        body: JSON.stringify(preprocessedFormData)
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
        props.onsubmit()
        return true
    }
}

// Lifecycle hooks
onMounted(() => {
    if (props.autofill) {
        updateAutofill()
    }
})
</script>

<template>
    <h2 class="header-wrapper">Edit Loan</h2>
    <div class="wrapper">
        <div id="loan-ledger-wrapper" ref="loanLedgerRefTable" class="w-100 px-4"></div>

        <!-- Edit transaction form -->
        <VForm id="loan-ledger-edit-form" ref="form">
            <VSelect
                class="ml-3"
                label="Loan Type"
                :items="loanTypes"
                v-model="formData.type"
                :rules="[FORM_RULES.required]"
            >
            </VSelect>

            <VTextField
                v-number-only
                class="ml-3"
                type="number"
                label="Loan Term"
                :rules="[FORM_RULES.required]"
                v-model="formData.term"
            />
            <VSelect
                class="ml-3"
                label="Mode of Payment"
                :items="PAYMENT_FREQUENCIES"
                v-model="formData.paymentFrequency"
                :rules="[FORM_RULES.required]"
            >
            </VSelect>

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
                            <div>Coborrower First Name:</div>
                        </div>
                        <VTextField
                            class="username-pw-input"
                            v-model="formData.coborrower.name.given"
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
                            v-model="formData.coborrower.name.middle"
                            label="Enter Coborrower Middle Name"
                        />
                    </div>
                    <div class="row-tab">
                        <div class="label">
                            <div>Coborrower Last Name:</div>
                        </div>
                        <VTextField
                            class="username-pw-input"
                            v-model="formData.coborrower.name.last"
                            :rules="[FORM_RULES.required]"
                            label="Enter Coborrower Last Name"
                        />
                    </div>
                    <div class="row-tab">
                        <div class="label">
                            <div>Coborrower Date of Birth:</div>
                        </div>
                        <VTextField
                            class="username-pw-input"
                            v-model="formData.coborrower.birthday"
                            type="date"
                            :rules="[FORM_RULES.required]"
                            label="Enter Coborrower Date of Birth"
                        />
                    </div>
                    <div class="row-tab">
                        <div class="label">
                            <div>Coborrower Place of Birth:</div>
                        </div>
                        <VTextField
                            class="username-pw-input"
                            v-model="formData.coborrower.birthplace"
                            :rules="[FORM_RULES.required]"
                            label="Enter Coborrower Place of Birth"
                        />
                    </div>
                    <div class="row-tab">
                        <div class="label">
                            <div>Coborrower Occupation/Source of Income:</div>
                        </div>
                        <VTextField
                            class="username-pw-input"
                            v-model="formData.coborrower.occupation"
                            :rules="[FORM_RULES.required]"
                            label="Enter Coborrower Occupation/Source of Income"
                        />
                    </div>
                    <div class="row-tab">
                        <div class="label">
                            <div>Coborrower Contact Number:</div>
                        </div>
                        <VTextField
                            class="username-pw-input"
                            v-model="formData.coborrower.contact_no"
                            :rules="[FORM_RULES.required]"
                            label="Enter Coborrower Contact Number"
                        />
                    </div>
                </div>
            </VExpandTransition>

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

.header2 {
    font-size: 1.2rem;
    margin-bottom: 3%;
    font-weight: bold;
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
