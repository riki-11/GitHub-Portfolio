<script setup>
import { ref, onMounted, reactive } from 'vue'
import { API_URL } from '../../constants'

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

const props = defineProps({
    header: {
        type: String,
        required: true
    }
})

const setting_keys = {
    Emergency: 'emergency',
    Educational: 'educational',
    'Petty Cash': 'pettyCash',
    'Multipurpose Cash': 'multipurpose',
    Commercial: 'commercial',
    Livelihood: 'livelihood'
}

const errorMessage = ref('')
const errorAlert = ref(false)
const loading = ref(false)
const snackbar = ref(false)

const formData = reactive({
    interest_rate: { unit: '', value: 0 },
    service_fee: { unit: '', value: 0, enabled: false },
    capital_build_up: { unit: '', value: 0, enabled: false },
    savings: { unit: '', value: 0, enabled: false },
    time: { type: '', value: 0 }
})

const updateAutofill = async function () {
    const res = await fetch(`${API_URL}/settings/loans`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        }
    })

    const resJSON = await res.json()
    const settingsData = resJSON.settings[setting_keys[props.header]]

    Object.assign(formData, settingsData)
}

const submit = async function () {
    loading.value = true

    const res = await fetch(`${API_URL}/settings/loans/${setting_keys[props.header]}`, {
        credentials: 'omit',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.$cookies.get('credentials').token}`
        },
        body: JSON.stringify({ ...formData })
    })

    loading.value = false

    const { error, message } = await res.json()

    errorAlert.value = false

    if (!error) {
        snackbar.value = true
    } else {
        errorAlert.value = true
        errorMessage.value = message
    }
}

onMounted(async () => {
    await updateAutofill()
})
</script>

<template>
    <div>
        <h3 class="pb-2">{{ props.header }}</h3>
        <div class="wrapper w-100 rounded-lg pb-5">
            <VForm ref="form">
                <div>
                    <!-- Interest Rate -->
                    <div class="row-tab mb-n5">
                        <div class="label">
                            <div>Interest Rate</div>
                        </div>

                        <div class="w-25 d-flex">
                            <VTextField
                                class="mt-2 center-affix"
                                variant="underlined"
                                placeholder="Value"
                                type="number"
                                v-number-only
                                :rules="[rules.maxDecimalPlaces(2)]"
                                v-model="formData.interest_rate.value"
                            />
                        </div>

                        <div class="mt-4 ml-3 w-25">
                            <v-select
                                density="compact"
                                :items="['%', 'Fixed']"
                                v-model="formData.interest_rate.unit"
                            ></v-select>
                        </div>
                    </div>

                    <!-- Time -->
                    <div class="row-tab">
                        <div class="label">
                            <div>Gain interest every</div>
                        </div>

                        <div class="w-25 d-flex">
                            <VTextField
                                class="mt-2 center-affix"
                                variant="underlined"
                                placeholder="Value"
                                type="number"
                                v-number-only
                                :rules="[rules.maxDecimalPlaces(2)]"
                                v-model="formData.time.value"
                            />
                        </div>

                        <div class="mt-4 ml-3 w-25">
                            <v-select
                                density="compact"
                                :items="['days', 'months', 'years']"
                                v-model="formData.time.type"
                            ></v-select>
                        </div>
                    </div>

                    <h4 class="ml-4">Initial Deductions</h4>

                    <!-- Service Fee -->
                    <div class="row-tab mb-n5">
                        <div class="label">
                            <div>Service Fee</div>
                        </div>

                        <div class="w-25 d-flex">
                            <VTextField
                                class="mt-2 center-affix"
                                variant="underlined"
                                placeholder="Value"
                                type="number"
                                v-number-only
                                :rules="[rules.maxDecimalPlaces(2)]"
                                v-model="formData.service_fee.value"
                                :disabled="!formData.service_fee.enabled"
                            />
                        </div>

                        <div class="mt-4 ml-3 w-25">
                            <v-select
                                density="compact"
                                :items="['%', 'Fixed']"
                                v-model="formData.service_fee.unit"
                                :disabled="!formData.service_fee.enabled"
                            ></v-select>
                        </div>

                        <v-checkbox
                            class="mt-2 mb-n2"
                            v-model="formData.service_fee.enabled"
                        ></v-checkbox>
                    </div>

                    <!-- Capital Build Up (CBU) -->
                    <div class="row-tab mb-n5">
                        <div class="label">
                            <div>Capital Build Up (CBU)</div>
                        </div>

                        <div class="w-25 d-flex">
                            <VTextField
                                class="mt-2 center-affix"
                                variant="underlined"
                                placeholder="Value"
                                type="number"
                                v-number-only
                                :rules="[rules.maxDecimalPlaces(2)]"
                                v-model="formData.capital_build_up.value"
                                :disabled="!formData.capital_build_up.enabled"
                            />
                        </div>

                        <div class="mt-4 ml-3 w-25">
                            <v-select
                                density="compact"
                                :items="['%', 'Fixed']"
                                v-model="formData.capital_build_up.unit"
                                :disabled="!formData.capital_build_up.enabled"
                            ></v-select>
                        </div>

                        <v-checkbox
                            class="mt-2 mb-n2"
                            v-model="formData.capital_build_up.enabled"
                        ></v-checkbox>
                    </div>

                    <!-- Savings -->
                    <div class="row-tab mb-n5">
                        <div class="label">
                            <div>Savings</div>
                        </div>

                        <div class="w-25 d-flex">
                            <VTextField
                                class="mt-2 center-affix"
                                variant="underlined"
                                placeholder="Value"
                                type="number"
                                v-number-only
                                :rules="[rules.maxDecimalPlaces(2)]"
                                v-model="formData.savings.value"
                                :disabled="!formData.savings.enabled"
                            />
                        </div>

                        <div class="mt-4 ml-3 w-25">
                            <v-select
                                density="compact"
                                :items="['%', 'Fixed']"
                                v-model="formData.savings.unit"
                                :disabled="!formData.savings.enabled"
                            ></v-select>
                        </div>

                        <v-checkbox
                            class="mt-2 mb-n2"
                            v-model="formData.savings.enabled"
                        ></v-checkbox>
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
            <v-snackbar v-model="snackbar" rounded="pill"
                >Successfully updated settings!
            </v-snackbar>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    border: 1px solid var(--vt-c-gray);
    margin-bottom: 2%;
}

.row-tab {
    /* border: 1px solid black; */
    display: flex;
}

.label {
    margin-top: 5.2%;
    margin-right: 6%;

    /* border: 1px solid black; */
    width: 35%;

    display: inline-block;
    text-align: right;
    vertical-align: top;
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
    margin-top: 7%;
    margin-right: 2%;
}
</style>
