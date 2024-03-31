<script setup>
// Import packages
import { ref, reactive, onMounted, watch } from 'vue'
import { psgc } from 'ph-locations'

// Philippine locations
const { regions, provinces, citiesMunicipalities } = psgc

import { formatUTC } from '../../modules/datetime/formatDate.js'

// Import constants
import { API_URL, FORM_RULES } from '../../constants/index.js'

// Define reactive variables
const errorMessage = ref('')
const errorAlert = ref(false)
const form = ref(null)
const loading = ref(false)
const locationsItems = reactive({
    provinces: [],
    cities: []
})

// Define form fields
const userData = reactive({
    username: '',
    name: {
        given: '',
        middle: '',
        last: ''
    },
    birthday: '',
    birthplace: '',
    sex: '',
    civil_status: '',
    tin_no: '',
    monthly_income: '',
    contact_no: '',
    address: {
        street: '',
        barangay: '',
        city: '',
        province: '',
        region: ''
    },
    occupation: '',
    spouse: {
        name: {
            given: '',
            middle: '',
            last: ''
        },
        birthday: '',
        birthplace: '',
        contact_no: '',
        occupation: ''
    }
})

// Props
const props = defineProps({
    action: {
        type: String,
        default: () => 'register',
        validator: (value) => {
            return ['register', 'update'].includes(value)
        }
    },
    autofill: {
        type: Object,
        default: () => null
    },
    onsubmit: {
        type: Function,
        default: () => () => null
    }
})

const submitForm = async function () {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true

    const fn = props.action === 'update' ? updateUser : registerUser
    const res = await fn()
    loading.value = false
    if (res) props.onsubmit()
}

const autofillFormIfPossible = function () {
    if (props.autofill) {
        let autofillData = { ...props.autofill }
        autofillData.birthday = formatUTC(autofillData.birthday)
        if (autofillData.spouse) {
            autofillData.spouse.birthday = formatUTC(autofillData.spouse.birthday)
        } else {
            delete autofillData.spouse
        }
        Object.assign(userData, autofillData)
    }
}

const updateUser = async function () {
    const credentials = window.$cookies.get('credentials')

    if (!credentials) {
        errorAlert.value = true
        errorMessage.value = 'Please log in as officer to continue'
        return false
    }

    const { token } = credentials

    if (!token) {
        errorAlert.value = true
        errorMessage.value = 'Please log in as officer to continue'
        return false
    }

    const result = await fetch(`${API_URL}/users/${userData.username}`, {
        credentials: 'omit',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })

    errorMessage.value = ''
    errorAlert.value = false

    // TODO: should alert the user on a successful edit

    if (result.status === 200) {
        return true
    } else if (result.status === 400) {
        const jsonRes = await result.json()
        errorMessage.value = jsonRes.message
        errorAlert.value = true
    } else if (result.status === 500) {
        errorMessage.value = 'Internal Server Error'
        errorAlert.value = true
    }

    return false
}

const registerUser = async function () {
    const credentials = window.$cookies.get('credentials')

    if (!credentials) {
        errorAlert.value = true
        errorMessage.value = 'Please log in as officer to continue'
        return false
    }

    const { token } = credentials

    if (!token) {
        errorAlert.value = true
        errorMessage.value = 'Please log in as officer to continue'
        return false
    }

    const result = await fetch(`${API_URL}/users/`, {
        credentials: 'omit',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })

    errorMessage.value = ''
    errorAlert.value = false

    if (result.status === 200) {
        form.value.reset()
        return true
    } else if (result.status === 400) {
        const jsonRes = await result.json()
        errorMessage.value = jsonRes.message
        errorAlert.value = true
    } else if (result.status === 500) {
        errorMessage.value = 'Internal Server Error'
        errorAlert.value = true
    }

    return false
}

// Lifecycle hooks
onMounted(autofillFormIfPossible)
watch(
    () => userData.address.region,
    (newVal) => {
        locationsItems.provinces.splice(0, locationsItems.provinces.length)
        try {
            const { code } = regions.find((item) => item.name === newVal)
            console.log(code)
            locationsItems.provinces.push(
                ...provinces.filter((province) => province.region === code)
            )
        } catch (e) {
            console.error(e)
        }
    }
)
watch(
    () => userData.address.province,
    (newVal) => {
        locationsItems.cities.splice(0, locationsItems.cities.length)
        try {
            const { code } = locationsItems.provinces.find((item) => item.name === newVal)
            locationsItems.cities.push(
                ...citiesMunicipalities.filter((cityMun) => cityMun.province === code)
            )
        } catch (e) {
            console.error(e)
        }
    }
)
</script>

<template>
    <div class="header">
        <div class="header-text">
            {{ props.action === 'update' ? 'Edit' : 'Create' }} Member Profile
        </div>
    </div>
    <div class="info-fields">
        <div class="form-wrapper">
            <VForm id="login-form" ref="form">
                <div class="header2">Borrower's Information</div>

                <!-- Username -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Username:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.username"
                        id="login-username"
                        :rules="[FORM_RULES.required]"
                        label="Enter Username"
                        :disabled="props.action === 'update'"
                    />
                </div>

                <!-- First Name -->
                <div class="row-tab">
                    <div class="label">
                        <div>* First name:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.name.given"
                        id="login-first-name"
                        :rules="[FORM_RULES.required]"
                        label="Enter First Name"
                    />
                </div>

                <!-- Middle Name -->
                <div class="row-tab">
                    <div class="label">
                        <div>Middle name:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.name.middle"
                        id="login-middle-name"
                        label="Enter Middle Name"
                    />
                </div>

                <!-- Last Name -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Last name:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.name.last"
                        id="login-last-name"
                        :rules="[FORM_RULES.required]"
                        label="Enter Last Name"
                    />
                </div>

                <!-- Date of Birth -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Date of Birth:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.birthday"
                        id="login-birthday"
                        type="date"
                        :rules="[FORM_RULES.required]"
                        label="Select Date of Birth"
                    />
                </div>

                <!-- Place of Birth -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Place of Birth:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.birthplace"
                        id="login-birthplace"
                        :rules="[FORM_RULES.required]"
                        label="Enter Place of Birth"
                    />
                </div>

                <!-- Sex -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Sex:</div>
                    </div>

                    <VRadioGroup
                        v-model="userData.sex"
                        id="login-sex"
                        :rules="[FORM_RULES.required]"
                    >
                        <VRadio label="Male" value="M" />
                        <VRadio label="Female" value="F" />
                    </VRadioGroup>
                </div>

                <!-- TIN Number -->
                <div class="row-tab">
                    <div class="label">
                        <div>* TIN Number:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.tin_no"
                        id="login-tin-number"
                        :rules="[FORM_RULES.required, FORM_RULES.tin]"
                        label="Enter TIN Number (XXX-XXX-XXX-XXX)"
                    />
                </div>

                <!-- Civil Status -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Civil Status:</div>
                    </div>

                    <VSelect
                        class="username-pw-input"
                        v-model="userData.civil_status"
                        :items="['Single', 'Married']"
                        id="login-civil-status"
                        :rules="[FORM_RULES.required]"
                        label="Select Civil Status"
                    />
                </div>

                <!-- Contact Number -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Contact Number:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.contact_no"
                        id="login-contact-number"
                        :rules="[FORM_RULES.required]"
                        label="Enter Contact Number"
                    />
                </div>

                <!-- Monthly Income -->
                <div class="row-tab">
                    <div class="label">
                        <div>* Monthly Income:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.monthly_income"
                        id="login-monthly-income"
                        type="number"
                        v-number-only
                        :rules="[FORM_RULES.required]"
                        label="Enter Monthly Income"
                    />
                </div>

                <div class="row-tab">
                    <div class="label">
                        <div>* Occupation/Source of Income:</div>
                    </div>

                    <VTextField
                        class="username-pw-input"
                        v-model="userData.occupation"
                        id="login-occupation"
                        :rules="[FORM_RULES.required]"
                        label="Enter Occupation/Source of Income"
                    />
                </div>

                <!-- Borrower's Residence -->
                <div class="header2">Borrower's Residence</div>

                <div class="row-tab">
                    <div class="label">
                        <div>* Region:</div>
                    </div>

                    <VAutocomplete
                        class="username-pw-input"
                        v-model="userData.address.region"
                        id="login-address-region"
                        :rules="[FORM_RULES.required]"
                        label="Enter Region"
                        auto-select-first
                        :items="
                            regions.map((region) => ({
                                ...region,
                                title: `${region.name} (${region.altName})`
                            }))
                        "
                        item-title="title"
                        item-value="name"
                    />
                </div>

                <VExpandTransition>
                    <div class="row-tab" v-if="userData.address.region">
                        <div class="label">
                            <div>* Province:</div>
                        </div>

                        <VAutocomplete
                            class="username-pw-input"
                            v-model="userData.address.province"
                            id="login-address-province"
                            :rules="[FORM_RULES.required]"
                            label="Enter Province"
                            auto-select-first
                            :items="locationsItems.provinces"
                            item-title="name"
                            item-value="name"
                        />
                    </div>
                </VExpandTransition>

                <VExpandTransition>
                    <div class="row-tab" v-if="userData.address.province">
                        <div class="label">
                            <div>* City:</div>
                        </div>

                        <VAutocomplete
                            class="username-pw-input"
                            v-model="userData.address.city"
                            id="login-address-city"
                            :rules="[FORM_RULES.required]"
                            label="Enter City"
                            auto-select-first
                            :items="locationsItems.cities"
                            item-title="name"
                            item-value="name"
                        />
                    </div>
                </VExpandTransition>

                <VExpandTransition>
                    <div class="row-tab" v-if="userData.address.city">
                        <div class="label">
                            <div>* Barangay:</div>
                        </div>

                        <VTextField
                            class="username-pw-input"
                            v-model="userData.address.barangay"
                            id="login-address-barangay"
                            :rules="[FORM_RULES.required]"
                            label="Enter Barangay"
                        />
                    </div>
                </VExpandTransition>

                <VExpandTransition>
                    <div class="row-tab" v-if="userData.address.barangay">
                        <div class="label">
                            <div>* Street:</div>
                        </div>

                        <VTextField
                            class="username-pw-input"
                            v-model="userData.address.street"
                            id="login-address-street"
                            :rules="[FORM_RULES.required]"
                            label="Enter Street"
                        />
                    </div>
                </VExpandTransition>

                <!-- Spouse's Information -->
                <VExpandTransition>
                    <div v-if="userData.civil_status === 'Married'">
                        <div class="header2">Spouse's Information</div>

                        <div class="row-tab">
                            <div class="label">
                                <div>* Spouse's First Name:</div>
                            </div>

                            <VTextField
                                class="username-pw-input"
                                v-model="userData.spouse.name.given"
                                id="login-spouse-first-name"
                                label="Enter Spouse's First Name"
                                :rules="[FORM_RULES.required]"
                            />
                        </div>

                        <div class="row-tab">
                            <div class="label">
                                <div>Spouse's Middle Name:</div>
                            </div>

                            <VTextField
                                class="username-pw-input"
                                v-model="userData.spouse.name.middle"
                                id="login-spouse-middle-name"
                                label="Enter Spouse's Middle Name"
                                :rules="[FORM_RULES.required]"
                            />
                        </div>

                        <div class="row-tab">
                            <div class="label">
                                <div>* Spouse's Last Name:</div>
                            </div>

                            <VTextField
                                class="username-pw-input"
                                v-model="userData.spouse.name.last"
                                id="login-spouse-last-name"
                                label="Enter Spouse's Last Name"
                                :rules="[FORM_RULES.required]"
                            />
                        </div>

                        <div class="row-tab">
                            <div class="label">
                                <div>* Spouse's Date of Birth:</div>
                            </div>

                            <VTextField
                                class="username-pw-input"
                                v-model="userData.spouse.birthday"
                                id="login-spouse-birthday"
                                type="date"
                                label="Select Spouse's Date of Birth"
                                :rules="[FORM_RULES.required]"
                            />
                        </div>

                        <div class="row-tab">
                            <div class="label">
                                <div>* Spouse's Place of Birth:</div>
                            </div>

                            <VTextField
                                class="username-pw-input"
                                v-model="userData.spouse.birthplace"
                                id="login-spouse-birthplace"
                                label="Enter Spouse's Place of Birth"
                                :rules="[FORM_RULES.required]"
                            />
                        </div>

                        <div class="row-tab">
                            <div class="label">
                                <div>* Spouse's Contact Number:</div>
                            </div>

                            <VTextField
                                class="username-pw-input"
                                v-model="userData.spouse.contact_no"
                                id="login-spouse-contact-number"
                                label="Enter Spouse's Contact Number"
                                :rules="[FORM_RULES.required]"
                            />
                        </div>

                        <div class="row-tab">
                            <div class="label">
                                <div>* Spouse's Occupation/Source of Income:</div>
                            </div>

                            <VTextField
                                class="username-pw-input"
                                v-model="userData.spouse.occupation"
                                id="login-spouse-occupation"
                                label="Enter Spouse's Occupation/Source of Income"
                                :rules="[FORM_RULES.required]"
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
                    <VBtn
                        type="submit"
                        class="btn capitalize-text"
                        @click.prevent="submitForm"
                        :loading="loading"
                        >{{ props.action === 'update' ? 'Edit' : 'Create' }} Member Profile
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

.wrapper {
    background: var(--vt-c-white);
    border-radius: 5px;

    width: 60vw;
    max-height: 80vh;

    display: flex;
    flex-direction: column;
    overflow: auto;
}

.info-fields {
    background-color: var(--vt-c-white);
    padding: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    overflow: auto;
}

.form-wrapper {
    background-color: var(--vt-c-white);
}

.header {
    background-color: var(--vt-c-white-off);
    width: 100%;
    padding-bottom: 3%;

    position: sticky;
    top: 0;
    z-index: 1000;

    font-size: 1.5rem;
    font-weight: bold;
    margin-left: 5%;
}

.header-text {
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
    width: 30%;

    display: inline-block;
    text-align: right;
    vertical-align: top;
}

.error-msg-wrapper {
    width: 100%;
    height: 7vh;
    position: absolute;
    z-index: 999;
}

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
